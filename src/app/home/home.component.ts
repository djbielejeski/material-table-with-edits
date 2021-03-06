import { Component, OnInit, EventEmitter } from '@angular/core';
import { IPersonModel, DatePickerMode, ModalOverlayRef } from '@app/shared/models';
import { PersonService, ModalService} from '@app/shared/services';
import {Sort} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DummyComponent} from '@app/dummy/dummy.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {

  myDate = null; //new Date(2018, 3, 4);
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  disabledDates = [new Date(2018, 3, 17)];
  preferredDates = [new Date(2018, 3, 16), new Date(2018, 3, 18), new Date(2018, 3, 19), new Date(2018, 3, 20), new Date(2018, 3, 21), new Date(2018, 3, 22)]
  datePickerMode = DatePickerMode.Input;

  setMyDate(event){
    this.myDate = event;
  }

  people: IPersonModel[] = [];
  sortedItems;
  sortEvent = new EventEmitter<boolean>();
  selectedItem: IPersonModel;
  showEditForm: boolean;

  private modalReference: ModalOverlayRef;

  displayedColumns = ['fullName', 'address', 'phoneNumber', 'emailAddress'];
  constructor(private personService: PersonService, private modalService: ModalService) { }

  ngOnInit() {
    this.people = this.personService.getPeople();
    this.sortedItems = this.people.slice();
  }

  addItem() {
    this.showEditForm = true;
    this.selectedItem = {
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

  sortData(sort: Sort) {
    this.sortEvent.emit(true);
    const data = this.people.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedItems = data;
      return;
    }

    this.sortedItems = data.sort((a: IPersonModel, b: IPersonModel) => {
      const isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'Name': return this.compare(a.FirstName, b.FirstName, isAsc);
        case 'Address': return this.compare(a.Address1, b.Address1, isAsc);
        case 'PhoneNumber': return this.compare(a.PhoneNumber, b.PhoneNumber, isAsc);
        case 'EmailAddress': return this.compare(a.EmailAddress, b.EmailAddress, isAsc);
        default: return 0;
      }
    });
  }


  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showDefaultModal() {
    // This one uses the default body tag
    this.modalReference = this.modalService.open({
      title: "Hello Home Page!",
      body: "<p>Body content</p><br/><p>2nd Paragraph</p>",
      hasCloseButton: true,
      closeOnOutsideClick: true,
      buttons: [{
        text: "Close",
        cssClasses: 'btn btn-primary',
        click: this.closeModal
      }]
    });
  }

  showCustomModal() {
    // This one uses a component reference
    this.modalReference = this.modalService.open({
      title: "Hello Home Page!",
      component: DummyComponent,
      hasCloseButton: true,
      closeOnOutsideClick: true,
      buttons: [{
         text: "Close",
         cssClasses: 'btn btn-primary',
         click: this.closeModal
        }]
    });
  }


  private closeModal = () => {
    this.modalReference.close();
  }
}
