import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { PortfoliosActionTypes } from './portfolios.actions';
import * as fromPortfolios from './portfolios.actions';
import { AppState } from '../../reducers/index';
import { getUser } from '../../auth/store/auth.selectors';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../model/portfolio.model';

@Injectable()
export class PortfoliosEffects {

  constructor(
    private actions$: Actions,
    private portfolioService: PortfolioService,
    private store: Store<AppState>) {}

  @Effect()
  query$ = this.actions$.pipe(
    ofType(PortfoliosActionTypes.PORTFOLIOS_QUERY),
    withLatestFrom(this.store.pipe(select(getUser))),
    switchMap(([, user]: any) => {
      return this.portfolioService.get(user.uid)
      .pipe(
        map((data: any) => {
          const portfoliosData: Portfolio[] = data.map((res: any) => {
            const key = res.payload.key;
            const portfolio: Portfolio = res.payload.val();
            return {
              key: key || null,
              name: portfolio.name || null,
              securities: portfolio.securities || null,
              investment: portfolio.investment || null
            };
          });
          return (new fromPortfolios.PortfoliosLoaded({ portfolios: portfoliosData }));
        }),
        catchError(error => of(new fromPortfolios.PortfoliosError({ error })))
      );
    }),
  );

  @Effect({ dispatch: false })
  added$ = this.actions$.pipe(
    ofType(PortfoliosActionTypes.PORTFOLIO_ADDED),
    map((action: fromPortfolios.PortfolioAdded) => action.payload),
    withLatestFrom(this.store.pipe(select(getUser))),
    switchMap(([payload, user]: any) => this.portfolioService.add(payload.portfolio, user.uid))
  );

  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(PortfoliosActionTypes.PORTFOLIO_DELETED),
    map((action: fromPortfolios.PortfolioDeleted) => action.payload),
    withLatestFrom(this.store.pipe(select(getUser))),
    switchMap(([payload, user]: any) => this.portfolioService.delete(payload.portfolio, user.uid))
  );

  @Effect({ dispatch: false })
  edit$ = this.actions$.pipe(
    ofType(PortfoliosActionTypes.PORTFOLIO_EDITED),
    map((action: fromPortfolios.PortfolioEdited) => action.payload),
    withLatestFrom(this.store.pipe(select(getUser))),
    switchMap(([payload, user]: any) => this.portfolioService.update(payload.portfolio, user.uid)
    )
  );

}
