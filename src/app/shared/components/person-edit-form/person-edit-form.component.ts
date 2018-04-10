import { Component, Input } from '@angular/core';
import { IPersonModel } from '@app/shared/models/person.model';

@Component({
  selector: 'app-person-edit-form',
  templateUrl: './person-edit-form.component.html'
})
export class PersonEditFormComponent {
  @Input() person: IPersonModel;

  constructor() {
    if (this.person == null) {
      this.person = {
        FirstName: '',
        LastName: '',
        DateOfBirth: null,
        Address1: '',
        Address2: '',
        City: '',
        State: '',
        ZipCode: '',
        PhoneNumber: '',
        EmailAddress: '',
      };
    }
  }

}
