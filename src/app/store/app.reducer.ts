import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUi from '../shared/store/ui.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface IAppState {
  ui: fromUi.IUiState;
  auth: fromAuth.IAuthState;
}

export const reducers: ActionReducerMap<IAppState> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
};

// UI
export const getUiState = createFeatureSelector<fromUi.IUiState>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

// Authentication
export const getAuthState = createFeatureSelector<fromAuth.IAuthState>('auth');
export const getIsAuthenticated = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);
