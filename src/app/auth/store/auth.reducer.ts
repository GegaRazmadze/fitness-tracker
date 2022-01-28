import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface IAuthState {
  isAuthenticated: boolean;
}

export const initialState: IAuthState = {
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.SetAuthenticated, (state) => ({ isAuthenticated: true })),
  on(AuthActions.SetUnauthenticated, (state) => ({ isAuthenticated: false }))
);

export const getIsAuth = (state: IAuthState) => state.isAuthenticated;
