import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    ReactiveFormsModule,
    AngularFireAuthModule,
    SharedModule,
    AuthRoutingModule,
  ],
  exports: [],
})
export class AuthModule {}
