import * as _ from 'lodash';
import {Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Directive({
  selector: '[cdkDetailRow]'
})
export class CdkDetailRowDirective implements AfterViewInit, OnDestroy {
  private row: any;
  private cachedRow: any;
  private tRef: TemplateRef<any>;
  private opened: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input('cdkSortEvent') cdkSortEvent: EventEmitter<boolean>;

  @HostBinding('class.expanded')
  get expended(): boolean {
    return this.opened;
  }

  @Input()
  set cdkDetailRow(value: any) {
    if (value !== this.row) {
      this.row = _.clone(value);
      this.cachedRow = value;
    }
  }

  @Input('cdkDetailRowTpl')
  set template(value: TemplateRef<any>) {
    if (value !== this.tRef) {
      this.tRef = value;
    }
  }

  constructor(public vcRef: ViewContainerRef) {

  }

  ngAfterViewInit() {
    if (this.cdkSortEvent) {
      this.cdkSortEvent.takeUntil(this.ngUnsubscribe).subscribe(() => {
        if (this.opened) {
          this.toggle();
        }
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('click')
  onClick(): void {
    this.toggle();
  }

  @HostListener('keydown', ['$event'])
  onKeyPress(event): void {
    const keyCode = event.keyCode;
    // Allow:  Escape, Enter
    if ([27, 13].indexOf(keyCode) !== -1) {
      this.toggle();
    }
  }

  toggle(): void {
    if (this.opened) {
      this.vcRef.clear();
      this.row = _.clone(this.cachedRow);
    }
    else {
      this.render();
    }

    this.opened = this.vcRef.length > 0;
  }

  private render(): void {
    this.vcRef.clear();
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
    }
  }
}
