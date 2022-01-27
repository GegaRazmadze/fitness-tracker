import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercise: Exercise[] = [];

  private runningExercise!: Exercise;

  private SubsFb: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
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
            this.uiService.loadingStateChanged.next(false);
            this.availableExercise = exercises;
            this.exercisesChanged.next([...this.availableExercise]);
          },
          (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              undefined,
              3000
            );
            this.exercisesChanged.next(null!);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // this.db
    //   .doc('availableExercises/' + selectedId)
    //   .update({ lastSelected: new Date() });
    this.runningExercise = this.availableExercise.find(
      (ex) => ex.id === selectedId
    )!;
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    this.SubsFb.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: any[]) => {
            this.finishedExercisesChanged.next(exercises);
          }
          // (error) => {
          //   console.log(error);
          // }
        )
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
