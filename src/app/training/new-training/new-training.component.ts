import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];

  SubscriptionExercise!: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.SubscriptionExercise = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.SubscriptionExercise.unsubscribe();
  }
}
