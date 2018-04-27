import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';

// Angular Material
import {
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';

// CDK Imports
import { OverlayModule } from '@angular/cdk/overlay';

import { AppRootComponent } from '@app/app-root/app-root.component';
import { HomeComponent } from '@app/home/home.component';

import * as sharedComponents from '@app/shared/components';
import * as services from '@app/shared/services';
import { appRoutes } from '@app/core/routes';
import { CdkDetailRowDirective } from '@app/shared/directives/detail-row.directive';

@NgModule({
  declarations: [
    AppRootComponent,
    HomeComponent,
    sharedComponents.PersonEditFormComponent,
    sharedComponents.DatePickerComponent,
    sharedComponents.ModalComponent,

    CdkDetailRowDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    // Angular CDK
    OverlayModule,

    // Text Mask
    TextMaskModule,

    // Angular Material
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    services.PersonService,
    services.ModalService
  ],
  bootstrap: [AppRootComponent],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    sharedComponents.ModalComponent
  ]
})
export class AppModule { }
