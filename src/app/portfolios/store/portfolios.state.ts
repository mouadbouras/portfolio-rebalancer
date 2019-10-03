import { Portfolio } from '../model/portfolio.model';

export interface PortfoliosState {
  portfolios: Portfolio[] | null;
  loading: boolean;
  error: any;
}

export const portfoliosInitialState: PortfoliosState = {
  portfolios: null,
  loading: false,
  error: null
};
