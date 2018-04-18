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
