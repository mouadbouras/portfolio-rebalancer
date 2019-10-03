import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PortfoliosState } from './portfolios.state';


export const getPortfoliosState = createFeatureSelector<PortfoliosState>('portfolios');

export const getPortfolios = createSelector(
  getPortfoliosState,
  portfolios => portfolios.portfolios
);

export const getAllLoaded = createSelector(
  getPortfoliosState,
  portfolios => portfolios.loading
);

export const getError = createSelector(
  getPortfoliosState,
  portfolios => portfolios.error
);
