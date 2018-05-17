import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getDatePickerInput() {
    return element(by.css('app-date-picker .date-picker-container .date-picker-input input'));
  }

  getDatePickerButton() {
    return element(by.css('app-date-picker .date-picker-container .date-picker-input button'));
  }

  getDatePickerClickout() {
    return element(by.css('app-date-picker .date-picker-container .date-picker-clickout'));
  }

  getDatePickerCalendar() {
    return element(by.css('app-date-picker .date-picker-container .date-picker-calendar'));
  }
}
