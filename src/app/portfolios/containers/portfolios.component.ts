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
import { AlphaVantageQuote } from '../../shared/models/quote-response.model';
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
  rebalanceSubscriptions: SubscriptionLike[];
  refreshSubscriptions: SubscriptionLike[];

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
    this.loadPortfolios();
    this.currencyExchange = {};
    this.rebalanceSubscriptions = [];
    this.refreshSubscriptions = [];
  }

  ngOnDestroy(): void {
    for (const subscription of this.rebalanceSubscriptions) {
      subscription.unsubscribe();
    }
    for (const subscription of this.refreshSubscriptions) {
      subscription.unsubscribe();
    }
  }

  get user() {
    return this.afAuth.auth.currentUser;
  }

  loadPortfolios() {
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

  onPortfolioDeleteSecurity(event: any) {
    this.modalRef = this.modalService.show(ConfirmModalComponent, this.modalConfig);

    this.modalRef.content.confirmation.pipe(take(1)).subscribe( (confirmation: boolean) => {
      if (confirmation) {
        const portfolio = event.portfolio;
        portfolio.securities = portfolio.securities.filter((v: Security) => v !== event.security);
        this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio }));
      }
    });  
  }

  onPortfolioRebalance(portfolio: Portfolio) {
    if (portfolio && portfolio.securities) {
      const prices: {[key: string]: Observable<any>} = {};

      for (const security of portfolio.securities) {
        if (!prices['C-' + security.currency] ) {
          prices['C-' + security.currency] = this.alphavantageService.getCurrencyExchange(security.currency, 'USD');
        }

        if (!prices['S-' + security.symbol]) {
          prices['S-' + security.symbol] = this.alphavantageService.getQuoteForSymbol(security.symbol).pipe(
            map((response: AlphaVantageQuote) => response.price)
          );
        }
      }

      this.rebalanceSubscriptions.push(forkJoin(prices).pipe(
        tap(prices => {
          this.refreshAndRebalancePortfolio(portfolio, prices);
        })
      ).subscribe());
    }
  }

  refreshAndRebalancePortfolio(portfolio: Portfolio, prices: {[key: string]: number}) {
    console.log(prices);
    for (const security of portfolio.securities) {
      security.price = prices['S-'  + security.symbol];
      security.usPrice = security.price * prices['C-' + security.currency];
      security.count = Math.floor(
        ((security.percentage as number / 100) * portfolio.investment as number) / (security.usPrice as number)
      );

    }
    this.store.dispatch(new fromPortfolios.PortfolioEdited({  portfolio: portfolio }));
    this.loadPortfolios();
  }

  onRefreshPortfolio(portfolio: Portfolio) {
    const prices: {[key: string]: Observable<string>} = {} ;
    for (const security of portfolio.securities) {
      prices[security.symbol] = this.alphavantageService.getQuoteForSymbol(security.symbol).pipe(
        map((response: AlphaVantageQuote) => response.price)
      );
    }

    this.refreshSubscriptions.push(forkJoin(prices).pipe(
      //tap(console.log),
      tap(prices => {
        this.refreshPortfolio(portfolio, prices);
      })
    ).subscribe());
  }

  refreshPortfolio(portfolio: Portfolio, prices: {[key: string]: number}) {
    for (const security of portfolio.securities) {
      security.price = prices[security.symbol];
    }
    this.store.dispatch(new fromPortfolios.PortfolioEdited({  portfolio: portfolio }));
    this.loadPortfolios();
  }

}
