import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availableExercise: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningExercise!: Exercise;

  getExercises() {
    return this.availableExercise.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercise.find(
      (ex) => ex.id === selectedId
    )!;
    this.exerciseChanged.next({ ...this.runningExercise });
  }
}
