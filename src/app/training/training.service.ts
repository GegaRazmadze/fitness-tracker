import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

import * as UI from '../shared/store/ui.actions';
import * as Training from './store/training.actions';
import * as fromTraining from './store/training.reducer';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private SubsFb: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.INewGlobalState>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(UI.StartLoading());
    this.SubsFb.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray: any[]) => {
            // throw(new Error)
            return docArray.map(
              (doc: {
                payload: {
                  doc: {
                    id: string;
                    data: () => {
                      name: string;
                      duration: number;
                      calories: number;
                    };
                  };
                };
              }) => {
                return {
                  id: doc.payload.doc.id,
                  name: doc.payload.doc.data().name,
                  duration: doc.payload.doc.data().duration,
                  calories: doc.payload.doc.data().calories,
                };
              }
            );
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(UI.StopLoading());
            this.store.dispatch(Training.SetAvailableTraining({ exercises }));
          },
          (error) => {
            this.store.dispatch(UI.StopLoading());
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              undefined,
              3000
            );
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(Training.StartTraining({ selectedId }));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTrainings)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTrainings)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
        this.store.dispatch(Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.SubsFb.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: any[]) => {
          this.store.dispatch(Training.SetFiniShedTraining({ exercises }));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    if (this.SubsFb.length > 0) {
      this.SubsFb.forEach((sub) => sub.unsubscribe());
    }
  }
}
