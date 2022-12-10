import { ContinuousScale } from './continuousScale';
import timeMillisecond from '../util/time/millisecond';
import timeSecond from '../util/time/second';
import timeMinute from '../util/time/minute';
import timeHour from '../util/time/hour';
import timeDay from '../util/time/day';
import timeWeek from '../util/time/week';
import timeMonth from '../util/time/month';
import timeYear from '../util/time/year';
import {
    durationSecond,
    durationMinute,
    durationHour,
    durationDay,
    durationWeek,
    durationMonth,
    durationYear,
} from '../util/time/duration';
import { CountableTimeInterval, TimeInterval } from '../util/time/interval';
import { complexBisectRight } from '../util/bisect';
import { tickStep } from '../util/ticks';
import { buildFormatter } from '../util/timeFormat';

enum DefaultTimeFormats {
    MILLISECOND,
    SECOND,
    MINUTE,
    HOUR,
    SHORT_MONTH,
    MONTH,
    YEAR,
}

const formatStrings: Record<DefaultTimeFormats, string> = {
    [DefaultTimeFormats.MILLISECOND]: '.%L',
    [DefaultTimeFormats.SECOND]: ':%S',
    [DefaultTimeFormats.MINUTE]: '%I:%M',
    [DefaultTimeFormats.HOUR]: '%I %p',
    [DefaultTimeFormats.SHORT_MONTH]: '%b %d',
    [DefaultTimeFormats.MONTH]: '%B',
    [DefaultTimeFormats.YEAR]: '%Y',
};

export class TimeScale extends ContinuousScale {
    readonly type = 'time';

    private year: CountableTimeInterval = timeYear;
    private month: CountableTimeInterval = timeMonth;
    private week: CountableTimeInterval = timeWeek;
    private day: CountableTimeInterval = timeDay;
    private hour: CountableTimeInterval = timeHour;
    private minute: CountableTimeInterval = timeMinute;
    private second: CountableTimeInterval = timeSecond;
    private millisecond: CountableTimeInterval = timeMillisecond;

    /**
     * Array of default tick intervals in the following format:
     *
     *     [
     *         interval (unit of time),
     *         number of units (step),
     *         the length of that number of units in milliseconds
     *     ]
     */
    private tickIntervals: [CountableTimeInterval, number, number][] = [
        [this.second, 1, durationSecond],
        [this.second, 5, 5 * durationSecond],
        [this.second, 15, 15 * durationSecond],
        [this.second, 30, 30 * durationSecond],
        [this.minute, 1, durationMinute],
        [this.minute, 5, 5 * durationMinute],
        [this.minute, 15, 15 * durationMinute],
        [this.minute, 30, 30 * durationMinute],
        [this.hour, 1, durationHour],
        [this.hour, 3, 3 * durationHour],
        [this.hour, 6, 6 * durationHour],
        [this.hour, 12, 12 * durationHour],
        [this.day, 1, durationDay],
        [this.day, 2, 2 * durationDay],
        [this.week, 1, durationWeek],
        [this.month, 1, durationMonth],
        [this.month, 3, 3 * durationMonth],
        [this.year, 1, durationYear],
    ];

    calculateDefaultTickFormat(ticks?: any[]) {
        let defaultTimeFormat = DefaultTimeFormats.YEAR as DefaultTimeFormats;

        const updateFormat = (format: DefaultTimeFormats) => {
            if (format < defaultTimeFormat) {
                defaultTimeFormat = format;
            }
        };

        for (let value of ticks ?? []) {
            this.second.floor(value) < value
                ? updateFormat(DefaultTimeFormats.MILLISECOND)
                : this.minute.floor(value) < value
                ? updateFormat(DefaultTimeFormats.SECOND)
                : this.hour.floor(value) < value
                ? updateFormat(DefaultTimeFormats.MINUTE)
                : this.day.floor(value) < value
                ? updateFormat(DefaultTimeFormats.HOUR)
                : this.month.floor(value) < value
                ? updateFormat(DefaultTimeFormats.SHORT_MONTH)
                : this.year.floor(value) < value
                ? updateFormat(DefaultTimeFormats.MONTH)
                : updateFormat(DefaultTimeFormats.YEAR);
        }

        const domain = this._domain;
        const start = Math.min(...domain.map((d) => d.getTime()));
        const stop = Math.max(...domain.map((d) => d.getTime()));
        const extent = stop - start;

        let formatStringArray: string[] = [formatStrings[defaultTimeFormat]];
        let timeEndIndex = 0;

        switch (defaultTimeFormat) {
            case DefaultTimeFormats.SECOND:
                if (extent / durationMinute > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.MINUTE]);
                }
            // fall through deliberately
            case DefaultTimeFormats.MINUTE:
                if (extent / durationHour > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.HOUR]);
                }
            // fall through deliberately
            case DefaultTimeFormats.HOUR:
                timeEndIndex = formatStringArray.length;
                if (extent / durationDay > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.SHORT_MONTH]);
                }
            // fall through deliberately
            case DefaultTimeFormats.SHORT_MONTH:
            // fall through deliberately
            case DefaultTimeFormats.MONTH:
                if (extent / durationYear > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.YEAR]);
                }
            // fall through deliberately
            default:
                break;
        }

        if (timeEndIndex < formatStringArray.length) {
            // Insert a gap between all date components.
            formatStringArray = [
                ...formatStringArray.slice(0, timeEndIndex),
                formatStringArray.slice(timeEndIndex).join(' '),
            ];
        }
        if (timeEndIndex > 0) {
            // Reverse order of time components, since they should be displayed in descending
            // granularity.
            formatStringArray = [
                ...formatStringArray.slice(0, timeEndIndex).reverse(),
                ...formatStringArray.slice(timeEndIndex),
            ];
            if (timeEndIndex < formatStringArray.length) {
                // Insert a gap between time and date components.
                formatStringArray.splice(timeEndIndex, 0, ' ');
            }
        }

        return formatStringArray.join('');
    }

    defaultTickFormat(ticks?: any[]) {
        const formatString = this.calculateDefaultTickFormat(ticks);
        return (date: Date) => buildFormatter(formatString)(date);
    }

    /**
     *
     * @param interval If the `interval` is a number, it's interpreted as the desired tick count
     * and the method tries to pick an appropriate interval automatically, based on the extent of the domain.
     * If the `interval` is `undefined`, it defaults to `10`.
     * If the `interval` is a time interval, simply use it.
     * @param start The start time (timestamp).
     * @param stop The end time (timestamp).
     * @param step Number of intervals between ticks.
     */
    tickInterval({
        interval,
        start,
        stop,
        step,
        offset,
    }: {
        interval: number | CountableTimeInterval;
        start: number;
        stop: number;
        step?: number;
        offset?: number;
    }): CountableTimeInterval | TimeInterval | undefined {
        if (typeof interval === 'number') {
            const tickCount = Math.max(0, interval - (offset ?? 0));
            const tickIntervals = this.tickIntervals;
            const target = Math.abs(stop - start) / tickCount;
            const i = complexBisectRight(tickIntervals, target, (interval) => interval[2]);
            if (i === tickIntervals.length) {
                step = tickStep(start / durationYear, stop / durationYear, tickCount);
                interval = this.year;
            } else if (i) {
                [interval, step] =
                    tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
            } else {
                step = Math.max(tickStep(start, stop, interval), 1);
                interval = this.millisecond;
            }
        }
        return step == undefined ? interval : interval.every(step);
    }

    protected _domain: Date[] = [new Date(2022, 11, 7), new Date(2022, 11, 8)];
    set domain(values: Date[]) {
        this._domain = values.map((d: any) => (d instanceof Date ? d : new Date(d)));
    }
    get domain(): Date[] {
        return this._domain;
    }

    invert(y: number): Date {
        return new Date(super.invert(y));
    }

    /**
     * Returns uniformly-spaced dates that represent the scale's domain.
     * @param interval The desired tick count or a time interval object.
     */
    ticks(interval: number | CountableTimeInterval = 10, offset?: number): Date[] {
        const d = this._domain.map((d) => d.getTime());
        let t0 = d[0];
        let t1 = d[d.length - 1];
        const reverse = t1 < t0;

        if (reverse) {
            const _ = t0;
            t0 = t1;
            t1 = _;
        }
        const t = this.tickInterval({ interval, start: t0, stop: t1, offset });
        const i = t ? t.range(new Date(t0), new Date(t1 + 1)) : []; // inclusive stop

        return reverse ? i.reverse() : i;
    }

    /**
     * Returns a time format function suitable for displaying tick values.
     * @param count Ignored. Used only to satisfy the {@link Scale} interface.
     * @param specifier If the specifier string is provided, this method is equivalent to
     * the {@link TimeLocaleObject.format} method.
     * If no specifier is provided, this method returns the default time format function.
     */
    tickFormat({ ticks, specifier }: { count?: any; ticks?: any[]; specifier?: string }): (date: Date) => string {
        return specifier == undefined ? this.defaultTickFormat(ticks) : buildFormatter(specifier);
    }

    /**
     * Extends the domain so that it starts and ends on nice round values.
     * This method typically modifies the scale’s domain, and may only extend the bounds to the nearest round value.
     * @param interval
     */
    nice(interval: number | CountableTimeInterval = 10): void {
        const d = this._domain;
        const i = this.tickInterval({ interval, start: d[0]?.getTime(), stop: d[d.length - 1]?.getTime() });

        if (i) {
            this.domain = this._nice(d, i);
        }
    }

    private _nice(domain: Date[], interval: TimeInterval): Date[] {
        domain = domain.slice();
        let i0 = 0;
        let i1 = domain.length - 1;
        let x0 = domain[i0];
        let x1 = domain[i1];

        if (x1 < x0) {
            [i0, i1] = [i1, i0];
            [x0, x1] = [x1, x0];
        }

        domain[i0] = interval.floor(x0);
        domain[i1] = interval.ceil(x1);

        return domain;
    }
}
