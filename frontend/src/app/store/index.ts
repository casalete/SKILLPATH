import {
  getSelectors,
  routerReducer,
  RouterReducerState,
} from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

export interface State {
  // appState: AppState;
  router?: RouterReducerState;
}

export const reducers: ActionReducerMap<State> = {
  // appState: appReducer,
  router: routerReducer,
};

export const selectRouterState = createFeatureSelector<RouterReducerState>(
  'router'
);

export const {
  selectCurrentRoute, // select the current route
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getSelectors(selectRouterState);
