import { createReducer, on } from '@ngrx/store';
import * as UIactions from './ui.actions';

export interface IUiState {
  isLoading: boolean;
}

export const initialState: IUiState = {
  isLoading: false,
};

export const uiReducer = createReducer(
  initialState,
  on(UIactions.StartLoading, (state) => ({ isLoading: true })),
  on(UIactions.StopLoading, (state) => ({ isLoading: false }))
);

export const getIsLoading = (state: IUiState) => state.isLoading;
