import { Routes } from '@angular/router';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { UserListComponent } from './user-list/user-list.component';
import {LoginRegisterComponent} from "./login-register/login-register.component";
import {ProfileComponent} from "./profile/profile.component";
export const routes: Routes = [
  { path: '', redirectTo: 'evaluation', pathMatch: 'full' },
  { path: 'evaluation', component: EvaluationsComponent },
  { path: 'user', component: UserListComponent },
  { path: 'register', component: LoginRegisterComponent},
  { path: 'profile', component: ProfileComponent},];
