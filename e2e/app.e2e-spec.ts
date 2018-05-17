import { AppPage } from './app.po';
import {browser, by, element} from 'protractor';

describe('material-table-with-edits App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('date picker - button - backdrop does not exist until click', () => {
    expect(!page.getDatePickerClickout().isPresent());
  });

  it('date picker - button - calendar does not exist until click', () => {
    expect(!page.getDatePickerCalendar().isPresent());
  });

  it('date picker - button - click should open backdrop', () => {
    browser.actions().click(page.getDatePickerButton());
    expect(page.getDatePickerClickout().isPresent());
  });

  it('date picker - button - click should open calendar', () => {
    browser.actions().click(page.getDatePickerButton());
    expect(page.getDatePickerCalendar().isPresent());
  });

  it('date picker - input - valid date', () => {
    expect(element(by.css('app-date-picker.ng-untouched.ng-pristine.ng-valid')).isPresent());
    page.getDatePickerInput().sendKeys("12/08/2018");
    expect(!element(by.css('app-date-picker.ng-untouched.ng-pristine.ng-valid')).isPresent());
    expect(element(by.css('app-date-picker.ng-touched.ng-dirty.ng-valid')).isPresent());
  });

  it('date picker - input - invalid date', () => {
    expect(element(by.css('app-date-picker.ng-untouched.ng-pristine.ng-valid')).isPresent());
    page.getDatePickerInput().sendKeys("12/08/2018");
    expect(!element(by.css('app-date-picker.ng-untouched.ng-pristine.ng-valid')).isPresent());
    expect(element(by.css('app-date-picker.ng-touched.ng-dirty.ng-invalid')).isPresent());
  });
});
