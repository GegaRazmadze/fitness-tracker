import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

import * as fromRoot from '../store/app.reducer';
import * as UI from '../shared/store/ui.actions';
import * as Auth from '../auth/store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.IAppState>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(UI.StopLoading());
        this.uiService.showSnackbar(error.message, undefined, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(UI.StopLoading());
        this.uiService.showSnackbar(error.message, undefined, 3000);
      });
  }

  logout() {
    this.afAuth.signOut();
  }
}
