import { Action } from '@ngrx/store';
import { Portfolio } from '../model/portfolio.model';

export enum PortfoliosActionTypes {
  PORTFOLIOS_QUERY = '[Portfolios] Portfolios query',
  PORTFOLIOS_LOADED = '[Portfolios] Portfolios loaded',

  PORTFOLIO_ADDED = '[Portfolios] Portfolios added',

  PORTFOLIO_EDITED = '[Portfolios] Portfolios edited',
  PORTFOLIO_DELETED = '[Portfolios] Portfolios deleted',

  PORTFOLIOS_ERROR = '[Portfolios] Portfolios error'
}

export class PortfoliosQuery implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIOS_QUERY;
}

export class PortfoliosLoaded implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIOS_LOADED;

  constructor(public payload: { portfolios: Portfolio[] }) {}
}

export class PortfolioAdded implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIO_ADDED;

  constructor(public payload: { portfolio: Portfolio}) {}
}

export class PortfolioEdited implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIO_EDITED;

  constructor(public payload: { portfolio: Portfolio }) {}
}

export class PortfolioDeleted implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIO_DELETED;

  constructor(public payload: { portfolio: Portfolio }) {}
}

export class PortfoliosError implements Action {
  readonly type = PortfoliosActionTypes.PORTFOLIOS_ERROR;

  constructor(public payload: { error: any }) {}
}

export type PortfoliosActions =
  | PortfoliosQuery
  | PortfoliosLoaded
  | PortfolioAdded
  | PortfolioEdited
  | PortfolioDeleted
  | PortfoliosError;
