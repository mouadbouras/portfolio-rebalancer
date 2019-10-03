import { PortfoliosActions, PortfoliosActionTypes } from './portfolios.actions';
import { portfoliosInitialState, PortfoliosState } from './portfolios.state';


export function portfoliosReducer(state = portfoliosInitialState, action: PortfoliosActions): PortfoliosState {
  switch (action.type) {

    case PortfoliosActionTypes.PORTFOLIOS_QUERY: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case PortfoliosActionTypes.PORTFOLIOS_LOADED: {
      return Object.assign({}, state, {
        portfolios: action.payload.portfolios,
        loading: false,
      });
    }

    case PortfoliosActionTypes.PORTFOLIOS_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: action.payload.error
      });
    }

    default:
      return state;
  }
}
