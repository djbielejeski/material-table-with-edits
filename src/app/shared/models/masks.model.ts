export class DatePickerMasks {
  // MM/DD/YYYY
  public static readonly MMDDYYYY_SLASH: IMaskModel = { mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/], display: "MM/DD/YYYY" };

  // MM-DD-YYYY
  public static readonly MMDDYYYY_DASH: IMaskModel = { mask: [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/], display: "MM-DD-YYYY" };

  // YYYY/MM/DD
  public static readonly YYYYMMDD_SLASH: IMaskModel = { mask: [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/], display: "YYYY/MM/DD" };

  // YYYY-MM-DD
  public static readonly YYYYMMDD_DASH: IMaskModel = { mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/], display: "YYYY-MM-DD" };

  // MM/DD/YYYY
  public static readonly DEFAULT = DatePickerMasks.MMDDYYYY_SLASH;
}

export interface IMaskModel {
  mask: (string | RegExp)[];
  display: string;
}
