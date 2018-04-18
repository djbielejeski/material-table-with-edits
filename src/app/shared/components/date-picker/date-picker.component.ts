import * as moment from 'moment';

import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit, forwardRef,
  HostListener
} from '@angular/core';
import { NgForm, ControlContainer, NgModel, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CustomControl } from "@app/shared/components/custom-control/custom-control";
import {CalendarState, DatePickerMasks, IDayModel, IMaskModel, IMonthModel, IYearModel} from '@app/shared/models';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true }]

})
export class DatePickerComponent extends CustomControl<Date> {
  @Input() dateMask: IMaskModel = DatePickerMasks.DEFAULT;
  @Input() disabled: boolean;
  @Input() clearButton: boolean;

  // FYI months are stored 0-11 instead of 1-12
  currentMonth: number;
  currentYear: number;
  get currentDay(): number {
    if (this.selectedDate) {
      return this.selectedDate.date();
    }
    return -1;
  }

  get patternForDateFormat(): RegExp {
    if (this.dateMask) {
      return /[0-9]*/; // {" + this.dateMask.mask.length + "}"
    }

    return /[0-9]*/;
  }

  // Tells us if the calendar html is shown
  showCalendar: boolean;
  calendarState: CalendarState = CalendarState.ShowDates;
  CalendarStates = CalendarState;
  calendarDates: IDayModel[] = [];
  calendarYears: IYearModel[] = [];
  calendarMonths = [
      [<IMonthModel> { monthName: "January", month: 0 }, <IMonthModel> { monthName: "February", month: 1 }, <IMonthModel> { monthName: "March", month: 2 }],
      [<IMonthModel> { monthName: "April", month: 3 }, <IMonthModel> { monthName: "May", month: 4 }, <IMonthModel> { monthName: "June", month: 5 }],
      [<IMonthModel> { monthName: "July", month: 6 }, <IMonthModel> { monthName: "August", month: 7 }, <IMonthModel> { monthName: "September", month: 8 }],
      [<IMonthModel> { monthName: "October", month: 9 }, <IMonthModel> { monthName: "November", month: 10 }, <IMonthModel> { monthName: "December", month: 11 }],
  ];

  // My local copy
  selectedDate: moment.Moment;

  get selectedDateFormattedWithMask(): string {
    return this.selectedDate ? this.selectedDate.format(this.dateMask.display) : null;
  }

  set selectedDateFormattedWithMask(value: string) {
    // Remove the mask character from the input.
    value = value.replace(/_/g, "");
    console.log(value);
    if (value.length == this.dateMask.display.length) {
      const inputAsDate = moment(value, this.dateMask.display);

      if (inputAsDate.isValid() && inputAsDate.year() > 1900) {
        this.selectedDate = inputAsDate;
        this.propagateChange(this.selectedDate);
        this.init();
      }
    }
  }

  // Incoming from the outside world.
  writeValueCallback(value: Date) {
    if (value) {
      this.selectedDate = moment(value);

      this.init();
    }
    else {
      this.selectedDate = null;
    }
  }

  constructor() {
    super();
    this.init();
  }

  private init() {
    const currentDate: moment.Moment = this.selectedDate ? this.selectedDate : moment();

    // Setup the current month/year
    this.currentYear = currentDate.year();
    this.currentMonth = currentDate.month();

    this.getDaysToShowOnTheCalendar();
    this.getYearsToShowOnTheCalendar();
  }




  // Clicked on from the calendar html
  selectDate(date: IDayModel) {
    this.selectedDate = moment({ year: date.year, month: date.month, day: date.day });
    this.propagateChange(this.selectedDate);
    this.init();
  }

  clear() {
    this.selectedDate = null;
    this.propagateChange(this.selectedDate);
  }

  changeCalendar(forwards: boolean) {
    if (this.calendarState == CalendarState.ShowDates) {
      // Change the month
      const nextMonth = moment({year: this.currentYear, month: this.currentMonth, day: 1}).add(forwards ? 1 : -1, 'M');
      this.currentMonth = nextMonth.month();
      this.currentYear = nextMonth.year();

      this.getDaysToShowOnTheCalendar();
    }
    else if (this.calendarState == CalendarState.ShowYears) {
      // Change the years array
      this.currentYear += forwards ? 42 : -42;
      this.getYearsToShowOnTheCalendar();

    }
  }

  selectMonth(month: IMonthModel) {
    this.currentMonth = moment({ year: this.currentYear, month: month.month, day: 1}).month();
    this.getDaysToShowOnTheCalendar();
    this.changeCalendarState(false);
  }

  selectYear(year: IYearModel) {
    this.currentYear = year.year;
    this.changeCalendarState(false);
  }

  changeCalendarState(backup: boolean) {
    if (backup) {
      if (this.calendarState == CalendarState.ShowYears) {
        return;
      }
      else {
        this.calendarState++;
      }
    }
    else {
      if (this.calendarState == CalendarState.ShowDates) {
        return;
      }
      else {
        this.calendarState--;
      }
    }
  }

  get prettyDate(): string {
    if (this.selectedDate) {
      return this.selectedDate.format(this.dateMask.display);
    }

    return "";
  }

  get prettyMonth(): string {
    return moment({year: this.currentYear, month: this.currentMonth, day: 1}).format("MMMM, YYYY");
  }

  // Will always return an array of 42 years
  getYearsToShowOnTheCalendar() {
    const years: IYearModel[] = [];

    const middleYear = this.currentYear;

    // 31 previous years.
    for (let i = middleYear - 31; i < middleYear; i++) {
      years.push({ year: i });
    }

    // middle year + 10 future years;
    for (let i = middleYear; i <= middleYear + 10; i++) {
      years.push({ year: i });
    }

    this.calendarYears = years;
  }

  get getYearsToShowOnTheCalendarAsGroups() {
    const total = this.calendarYears.length / 7;

    const items = [];
    for (let i = 0; i < total; i++) {
      items.push(this.calendarYears.slice(i * 7, (i * 7) + 7));
    }

    return items;
  }


  getDaysToShowOnTheCalendar() {
    // Get the first day of the month.
    const currentDayOfMonth = moment({ year: this.currentYear, month: this.currentMonth, day: 1});
    const firstDayOfNextMonth = moment({ year: this.currentYear, month: this.currentMonth, day: 1}).add(1, 'M');
    const dates: IDayModel[] = [];

    // We have to add the previous months last week
    const totalDaysToAddFromPreviousMonth = currentDayOfMonth.weekday() == 0 ? 7 : currentDayOfMonth.weekday();
    for (let i = totalDaysToAddFromPreviousMonth; i > 0; i--) {
      const dateToAdd = moment({ year: this.currentYear, month: this.currentMonth, day: 1}).subtract(i, 'd');
      dates.push({
        weekday: dateToAdd.weekday(),
        year: dateToAdd.year(),
        month: dateToAdd.month(),
        day: dateToAdd.date()
      });
    }

    // Add the current month
    while (currentDayOfMonth.isBefore(firstDayOfNextMonth)) {
      dates.push({
        weekday: currentDayOfMonth.weekday(),
        year: currentDayOfMonth.year(),
        month: currentDayOfMonth.month(),
        day: currentDayOfMonth.date()
      });

      currentDayOfMonth.add(1, 'd');
    }

    // currentDayOfMonth is now the first day of the next month.
    // Add the days from the next month that are part of this week.
    const totalDaysToAddFromNextMonth = 7 - currentDayOfMonth.weekday();

    for (let i = 0; i < totalDaysToAddFromNextMonth; i++) {
      dates.push({
        weekday: currentDayOfMonth.weekday(),
        year: currentDayOfMonth.year(),
        month: currentDayOfMonth.month(),
        day: currentDayOfMonth.date()
      });

      currentDayOfMonth.add(1, 'd');
    }

    this.calendarDates = dates;
  }

  get calendarDatesAsWeeks() {
    const totalWeeks = this.calendarDates.length / 7;

    const weeks = [];
    for (let i = 0; i < totalWeeks; i++) {
      weeks.push(this.calendarDates.slice(i * 7, (i * 7) + 7));
    }

    return weeks;
  }
}
