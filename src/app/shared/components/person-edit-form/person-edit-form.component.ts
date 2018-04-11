import { Component, Input } from '@angular/core';
import { IPersonModel } from '@app/shared/models/person.model';

@Component({
  selector: 'app-person-edit-form',
  templateUrl: './person-edit-form.component.html'
})
export class PersonEditFormComponent {
  @Input() person: IPersonModel;
}
