import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


// Angular Material
import {
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatSnackBarModule
} from '@angular/material';

import { AppRootComponent } from '@app/app-root/app-root.component';
import { HomeComponent } from '@app/home/home.component';

import * as sharedComponents from '@app/shared/components';

import { appRoutes } from '@app/core/routes';

@NgModule({
  declarations: [
    AppRootComponent,
    HomeComponent,
    sharedComponents.PersonEditFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    // Angular Material
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
