import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modal-body]',
})
export class ModalBodyDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
