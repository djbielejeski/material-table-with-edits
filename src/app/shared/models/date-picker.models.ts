import * as moment from "moment";
import {DayOfTheWeek} from '@app/shared/models/day-of-the-week.enum';

export interface IYearModel {
  year: number;

  isToday: boolean;
  isSelectedDate: boolean;
}

export interface IMonthModel {
  monthName: string;
  month: number;
  isToday: boolean;
  isSelectedDate: boolean;
}

export class MonthModel implements IMonthModel {
  monthName: string = '';
  month: number = 0;
  isToday: boolean;
  isSelectedDate: boolean;

  constructor(_monthName: string, _month: number) {
    this.monthName = _monthName;
    this.month = _month;
  }
}

export interface IDayModel {
  weekday: DayOfTheWeek;
  day: number;
  month: number;
  year: number;

  disabled: boolean;
  isToday: boolean;
  isSelectedDate: boolean;
  outsideSelectedMonth: boolean;
  preferredStart: boolean;
  preferredEnd: boolean;
  preferredMiddle: boolean;
}

export class DayModel implements IDayModel {
  weekday: DayOfTheWeek = DayOfTheWeek.Sunday;
  day: number = 0;
  month: number = 0;
  year: number = 0;

  disabled: boolean = false;
  isToday: boolean = false;
  isSelectedDate: boolean = false;
  outsideSelectedMonth: boolean = false;
  preferredStart: boolean = false;
  preferredEnd: boolean = false;
  preferredMiddle: boolean = false;

  constructor(date: moment.Moment) {
    if (date) {
      this.weekday = date.weekday();
      this.day = date.date();
      this.month = date.month();
      this.year = date.year();
    }
  }
}
