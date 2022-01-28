import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromTraining from './store/training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$!: Observable<boolean>;

  constructor(private store: Store<fromTraining.INewGlobalState>) {}

  ngOnInit(): void {
    this.ongoingTraining$! = this.store.select(fromTraining.getIsTraining);
  }
}
