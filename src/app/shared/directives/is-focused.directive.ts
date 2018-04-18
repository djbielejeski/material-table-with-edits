import {Directive, HostListener, Input, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appIsFocused]'
})
export class IsFocusedDirective {
  @Input() isFocused: boolean;
  @Output() isFocusedChange = new EventEmitter<boolean>();

  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
    this.isFocusedChange.emit(true);
  }

  @HostListener('blur')
  onBlur() {
    this.isFocused = false;
    this.isFocusedChange.emit(false);
  }
}
