import { Routes } from '@angular/router';
import { Anniv } from './anniv/anniv';

export const routes: Routes = [
  { path: 'anniv', component: Anniv },
  { path: '', redirectTo: '/anniv', pathMatch: 'full' }
];
