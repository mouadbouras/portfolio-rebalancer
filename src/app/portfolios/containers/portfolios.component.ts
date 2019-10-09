import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
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
  subscriptions: SubscriptionLike[];

  modalConfig = {
    class: 'modal-dialog-scrollable modal-lg'
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
        if (security.currency && !this.currencyExchange[security.currency]) {
          this.currencyExchange[security.currency] = {
            rate:  this.alphavantageService.getCurrencyExchange(security.currency, 'USD'),
            date: new Date(),
          } as ExchangeRate;
        }
      }
      this.rebalancePortfolio(portfolio);
    }
    // if (this.currencyExchange['USD']) {
    //   console.log(this.currencyExchange);
    // } else {
    //   this.currencyExchange['USD'] = {
    //     rate: 1.35,
    //     date: new Date(),
    //   } as ExchangeRate;
    //   console.log(this.currencyExchange);
    // }
  }

  rebalancePortfolio(portfolio: Portfolio) {
    const portfolioCopy = JSON.parse(JSON.stringify(portfolio));
    for (const security of portfolioCopy.securities) {
      this.subscriptions.push(this.currencyExchange[security.currency].rate.pipe(
        tap(rate => {
          security.usPrice = security.price  * rate;
          security.count = Math.floor(
            ((security.percentage as number / 100) * portfolioCopy.investment as number) / (security.usPrice as number)
          );
        })
      ).subscribe());
    }
    console.log(portfolioCopy);
    this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolioCopy }));
  }
}
