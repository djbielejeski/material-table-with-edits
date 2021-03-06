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
import {PortalModule} from '@angular/cdk/portal';

import { AppRootComponent } from '@app/app-root/app-root.component';
import { HomeComponent } from '@app/home/home.component';
import { DummyComponent } from '@app/dummy/dummy.component';

import { ModalBodyDirective } from '@app/shared/directives/modal-body.directive';

import * as sharedComponents from '@app/shared/components';
import * as services from '@app/shared/services';
import { appRoutes } from '@app/core/routes';
import { CdkDetailRowDirective } from '@app/shared/directives/detail-row.directive';
import {OverlayDemo, RotiniPanel , KeyboardTrackingPanel, SpaghettiPanel} from '@app/overlay-demo/overlay-demo.component';


@NgModule({
  declarations: [
    AppRootComponent,
    HomeComponent,
    DummyComponent,
    OverlayDemo,
    RotiniPanel,
    KeyboardTrackingPanel,
    SpaghettiPanel,
    sharedComponents.PersonEditFormComponent,
    sharedComponents.DatePickerComponent,
    sharedComponents.ModalComponent,

    CdkDetailRowDirective,
    ModalBodyDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    // Angular CDK
    OverlayModule,
    PortalModule,

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
    sharedComponents.ModalComponent,
    DummyComponent,
    RotiniPanel,
    KeyboardTrackingPanel,
    SpaghettiPanel,
  ]
})
export class AppModule { }
