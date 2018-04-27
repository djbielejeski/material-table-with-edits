import {Component, Inject } from '@angular/core';
import {IModal, ModalOverlayRef, MODAL_OPTIONS} from '@app/shared/models';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  constructor(public dialogRef: ModalOverlayRef,
              @Inject(MODAL_OPTIONS) public options: IModal) { }


  closeOnXClickHandler() {
    console.log("closeOnXClickHandler clicked");
    this.dialogRef.close();
  }
}
