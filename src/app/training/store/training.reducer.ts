import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Exercise } from '../exercise.model';
import * as TrainingActions from './training.actions';
import * as fromRoot from '../../store/app.reducer';

export interface ITrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface INewGlobalState extends fromRoot.IAppState {
  training: ITrainingState;
}

export const initialState: ITrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null!,
};

export const trainingReducer = createReducer(
  initialState,
  on(TrainingActions.SetAvailableTraining, (state, { exercises }) => ({
    ...state,
    availableExercises: exercises,
  })),
  on(TrainingActions.SetFiniShedTraining, (state, { exercises }) => ({
    ...state,
    finishedExercises: exercises,
  })),
  on(TrainingActions.StartTraining, (state, { selectedId }) => ({
    ...state,
    activeTraining: {
      ...state.availableExercises.find((ex) => ex.id === selectedId)!,
    },
  })),
  on(TrainingActions.StopTraining, (state) => ({
    ...state,
    activeTraining: null!,
  }))
);

export const getTrainingState =
  createFeatureSelector<ITrainingState>('training');

export const getAvailableTrainings = createSelector(
  getTrainingState,
  (state: ITrainingState) => state.availableExercises
);
export const getFinishedTrainings = createSelector(
  getTrainingState,
  (state: ITrainingState) => state.finishedExercises
);
export const getActiveTrainings = createSelector(
  getTrainingState,
  (state: ITrainingState) => state.activeTraining
);
export const getIsTraining = createSelector(
  getTrainingState,
  (state: ITrainingState) => state.activeTraining != null
);
