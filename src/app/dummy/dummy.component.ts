import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
})
export class DummyComponent {

  customClickHandler() {
    console.log("This works");
  }
}
