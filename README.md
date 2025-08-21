## Run

- npm install
- npm run dev

## Browser
http://localhost:3000/api-docs

## Description on the algorithm
The main algorithm is in the IntervalCalculator class, in which it parses the intervals.
Then we sort the arrays which is O(nlogn) and easily have a loop over it and calculate the overlaps.


## Quick test
Uncomment and give input in IntervalCalculator.ts:
- // const calculator = new IntervalCalculator("10-20, 30-50", "15-40, 17-38");
- // console.log('calculator', calculator.getFormattedResult());

## Tests
Inside routes/intervals/_tests_, there are some tests for making sure the IntervalCalculator class is working.

## yaml
For running the tests automatically
