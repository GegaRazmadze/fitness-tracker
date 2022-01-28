import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { from, Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading$!: Observable<boolean>;

  // private SubscriptionLoading!: Subscription;

  constructor(
    private authService: AuthService,
    // private uiService: UIService,
    private store: Store<fromRoot.IAppState>
  ) {}

  ngOnInit() {
    // this.store.select('ui').subscribe(data => console.log(data))
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    // this.SubscriptionLoading = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading: boolean) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }

  // ngOnDestroy(): void {
  //   if (this.SubscriptionLoading) {
  //     this.SubscriptionLoading.unsubscribe();
  //   }
  // }
}
