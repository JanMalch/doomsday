<template>
  <main>
    <div id="input-container">
      <input v-model.lazy="inputDate" />
      <button @click="randomInputDate" aria-label="Use random input date">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Randomize</span>
      </button>
    </div>
    <div class="method-wrapper">
      <template v-if="results != null">
        <details open>
          <summary>
            <h2>Steps for {{ givenDate.toLocaleDateString() }}</h2>
          </summary>
          <div>
            <h3>Century doomsday</h3>
            <p>
              Calculate or
              <a
                href="https://en.wikipedia.org/wiki/Doomsday_rule#Finding_a_year's_anchor_day"
                class="external-link"
                rel="noopener"
                target="_blank"
                ><span>memorize</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  /></svg
              ></a>
              the weekday of the century doomsday.
            </p>
            <CenturyDoomsday :yyyy="results.fullYear"></CenturyDoomsday>
            <p>
              Century doomsday is a
              <strong
                >{{ weekDays[results.centuryDoomsday] }} ({{
                  results.centuryDoomsday
                }})</strong
              >.
            </p>

            <h3>Year doomsday</h3>
            <p>
              Calculate the doomsday's weekday of the year, based on the last 2
              digits of the target year <i>yy</i> and the century doomsday
              <i>cd</i>.
            </p>
            <YearDoomsday
              :yy="results.fullYear % 100"
              :cd="results.centuryDoomsday"
            />
            <p>
              The year's doomsday weekday is a
              <strong
                >{{ weekDays[results.yearDoomsday] }} ({{
                  results.yearDoomsday
                }})</strong
              >. Remember this weekday for the last step.
            </p>

            <h3>
              Doomsday dates
              <template v-if="results.isInputLeapYear">in a leap year</template>
            </h3>
            <p>
              Remember the doomsday dates for any given year and select the one
              that is closest to your date:
            </p>
            <ul>
              <li>03.01. (or 04.01. for leap years)</li>
              <li>last day of February</li>
              <li>&pi; day</li>
              <li>"I work 9-to-5 at 7-Eleven"</li>
              <li>twin dates for 4, 6, 8, 10, 12</li>
            </ul>
            <p>
              This means you have the following dates as doomsdays for your
              year:
            </p>

            <Formula
              :formula="
                results.doomsdays
                  .slice(0, 6)
                  .map((day) => format(day))
                  .join(', ') + ','
              "
            ></Formula>
            <Formula
              :formula="
                results.doomsdays
                  .slice(6)
                  .map((day) => format(day))
                  .join(', ')
              "
            ></Formula>

            <p>
              The closest doomsday date is the
              <strong>{{ results.closestDoomsday.toLocaleDateString() }}</strong
              >.
            </p>
            <h3>Approaching target date</h3>
            <p>
              Approach the target date from the closest doomsday date in 7-day
              steps.
            </p>
            <Formula
              :formula="
                results.stepsFromDoomsdayToInput
                  .map((step) => format(step))
                  .join(' \\rightarrow ')
              "
            ></Formula>
            <p>
              The closest date with a doomsday weekday is the
              <strong>{{ results.closestStepDate.toLocaleDateString() }}</strong
              >.
            </p>

            <h3>Difference to target date</h3>
            <p>
              Calculate the difference in days from the closest date with a
              doomsday weekend to your target date.
            </p>
            <Formula
              :formula="'closest \\rightarrow input = \\Delta \\ days'"
            ></Formula>
            <Formula
              :formula="
                results.closestStepDate.toLocaleDateString() +
                ' \\rightarrow ' +
                givenDate.toLocaleDateString() +
                ' = ' +
                (results.daysDiffToClosestDoomsday > 0 ? '+' : '') +
                results.daysDiffToClosestDoomsday +
                ' \\ ' +
                (abs(results.daysDiffToClosestDoomsday) === 1 ? 'day' : 'days')
              "
            ></Formula>

            <p>
              The difference is
              <strong
                >{{ results.daysDiffToClosestDoomsday > 0 ? "+" : ""
                }}{{ results.daysDiffToClosestDoomsday }}
                {{
                  abs(results.daysDiffToClosestDoomsday) === 1 ? "day" : "days"
                }}</strong
              >.
            </p>

            <h3>Result</h3>

            <p>
              Take the year's doomsday weekday and add the day difference. If
              the difference is negative, you can add it to 7 and add that
              resulting value, e.g.
              <Formula formula="+1" inline /> instead of
              <Formula formula="-6" inline />.
            </p>
            <Formula formula="yd + \Delta = result"></Formula>
            <Formula
              :formula="
                weekDays[results.yearDoomsday] +
                '\\ (' +
                results.yearDoomsday +
                ') ' +
                (results.daysDiffToClosestDoomsday < 0 ? '- ' : '+ ') +
                abs(results.daysDiffToClosestDoomsday) +
                ' = ' +
                weekDays[results.result] +
                '\\ (' +
                results.result +
                ') '
              "
            ></Formula>
            <template v-if="results.daysDiffToClosestDoomsday < 0">
              <Formula
                :formula="
                  weekDays[results.yearDoomsday] +
                  '\\ (' +
                  results.yearDoomsday +
                  ') + ' +
                  abs(7 + results.daysDiffToClosestDoomsday) +
                  ' = ' +
                  weekDays[results.result] +
                  '\\ (' +
                  results.result +
                  ') '
                "
              ></Formula>
            </template>
            <p>
              You have your final result!
              <strong
                >The {{ givenDate.toLocaleDateString() }} is a
                {{ weekDays[results.result] }}.</strong
              >
            </p>
          </div>
        </details>
        <div id="result-options">
          <h2>Practice</h2>
          <p>
            Close the steps above, enter a (random) date and click on a weekday
            to verify your calculations!
          </p>
          <div id="guesses">
            <button
              v-for="weekday in weekDayNumbers"
              :key="weekday"
              :class="resultOptionsState[weekday]"
              :disabled="results == null"
              @click="check(weekday)"
            >
              {{ weekDays[weekday] }}
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="error">
          Input date is either invalid or out of bounds.<br />Enter a date
          between 01/01/1600 and 12/31/9999.
        </p>
      </template>
    </div>
  </main>
</template>

<script lang="ts">
import CenturyDoomsday from "@/components/CenturyDoomsday.vue";
import Formula from "@/components/Formula.vue";
import YearDoomsday from "@/components/YearDoomsday.vue";
import {
  areResultsCorrect,
  doomsdayMethod,
  Results,
  Weekday,
} from "@/doomsday-method";
import {
  addDays,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Formula,
    CenturyDoomsday,
    YearDoomsday,
  },
})
export default class Method extends Vue {
  get inputDate(): string {
    return this._inputDate;
  }

  set inputDate(value: string) {
    this._inputDate = value;
    this.resetResultOptions();
    this.results = doomsdayMethod(this.givenDate);
  }

  results: Results | null = null;

  readonly weekDays = Weekday;
  readonly weekDayNumbers = Object.values(Weekday)
    .filter((key) => Number.isFinite(key))
    .sort() as Weekday[];
  readonly minDateStr = "1600-01-01";
  readonly maxDateStr = "9999-12-31";
  private _inputDate = new Date().toLocaleDateString();
  stepsVisible = true;

  readonly resultOptionsState: Record<
    Weekday,
    "pristine" | "false" | "correct"
  > = Object.fromEntries(
    Object.values(this.weekDayNumbers).map((num) => [num, "pristine"])
  ) as Record<Weekday, "pristine" | "false" | "correct">;

  private readonly formatString = (() => {
    const now = new Date();
    return now
      .toLocaleDateString()
      .replace(now.getFullYear().toString(10), "yyyy")
      .replace((now.getMonth() + 1).toString(10), "MM")
      .replace(now.getDate().toString(10), "dd");
  })();

  randomInputDate(): void {
    this.inputDate = addDays(
      new Date(this.minDateStr),
      Math.floor(
        Math.random() *
          differenceInCalendarDays(
            new Date("2500-12-31"),
            new Date(this.minDateStr)
          )
      )
    ).toLocaleDateString();
  }

  private resetResultOptions(): void {
    Object.keys(this.resultOptionsState).forEach((weekday: string) => {
      this.resultOptionsState[weekday as unknown as Weekday] = "pristine";
    });
  }

  get givenDate(): Date {
    const parsed = parse(this._inputDate, this.formatString, new Date());
    if (
      isBefore(parsed, new Date(this.maxDateStr)) &&
      isAfter(parsed, new Date(this.minDateStr))
    ) {
      return parsed;
    }
    return new Date(Number.NaN);
  }

  isCorrect(results: Results | null): boolean | null {
    return results == null ? null : areResultsCorrect(results);
  }

  format(date: Date): string {
    return new Intl.DateTimeFormat(navigator.language, {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  check(weekday: Weekday): void {
    const results = this.results;
    if (results == null) {
      return;
    }
    this.resultOptionsState[weekday] =
      results.result === weekday ? "correct" : "false";
  }

  created(): void {
    this.results = doomsdayMethod(this.givenDate);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.error {
  color: #d32f2f;
  font-weight: 600;
  font-family: monospace;
  text-align: center;
  padding: 12px 24px 24px;
  margin: 0;
}

.line {
  width: 100%;
  max-width: 5rem;
  height: 3px;
  margin: 1rem 0 2rem;
  background: #6771e5;
}

.method-wrapper {
  background: white;
  margin: -16px auto 0;
  display: block;
  max-width: min(75ch, 90vw);
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  text-align: left;
  padding-top: 40px;
}

h3 {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #eeeeee;
}

ul {
  font-size: 18px;
  columns: 2;
}

details {
  padding: 0 24px;

  > summary > h2 {
    display: inline-block;
    margin: 0 0 0 8px;
  }
}

#input-container {
  margin-top: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  text-transform: uppercase;
  font-weight: 500;
  border-radius: 5px;
  color: #6771e5;
  background: #fff;
  border: 1px solid #ddd;
  position: sticky;
  top: 16px;
  z-index: 1;

  > button {
    padding: 0 1rem;
    height: 100%;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    background-color: #6771e5;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: filter 0.22s;

    &:hover {
      filter: brightness(120%);
    }

    > svg {
      height: 20px;
      width: 20px;
    }
  }

  > input {
    padding: 0 1rem;
    width: 10ch;
    text-align: center;
  }
}

input {
  font-family: var(--font-family);
}

h2 {
  font-size: 1.25em;
}

h3 {
  font-size: 1.15em;

  &::after {
    content: "";
    display: block;
    width: 100%;
    max-width: 5rem;
    height: 3px;
    margin: 1rem 0 2rem;
    background: #6771e5;
  }
}

#result-options {
  margin-top: 16px;
  padding: 16px 24px 0 24px;
  border-top: 1px solid #eeeeee;

  > h2 {
    margin: 0;
  }

  > #guesses {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding: 16px 0;

    > button {
      border-radius: 5px;
      border: 1px solid #eeeeee;
      padding: 8px 24px;
      cursor: pointer;
      transition: border 0.22s, color 0.22s, background-color 0.22s;

      &:hover {
        background-color: rgba(#6771e5, 0.1);
      }

      &.correct {
        background-color: #c8e6c9;
        border-color: #43a047;
        color: #1b5e20;
      }

      &.false {
        background-color: #ffcdd2;
        border-color: #e53935;
        color: #b71c1c;
      }
    }
  }
}

@media only screen and (max-width: 599px) {
  .method-wrapper {
    width: 90%;
  }
}
</style>
