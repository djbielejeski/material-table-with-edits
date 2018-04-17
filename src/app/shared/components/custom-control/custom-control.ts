import { ControlValueAccessor } from '@angular/forms';

export abstract class CustomControl<InputType> implements ControlValueAccessor {

  abstract writeValueCallback(value: InputType);

  writeValue(value: InputType) {
    this.writeValueCallback(value);
  }

  propagateChange = (_: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  propagateTouched = () => { };
  registerOnTouched(fn: () => void) {
    this.propagateTouched = fn;
  }
}
