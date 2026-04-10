import { Routes } from '@angular/router';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'evaluation', pathMatch: 'full' },
  { path: 'evaluation', component: EvaluationsComponent },
];
