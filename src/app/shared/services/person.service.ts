import { Injectable } from '@angular/core';
import { IPersonModel } from '@app/shared/models';

@Injectable()
export class PersonService {

  private firstNames: string[] = ['David', 'John', 'Charley', 'Michael', 'Rosalie', 'Daniel', 'Natalie', 'Thomas', 'Therese', 'Maria', 'Sarah'];
  private lastNames: string[] = ['Bezemek', 'Politis', 'Franzmeier', 'Stodola', 'Kay', 'VanLinn', 'Carini', 'Mallet', 'Bowholtz', 'Meyers', 'Whittet'];

  getPeople(): IPersonModel[] {
    const totalPeople = this.getRandomNumber(15, 25);
    const people: IPersonModel[] = [];
    for (let i = 0; i < totalPeople; i++) {
      const firstName = this.firstNames[this.getRandomNumber(0, this.firstNames.length - 1)];
      const lastName = this.lastNames[this.getRandomNumber(0, this.lastNames.length - 1)];
      const person: IPersonModel = {
        FirstName: firstName,
        LastName: lastName,
        DateOfBirth: this.getRandomDay(),
        Address1: this.getRandomNumber(1000, 4000) + ' Center St.',
        Address2: '',
        City: 'Minneapolis',
        State: 'MN',
        ZipCode: '' + this.getRandomNumber(55100, 55200),
        PhoneNumber: '651-' + this.getRandomNumber(300, 900) + '-' + this.getRandomNumber(1000, 9000),
        EmailAddress: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@gmail.com'
      };

      people.push(person);
    }
    return people;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  private getRandomDay(): Date {
    const day = new Date();
    day.setFullYear(this.getRandomNumber(1950, 1995), this.getRandomNumber(1, 11), this.getRandomNumber(1, 28));
    return day;
  }
}
