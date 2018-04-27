import {EventEmitter} from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';

export class ModalOverlayRef {
  onClose = new EventEmitter();

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.onClose.emit();
    this.overlayRef.dispose();
  }
}
