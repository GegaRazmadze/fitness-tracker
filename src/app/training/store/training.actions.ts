import { createAction, props } from '@ngrx/store';
import { Exercise } from '../exercise.model';

export const SetAvailableTraining = createAction(
  '[Training] Set Available Training',
  props<{ exercises: Exercise[] }>()
);
export const SetFiniShedTraining = createAction(
  '[Training]  set Finished Training',
  props<{ exercises: Exercise[] }>()
);
export const StartTraining = createAction(
  '[Training]  Start Training',
  props<{ selectedId: string }>()
);
export const StopTraining = createAction('[Training]  Stop Training');
