import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  private SubscriptionExercise!: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.SubscriptionExercise = this.trainingService.exerciseChanged.subscribe(
      (exercise) => {
        exercise
          ? (this.ongoingTraining = true)
          : (this.ongoingTraining = false);
        // if (exercise) {
        //   this.ongoingTraining = true;
        // } else {
        //   this.ongoingTraining = false;
        // }
      }
    );
  }

  // onTrainingStartEndToggle() {
  //   this.ongoingTraining = !this.ongoingTraining;
  // }

  ngOnDestroy(): void {
    if (this.SubscriptionExercise) {
      this.SubscriptionExercise.unsubscribe();
    }
  }
}
