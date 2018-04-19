import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  // Wildcard route
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
