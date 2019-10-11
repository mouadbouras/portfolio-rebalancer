import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, SubscriptionLike, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AngularFireAuth } from '@angular/fire/auth';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Portfolio } from '../model/portfolio.model';
import { getPortfolios, getAllLoaded } from '../store/portfolios.selectors';
import { map, take, tap } from 'rxjs/operators';
import * as fromPortfolios from './../store/portfolios.actions';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PortfolioModalComponent } from '../../shared/components/portfolio-modal/portfolio-modal.component';
import { AlphavantageService } from 'src/app/shared/services/alphavantage.service';
import { ExchangeRate } from '../model/exchange.model';
import { Security } from '../model/security.model';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit, OnDestroy {
  portfolios$: Observable<Portfolio[] | null>;
  isLoading$: Observable<boolean>;
  modalRef: MDBModalRef;
  currencyExchange: { [key: string]: ExchangeRate};
  rates: {[key: string]: Observable<any>};
  subscriptions: SubscriptionLike[];

  modalConfig = {
    class: 'modal-dialog-scrollable modal-xl'
  };

  constructor(
    private store: Store<AppState>,
    private modalService: MDBModalService,
    private afAuth: AngularFireAuth,
    private alphavantageService: AlphavantageService
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(getAllLoaded);
    this.portfolios$ = this.store.pipe(
      select(getPortfolios),
      map((portfolios: Portfolio[]) => {
        if (this.user && !portfolios) {
          this.store.dispatch(new fromPortfolios.PortfoliosQuery());
        }
        return portfolios;
      })
    );

    this.currencyExchange = {};
    this.subscriptions = [];
    this.rates = {};
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get user() {
    return this.afAuth.auth.currentUser;
  }

  openAddPortfolioModal() {
    this.modalRef = this.modalService.show(PortfolioModalComponent, this.modalConfig);

    this.modalRef.content.heading = 'Add new portfolio';

    this.modalRef.content.portfolioData.pipe(
      take(1),
    ).subscribe((portfolioData: Portfolio) => {
      this.store.dispatch(new fromPortfolios.PortfolioAdded({ portfolio: portfolioData }));
    });
  }

  openEditPortfolioModal(portfolio: Portfolio) {
    this.modalRef = this.modalService.show(PortfolioModalComponent, this.modalConfig);

    this.modalRef.content.heading = 'Edit portfolio';
    const portfolioCopy = JSON.parse(JSON.stringify(portfolio));
    const securitiesCopy = JSON.parse(JSON.stringify(portfolioCopy.securities));
    this.modalRef.content.portfolio = portfolioCopy;
    this.modalRef.content.securities = securitiesCopy;

    this.modalRef.content.portfolioData.pipe(take(1)).subscribe( (portfolioData: Portfolio) => {
      this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolioData }));
    });
  }

  openConfirmModal(portfolio: Portfolio) {
    this.modalRef = this.modalService.show(ConfirmModalComponent, this.modalConfig);

    this.modalRef.content.confirmation.pipe(take(1)).subscribe( (confirmation: boolean) => {
      if (confirmation) {
        this.store.dispatch(new fromPortfolios.PortfolioDeleted({ portfolio }));
      }
    });
  }

  onPortfolioDelete(portfolio: Portfolio) {
    this.openConfirmModal(portfolio);
  }

  onPortfolioEdit(portfolio: Portfolio) {
    this.openEditPortfolioModal(portfolio);
  }

  onPortfolioSecuritiesEdited(portfolio: Portfolio) {
    this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolio }));
  }

  onPortfolioRebalance(portfolio: Portfolio) {
    if (portfolio && portfolio.securities) {
      for (const security of portfolio.securities) {
        if (security.currency && !this.rates[security.currency]) {
          this.rates[security.currency] = this.alphavantageService.getCurrencyExchange(security.currency, 'USD');
        }
      }

      this.subscriptions.push(forkJoin(this.rates).pipe(
        tap(console.log),
        tap(rates => {
          this.rebalancePortfolio(portfolio, rates);
        })
      ).subscribe());
    }
  }

  onPortfolioDeleteSecurity(event: any) {
    this.modalRef = this.modalService.show(ConfirmModalComponent, this.modalConfig);

    this.modalRef.content.confirmation.pipe(take(1)).subscribe( (confirmation: boolean) => {
      if (confirmation) {
        const portfolio = event.portfolio;
        portfolio.securities = portfolio.securities.filter((v: Security) => v !== event.security);
        this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio }));
      }
    });  }

  rebalancePortfolio(portfolio: Portfolio, rates: {[key: string]: number}) {
    const portfolioCopy = JSON.parse(JSON.stringify(portfolio));
    for (const security of portfolioCopy.securities) {
      security.usPrice = security.price  * rates[security.currency];
      security.count = Math.floor(
        ((security.percentage as number / 100) * portfolioCopy.investment as number) / (security.usPrice as number)
      );
    }

    this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolioCopy }));
  }
}
