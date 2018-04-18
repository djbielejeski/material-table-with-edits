import * as moment from 'moment';
import * as _ from "lodash";
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

  @Input() minDate: Date = new Date(1900, 0, 1);
  @Input() maxDate: Date = null;
  @Input() disabledDates: Date[] = [];

  // FYI months are stored 0-11 instead of 1-12
  currentMonth: number;
  currentYear: number;
  private yearPageCount: number = 42;

  get currentDay(): number {
    if (this.selectedDate) {
      return this.selectedDate.date();
    }
    return -1;
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

  // These two functions handle user typing and displaying the content in the input box.
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
        this.selectDate( {
          weekday: inputAsDate.weekday(),
          day: inputAsDate.date(),
          month: inputAsDate.month(),
          year: inputAsDate.year()
        });
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

  constructor(private eRef: ElementRef) {
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
    if (this.dateDisabled(date)) {
      return;
    }

    this.selectedDate = moment({ year: date.year, month: date.month, day: date.day });
    this.propagateChange(this.selectedDate);
    this.init();

    this.showCalendar = false;
  }

  clear() {
    this.selectedDate = null;
    this.propagateChange(this.selectedDate);

    this.showCalendar = false;
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
    if (this.calendarState == CalendarState.ShowYears) {
      return '' + this.currentYear;
    }
    else {
      return moment({year: this.currentYear, month: this.currentMonth, day: 1}).format("MMMM, YYYY");
    }
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
      const currentPageIndex = this.getPageIndexForYear(this.currentYear);
      if (forwards) {
        if (currentPageIndex != (this.yearTotalPages - 1)) {
          this.currentYear = this.getStartingYearForPage(currentPageIndex + 1);
        }
      }
      else {
        if (currentPageIndex > 0) {
          this.currentYear = this.getStartingYearForPage(currentPageIndex - 1);
        }
      }

      this.getYearsToShowOnTheCalendar();
    }
  }

  get minAvailableYear(): number {
    return this.minDate.getFullYear();
  }

  get maxAvailableYear(): number {
    return this.maxDate == null ? 9999 : this.maxDate.getFullYear();
  }

  get yearTotalPages(): number {
    return Math.ceil((this.maxAvailableYear - this.minAvailableYear) / this.yearPageCount);
  }

  private getStartingYearForPage(pageIndex: number): number {
    return this.minAvailableYear + this.yearPageCount * pageIndex;
  }

  private getPageIndexForYear(year: number): number {
    return Math.floor((year - this.minAvailableYear) / this.yearPageCount);
  }

  getYearsToShowOnTheCalendar() {
    const years: IYearModel[] = [];
      const pageIndexForYear = this.getPageIndexForYear(this.currentYear);
      const startingYearForThisPage = this.getStartingYearForPage(pageIndexForYear);
      for (var i = startingYearForThisPage; i < startingYearForThisPage + this.yearPageCount; i++) {
        if (i <= this.maxAvailableYear) {
          years.push({ year: i });
        }
      }

      this.calendarYears = years;
  }

  dateDisabled(date: IDayModel): boolean {
    const dateAsMoment = moment({ year: date.year, month: date.month, day: date.day });
    if ((this.minDate && dateAsMoment.isBefore(moment(this.minDate))) ||
        (this.maxDate && dateAsMoment.isAfter(moment(this.maxDate))) ||
        (_.find(this.disabledDates, (disabledDate: Date) => {
          return disabledDate.getFullYear() == dateAsMoment.year() &&
            disabledDate.getMonth() == dateAsMoment.month() &&
            disabledDate.getDate() == dateAsMoment.date();
        }) != null)) {
      return true;
    }

    return false;
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
