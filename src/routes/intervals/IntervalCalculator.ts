import {TypedError} from "@core/TypedError";

type Interval_ = [number, number];

interface Event_ {
    value: number;
    type_: 'include_start' | 'include_end' | 'exclude_start' | 'exclude_end';
}

export class IntervalCalculator {
    private readonly includes: Interval_[];
    private readonly excludes: Interval_[];

    constructor(includesInput: string, excludesInput: string) {
        this.includes = this.parseIntervals(includesInput);
        this.excludes = this.parseIntervals(excludesInput);
    }

    private parseIntervals(input: string): Interval_[] {
        if (!input.trim()) return [];
        return input.split(',').map(s => {
            const [startStr, endStr] = s.trim().split('-');
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (isNaN(start) || isNaN(end) || start > end) {
                throw new TypedError(`Invalid interval: "${s}"`);
            }
            return [start, end] as Interval_;
        });
    }

    private eventPriority(type_: Event_['type_']): number {
        switch (type_) {
            case 'include_start':
                return 0;
            case 'exclude_start':
                return 1;
            case 'exclude_end':
                return 2;
            case 'include_end':
                return 3;
        }
    }

    private formatResult(intervals: Interval_[]): string {
        return intervals.map(([s, e]) => `${s}-${e}`).join(', ');
    }

    private subtractIntervals(): Interval_[] {
        const events: Event_[] = [];

        for (const [start, end] of this.includes) {
            events.push({value: start, type_: 'include_start'});
            events.push({value: end + 1, type_: 'include_end'});
        }

        for (const [start, end] of this.excludes) {
            events.push({value: start, type_: 'exclude_start'});
            events.push({value: end + 1, type_: 'exclude_end'});
        }

        events.sort((a, b) =>
            a.value - b.value ||
            this.eventPriority(a.type_) - this.eventPriority(b.type_)
        );

        const result: Interval_[] = [];
        let includeCount = 0;
        let excludeCount = 0;
        let currentStart: number | null = null;

        for (const e of events) {
            const wasActive = includeCount > 0 && excludeCount === 0;

            if (e.type_ === 'include_start') includeCount++;
            else if (e.type_ === 'include_end') includeCount--;
            else if (e.type_ === 'exclude_start') excludeCount++;
            else if (e.type_ === 'exclude_end') excludeCount--;

            const isActive = includeCount > 0 && excludeCount === 0;

            if (!wasActive && isActive) {
                currentStart = e.value;
            } else if (wasActive && !isActive && currentStart !== null) {
                if (currentStart <= e.value - 1) {
                    result.push([currentStart, e.value - 1]);
                    currentStart = null;
                }
            }
        }

        return result;
    }

    public getFormattedResult(): string {
        return this.formatResult(this.subtractIntervals());
    }
}

// const calculator = new IntervalCalculator("10-20, 30-50", "15-40, 17-38");
// console.log('calculator', calculator.getFormattedResult());