import {IntervalCalculator} from "../IntervalCalculator";
import {TypedError} from '@core/TypedError';

describe('IntervalCalculator - interval subtraction', () => {
    function runTest(includesStr: string, excludesStr: string, expectedStr: string) {
        const calculator = new IntervalCalculator(includesStr, excludesStr);
        const result = calculator.getFormattedResult()

        expect(result).toBe(expectedStr);
    }

    it('Example 1', () => {
        runTest("10-100", "20-30", "10-19, 31-100");
    });

    it('Example 2', () => {
        runTest("50-5000, 10-100", "", "10-5000");
    });

    it('Example 3', () => {
        runTest("200-300, 50-150", "95-205", "50-94, 206-300");
    });

    it('Example 4', () => {
        runTest("200-300, 10-100, 400-500", "410-420, 95-205, 100-150", "10-94, 206-300, 400-409, 421-500");
    });

    it('Excludes fully cover includes', () => {
        runTest("10-20,30-40", "0-50", "");
    });

    it('Multiple overlapping excludes', () => {
        runTest("10-50", "20-30,25-35,40-45", "10-19, 36-39, 46-50");
    });

    it('Excludes touching starts/ends of includes', () => {
        runTest("10-20,30-40", "20-30", "10-19, 31-40");
    });

    it('Includes completely inside an exclude', () => {
        runTest("15-25", "10-30", "");
    });

    it('Many tiny intervals', () => {
        runTest("1-2,4-5,7-8,10-11", "2-10", "1-1, 11-11");
    });

    it('Huge range with small excludes', () => {
        runTest("1-1000000", "100-200,500000-500010,999999-1000000", "1-99, 201-499999, 500011-999998");
    });

    it('Includes and excludes with same boundaries', () => {
        runTest("10-20,30-40", "10-20,30-40", "");
    });

    it('Edge case: exclude at start of include', () => {
        runTest("10-20", "10-10", "11-20");
    });

    it('Edge case: exclude at end of include', () => {
        runTest("10-20", "20-20", "10-19");
    });

    it('No excludes', () => {
        runTest("10-20,30-40", "", "10-20, 30-40");
    });

    it('No includes', () => {
        runTest("", "10-20", "");
    });
});

describe('IntervalCalculator - error handling', () => {
    test('throws error for non-numeric interval', () => {
        expect(() => {
            new IntervalCalculator('10-20, a-b', '');
        }).toThrow(TypedError);
        expect(() => {
            new IntervalCalculator('10-20, a-b', '');
        }).toThrow(/Invalid interval/);
    });

    test('throws error for start > end', () => {
        expect(() => {
            new IntervalCalculator('30-20', '');
        }).toThrow(TypedError);
        expect(() => {
            new IntervalCalculator('30-20', '');
        }).toThrow(/Invalid interval/);
    });

    test('throws error for empty start or end', () => {
        expect(() => {
            new IntervalCalculator('10-', '');
        }).toThrow(TypedError);
        expect(() => {
            new IntervalCalculator('-20', '');
        }).toThrow(TypedError);
    });

    test('handles empty input without throwing', () => {
        expect(() => {
            new IntervalCalculator('', '');
        }).not.toThrow();
    });

    test('throws error for spaces-only input in an interval', () => {
        expect(() => {
            new IntervalCalculator('10-20,  - ', '');
        }).toThrow(TypedError);
    });
});
