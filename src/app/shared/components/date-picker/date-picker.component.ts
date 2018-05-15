import * as moment from 'moment';
import * as _ from "lodash";
import {Component, Input, ElementRef, forwardRef, ViewEncapsulation, Injector, Output, EventEmitter} from '@angular/core';
import {NgForm, ControlContainer, NgModel, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

import { CustomControl } from "@app/shared/components/custom-control/custom-control";
import { DatePickerMode, CalendarState, DatePickerMasks, IDayModel, DayModel, IMaskModel, IMonthModel, MonthModel, IYearModel} from '@app/shared/models';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true }],
  encapsulation: ViewEncapsulation.None

})
export class DatePickerComponent extends CustomControl<Date> {
  @Input() dateMask: IMaskModel = DatePickerMasks.DEFAULT;
  @Input() disabled: boolean;

  @Input() mode: DatePickerMode = DatePickerMode.Input;
  @Input() minDate: Date = new Date(1900, 0, 1);
  @Input() maxDate: Date = null;
  @Input() disabledDates: Date[] = [];
  @Input() preferredDates: Date[] = [];
  @Input() showTodayButton: boolean;

  @Output() warnings = new EventEmitter<string[]>();

  // months are stored 0-11 instead of 1-12
  currentMonth: number;
  currentYear: number;
  private yearPageCount: number = 12;


  // Tells us if the calendar html is shown
  showCalendar: boolean;
  calendarState: CalendarState = CalendarState.ShowDates;
  CalendarStates = CalendarState;
  DatePickerModes = DatePickerMode;

  calendarDates: IDayModel[][] = [];
  calendarMonths: IMonthModel[][] = [];
  calendarYears: IYearModel[][] = [];

  // My local copy
  selectedDate: moment.Moment;

  // These two functions handle user typing and displaying the content in the input box.
  get selectedDateFormattedWithMask(): string {
    return this.selectedDate ? this.selectedDate.format(this.dateMask.display) : null;
  }

  set selectedDateFormattedWithMask(value: string) {
    let valid = false;

    // Remove the mask character from the input.
    value = value.replace(/_/g, "");
    if (value.length == this.dateMask.display.length) {
      const inputAsDate = moment(value, this.dateMask.display);


      if (inputAsDate.isValid() && inputAsDate.year() >= 1900 && !this.dateDisabled(new DayModel(inputAsDate))) {
        // Date is valid, after 1900, and not disabled.
        // Check if the date is outside of our preferred dates array
        if (this.preferredDates.length > 0 && !this.datePreferred(new DayModel(inputAsDate))) {
          // If this date is not preferred, add a warning.
          // TODO maybe
        }

        this.selectDate(new DayModel(inputAsDate));
        valid = true;
      }
    }

    // Need to set the ngcontrol to invalid if the user types in garbage.
    if (!valid) {
      const ngControl = this.injector.get(NgControl);
      ngControl.control.setErrors({ invalid: true });
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

  constructor(private injector: Injector) {
    super();
    this.init();
  }

  private init() {
    const currentDate: moment.Moment = this.selectedDate ? this.selectedDate : moment();

    // Setup the current month/year
    this.currentYear = currentDate.year();
    this.currentMonth = currentDate.month();

    this.getDaysToShowOnTheCalendar();
    this.getMonthsToShowOnTheCalendar();
    this.getYearsToShowOnTheCalendar();
  }

  // Days
  getDaysToShowOnTheCalendar() {
    // Get the first day of the month.
    const currentDayOfMonth = moment({ year: this.currentYear, month: this.currentMonth, day: 1});
    const firstDayOfNextMonth = moment({ year: this.currentYear, month: this.currentMonth, day: 1}).add(1, 'M');
    const dates: IDayModel[] = [];

    // We have to add the previous months last week
    const totalDaysToAddFromPreviousMonth = currentDayOfMonth.weekday() == 0 ? 7 : currentDayOfMonth.weekday();
    for (let i = totalDaysToAddFromPreviousMonth; i > 0; i--) {
      const dateToAdd = moment({ year: this.currentYear, month: this.currentMonth, day: 1}).subtract(i, 'd');
      dates.push(new DayModel(dateToAdd));
    }

    // Add the current month
    while (currentDayOfMonth.isBefore(firstDayOfNextMonth)) {
      dates.push(new DayModel(currentDayOfMonth));

      currentDayOfMonth.add(1, 'd');
    }

    // currentDayOfMonth is now the first day of the next month.
    // Add the days from the next month that are part of this week.
    const totalDaysToAddFromNextMonth = 7 - currentDayOfMonth.weekday();

    for (let i = 0; i < totalDaysToAddFromNextMonth; i++) {
      dates.push(new DayModel(currentDayOfMonth));

      currentDayOfMonth.add(1, 'd');
    }

    // Update each day with the different boolean properties
    _.each(dates, (date: IDayModel) => {
      date.disabled = this.dateDisabled(date);
      date.isToday = this.isToday(date);
      date.isSelectedDate = this.isSelectedDate(date);
      date.outsideSelectedMonth = date.month != this.currentMonth;
      date.preferredStart = this.datePreferredStart(date);
      date.preferredEnd = this.datePreferredEnd(date);
      date.preferredMiddle = this.datePreferredMiddle(date);
    });

    // Break it apart into weeks
    const totalWeeks = dates.length / 7;

    const weeks: IDayModel[][] = [];
    for (let i = 0; i < totalWeeks; i++) {
      weeks.push(dates.slice(i * 7, (i * 7) + 7));
    }

    this.calendarDates = weeks;
  }

  private dateDisabled(date: IDayModel): boolean {
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

  private isToday(date: IDayModel): boolean {
    const today = new DayModel(moment());
    return date.year == today.year && date.month == today.month && date.day == today.day;
  }


  private isSelectedDate(date: IDayModel): boolean {
    const comparedDate = new DayModel(this.selectedDate);
    return date.year == comparedDate.year && date.month == comparedDate.month && date.day == comparedDate.day;
  }

  private datePreferred(date: IDayModel): boolean {
    const dateAsMoment = moment({ year: date.year, month: date.month, day: date.day });

    return _.find(this.preferredDates, (preferredDate: Date) => {
      return preferredDate.getFullYear() == dateAsMoment.year() &&
        preferredDate.getMonth() == dateAsMoment.month() &&
        preferredDate.getDate() == dateAsMoment.date();
    }) != null;
  }

  private datePreferredStart(date: IDayModel): boolean {
    if (this.datePreferred(date)) {
      const dateBefore = moment({ year: date.year, month: date.month, day: date.day }).subtract(1, 'd');
      return !this.datePreferred(new DayModel(dateBefore));
    }
    return false;
  }

  private datePreferredEnd(date: IDayModel): boolean {
    if (this.datePreferred(date)) {
      const dateAfter = moment({ year: date.year, month: date.month, day: date.day }).add(1, 'd');
      return !this.datePreferred(new DayModel(dateAfter));
    }
    return false;
  }
  private datePreferredMiddle(date: IDayModel): boolean {
    if (this.datePreferred(date)) {
      const dateAfter = moment({ year: date.year, month: date.month, day: date.day }).add(1, 'd');
      const dateBefore = moment({ year: date.year, month: date.month, day: date.day }).subtract(1, 'd');
      return this.datePreferred(new DayModel(dateAfter)) && this.datePreferred(new DayModel(dateBefore));
    }
    return false;
  }

  // End Days

  // Months
  private getMonthsToShowOnTheCalendar() {
    const months: IMonthModel[] = [
        new MonthModel("January", 0),
        new MonthModel("February", 1),
        new MonthModel("March", 2),
        new MonthModel("April", 3),
        new MonthModel("May", 4),
        new MonthModel("June", 5),
        new MonthModel("July", 6),
        new MonthModel("August", 7),
        new MonthModel("September", 8),
        new MonthModel("October", 9),
        new MonthModel("November", 10),
        new MonthModel("December", 11),
    ];

    _.each(months, (month: IMonthModel) => {
      month.isToday = this.isThisMonth(month);
      month.isSelectedDate = this.isSelectedDateMonth(month);
    });

    const monthsAsArray: IMonthModel[][] = [];
    for (let i = 0; i < 4; i++) {
      monthsAsArray.push(months.slice(i * 3, (i * 3) + 3));
    }

    this.calendarMonths = monthsAsArray;
  }


  private isThisMonth(month: IMonthModel): boolean {
    const today = new DayModel(moment());
    return this.currentYear == today.year && month.month == today.month;
  }


  private isSelectedDateMonth(month: IMonthModel): boolean {
    const comparedDate = new DayModel(this.selectedDate);
    return this.currentYear == comparedDate.year && month.month == comparedDate.month;
  }

  // end month

  // Years
  private getYearsToShowOnTheCalendar() {
    const years: IYearModel[] = [];
    const pageIndexForYear = this.getPageIndexForYear(this.currentYear);
    const startingYearForThisPage = this.getStartingYearForPage(pageIndexForYear);

    const comparedDate = new DayModel(this.selectedDate);
    const today = new DayModel(moment())

    for (var i = startingYearForThisPage; i < startingYearForThisPage + this.yearPageCount; i++) {
      if (i <= this.maxAvailableYear) {
        years.push({ year: i, isToday: i == today.year, isSelectedDate: i == comparedDate.year });
      }
    }

    const total = years.length / 3;
    const yearsAsArray: IYearModel[][] = [];
    for (let j = 0; j < total; j++) {
      yearsAsArray.push(years.slice(j * 3, (j * 3) + 3));
    }

    this.calendarYears = yearsAsArray;
  }

  // Click Handlers

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

  selectMonth(month: IMonthModel) {
    this.currentMonth = moment({ year: this.currentYear, month: month.month, day: 1}).month();
    this.getDaysToShowOnTheCalendar();
    this.changeCalendarState(false);
  }

  selectYear(year: IYearModel) {
    this.currentYear = year.year;
    this.changeCalendarState(false);
  }

  clear() {
    this.selectedDate = null;
    this.propagateChange(this.selectedDate);

    this.showCalendar = false;
  }

  selectToday() {
    this.selectDate(new DayModel(moment()));
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


  // View Helpers
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



  // Date Helpers
  private get minAvailableYear(): number {
    return this.minDate.getFullYear();
  }

  private get maxAvailableYear(): number {
    return this.maxDate == null ? 9999 : this.maxDate.getFullYear();
  }

  private get yearTotalPages(): number {
    return Math.ceil((this.maxAvailableYear - this.minAvailableYear) / this.yearPageCount);
  }

  private getStartingYearForPage(pageIndex: number): number {
    return this.minAvailableYear + this.yearPageCount * pageIndex;
  }

  private getPageIndexForYear(year: number): number {
    return Math.floor((year - this.minAvailableYear) / this.yearPageCount);
  }
}
