import {
  addWeeks,
  closestTo,
  differenceInCalendarDays,
  getDay,
  getYear,
  isAfter,
  isLeapYear,
  isSameWeek,
  isValid,
} from "date-fns";

export enum Weekday {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export function isWeekday(value: unknown): value is Weekday {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 6
  );
}

export interface Results {
  readonly inputDate: Date;
  readonly fullYear: number;
  readonly isInputLeapYear: boolean;
  readonly centuryDoomsday: Weekday;
  readonly yearDoomsday: Weekday;
  readonly doomsdays: Date[];
  readonly closestDoomsday: Date;
  readonly stepsFromDoomsdayToInput: Date[];
  readonly closestStepDate: Date;
  readonly daysDiffToClosestDoomsday: number;
  readonly result: Weekday;
}

export function assertWeekday(calculation: () => number): Weekday {
  const result = calculation();
  if (!isWeekday(result)) {
    throw new Error(`${result} is not a valid weekday.`);
  }
  return result;
}

export function assertDate(calculation: () => Date): Date {
  const result = calculation();
  if (!isValid(result)) {
    throw new Error(`${result} is not a valid date.`);
  }
  return result;
}

export const getCenturyDoomsday = (inputDate: Date): Weekday =>
  assertWeekday(
    () =>
      (7 + Weekday.Tuesday - (Math.floor(getYear(inputDate) / 100) % 4) * 2) % 7
  );

export const getYearDoomsday = (
  inputDate: Date,
  centuryDoomsday: Weekday = getCenturyDoomsday(inputDate)
): Weekday =>
  assertWeekday(() => {
    const yy = getYear(inputDate) % 100;
    const yyModTwelve = yy % 12;
    return (
      (Math.floor(yy / 12) +
        yyModTwelve +
        Math.floor(yyModTwelve / 4) +
        centuryDoomsday) %
      7
    );
  });

export function getDoomsdays(
  inputDate: Date,
  isInputLeapYear: boolean = isLeapYear(inputDate)
): Date[] {
  const fullYear = getYear(inputDate);
  const doomsdays = [
    new Date(fullYear, 0, isInputLeapYear ? 4 : 3),
    new Date(fullYear, 1, isInputLeapYear ? 29 : 28),
    new Date(fullYear, 2, 14),
    new Date(fullYear, 3, 4),
    new Date(fullYear, 4, 9),
    new Date(fullYear, 5, 6),
    new Date(fullYear, 6, 11),
    new Date(fullYear, 7, 8),
    new Date(fullYear, 8, 5),
    new Date(fullYear, 9, 10),
    new Date(fullYear, 10, 7),
    new Date(fullYear, 11, 12),
  ];
  for (const doomsday of doomsdays) {
    assertDate(() => doomsday);
  }
  return doomsdays;
}

export function getClosestDoomsday(
  inputDate: Date,
  doomsdays: Date[] = getDoomsdays(inputDate)
): Date {
  const closest = closestTo(inputDate, doomsdays);
  if (closest == null) {
    throw new Error(
      `Failed to determine closest date to ${inputDate.toLocaleDateString()} of ${
        doomsdays.length
      } candidates.`
    );
  }
  return closest;
}

export function getStepsFromDoomsdayToInput(
  inputDate: Date,
  closestDoomsday: Date = getClosestDoomsday(inputDate)
): Date[] {
  let current = closestDoomsday;
  const direction = isAfter(inputDate, current) ? 1 : -1;
  const result: Date[] = [];
  // TODO: smarter loop
  while (!isSameWeek(current, inputDate)) {
    result.push(current);
    current = addWeeks(current, direction);
  }
  if (
    differenceInCalendarDays(current, inputDate) === 0 ||
    result.length === 0
  ) {
    result.push(current);
  }
  return result;
}

export function getClosestStep(
  inputDate: Date,
  steps: Date[] = getStepsFromDoomsdayToInput(inputDate)
): Date {
  if (steps.length === 0) {
    throw new Error(`Cannot determine closest step if none are provided.`);
  }
  const result = closestTo(inputDate, steps);
  if (result == null) {
    throw new Error(
      `Unknown error while determining closest date to ${inputDate.toLocaleDateString()} of ${
        steps.length
      } candidates.`
    );
  }
  return result;
}

export function getDaysDiffToClosestStep(
  inputDate: Date,
  closestDoomsday: Date = getClosestDoomsday(inputDate)
): number {
  return differenceInCalendarDays(inputDate, closestDoomsday) % 7;
}

export const getResultFromDiffToClosestStepDay = (
  doomsdayWeekday: Weekday,
  diff: number
): Weekday => assertWeekday(() => (7 + doomsdayWeekday + diff) % 7);

export function doomsdayMethod(inputDate: Date): Results | null {
  if (!isValid(inputDate)) {
    return null;
  }
  const fullYear = getYear(inputDate);
  const isInputLeapYear = isLeapYear(inputDate);
  const centuryDoomsday = getCenturyDoomsday(inputDate);
  const yearDoomsday = getYearDoomsday(inputDate, centuryDoomsday);
  const doomsdays = getDoomsdays(inputDate, isInputLeapYear);
  const closestDoomsday = getClosestDoomsday(inputDate, doomsdays);
  const stepsFromDoomsdayToInput = getStepsFromDoomsdayToInput(
    inputDate,
    closestDoomsday
  );
  const closestStepDate = getClosestStep(inputDate, stepsFromDoomsdayToInput);
  const daysDiffToClosestDoomsday = getDaysDiffToClosestStep(
    inputDate,
    closestStepDate
  );
  const result = getResultFromDiffToClosestStepDay(
    yearDoomsday,
    daysDiffToClosestDoomsday
  );
  const results: Results = {
    inputDate,
    fullYear,
    isInputLeapYear,
    centuryDoomsday,
    yearDoomsday,
    doomsdays,
    closestDoomsday,
    stepsFromDoomsdayToInput,
    closestStepDate,
    daysDiffToClosestDoomsday,
    result,
  };
  if (!areResultsCorrect(results)) {
    return null;
  }
  return results;
}

export function areResultsCorrect(results: Results): boolean {
  return getDay(results.inputDate) === results.result;
}
