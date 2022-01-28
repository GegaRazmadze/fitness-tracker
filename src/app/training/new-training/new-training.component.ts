import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

import * as fromTraining from '../store/training.reducer';
import * as fromRoot from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  exercises$!: Observable<Exercise[]>;

  isLoading$!: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.INewGlobalState>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableTrainings);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
