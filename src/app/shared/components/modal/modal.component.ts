import {Component, ComponentFactoryResolver, Inject, OnInit, ViewChild} from '@angular/core';
import {IModal, ModalOverlayRef, MODAL_OPTIONS} from '@app/shared/models';
import {ModalBodyDirective} from '@app/shared/directives/modal-body.directive';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild(ModalBodyDirective) modalBody: ModalBodyDirective;

  constructor(public dialogRef: ModalOverlayRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(MODAL_OPTIONS) public options: IModal) {
  }

  ngOnInit() {
    if (this.options.component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.options.component);

      const viewContainerRef = this.modalBody.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
    }
  }


  closeOnXClickHandler() {
    console.log("closeOnXClickHandler clicked");
    this.dialogRef.close();
  }
}
