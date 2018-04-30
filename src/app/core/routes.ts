import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/home/home.component';
import {OverlayDemo} from '@app/overlay-demo/overlay-demo.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'overlay-demo', component: OverlayDemo },
  // Wildcard route
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
