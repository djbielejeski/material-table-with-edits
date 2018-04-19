import * as moment from "moment";
import {DayOfTheWeek} from '@app/shared/models/day-of-the-week.enum';

export interface IYearModel {
  year: number;
}

export interface IMonthModel {
  monthName: string;
  month: number;
}
export interface IDayModel {
  weekday: DayOfTheWeek;
  day: number;
  month: number;
  year: number;
}

export class DayModel implements IDayModel {
  weekday: DayOfTheWeek = DayOfTheWeek.Sunday;
  day: number = 0;
  month: number = 0;
  year: number = 0;

  constructor(date: moment.Moment) {
    this.weekday = date.weekday();
    this.day = date.date();
    this.month = date.month();
    this.year = date.year();
  }
}
