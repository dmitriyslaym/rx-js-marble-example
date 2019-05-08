export default {
  'basic-interval': {
    name: 'Flattening an Observable',
    code: `const { range, from } = Rx;
const { map, mergeMap } = RxOperators;
    
const assetsData$ = range(1, 5).pipe(
    map((id) => from(fetchAsset(id))),
    //mergeMap((id) => from(fetchAsset(id))),
  );
    
    




    

    
    
    
    
    
    
    
    
    
    
function fetchAsset(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createAsset(id));
    }, 1000 + Math.random() * 2000)
  })
}

const createAsset = (assetId) => {
  return {
    id: assetId,
    assetName: 'Asset' + assetId,
    price: Math.round((Math.random() + 0.01) * 5000),
    lastUpdate: Date.now(),
    type: assetId < 6 ? 'Stock' : 'Currency'
  }
};
assetsData$;
`,
    timeWindow: 5000
  },
  asset$: {
    name: 'Asset$',
    code: `const { range, from, interval } = Rx;
const { tap, map, mergeMap, startWith, scan } = RxOperators;
    
const assets$ = interval(5000)
  .pipe(
    map(val => val + 1),
    startWith(0),
    mergeMap(() => assetsData$),
    scan((acc, asset) => {
      return { ...acc, [asset.id]: asset }
    }, {})
  )


















const assetsData$ = range(1, 5).pipe(
    mergeMap((id) => from(fetchAsset(id))),
  );
 
function fetchAsset(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createAsset(id));
    }, 1000 + Math.random() * 2000)
  })
}

const createAsset = (assetId) => {
  return {
    id: assetId,
    assetName: 'Asset' + assetId,
    price: Math.round((Math.random() + 0.01) * 5000),
    lastUpdate: Date.now(),
    type: assetId < 6 ? 'Stock' : 'Currency'
  }
};

assets$
`,
    timeWindow: 20000
  },
  search$: {
    name: 'Search$',
    code: `const { of, fromEvent, Scheduler } = Rx;
const { map, debounceTime } = RxOperators;

const input = document.createElement('input');
input.setAttribute('placeholder', 'Type minimum price here');
input.setAttribute('type', 'number');
input.id = 'search';
output.prepend(input);
input.focus();

const search$ = fromEvent(
  document.getElementById('search'), 'input'
)
  .pipe(
    debounceTime(1000),
    map(event => Number(event.target.value)),
  );
  
search$
`,
    timeWindow: 20000
  },
  generateFilteredAssets: {
    name: 'generateFilteredAssets',
    code: `const { interval, from } = Rx;
const { reduce, filter, tap, delay } = RxOperators;

const generateFilteredAssets = (assetsMap, search) =>
  from(Object.values(assetsMap), Scheduler.async)
    .pipe(
      filter(asset => asset.price >= search),
      delay(3000),
      tap(console.log)
      reduce(
        (acc, filteredAsset) => [...acc, filteredAsset], []
      ),
    )

const assetsMap = {
  1: {
      id: 1,
      assetName: 'Asset1',
      price: 1111,
      lastUpdate: Date.now(),
  },
  2: {
      id: 2,
      assetName: 'Asset2',
      price: 3333,
      lastUpdate: Date.now() + 1,
  },
  3: {
      id: 3,
      assetName: 'Asset3',
      price: 1777,
      lastUpdate: Date.now() + 2,
  },
  4: {
      id: 4,
      assetName: 'Asset4',
      price: 4342,
      lastUpdate: Date.now() + 3,
  },
  5: {
      id: 5,
      assetName: 'Asset5',
      price: 2888,
      lastUpdate: Date.now() + 4,
  }
}
generateFilteredAssets(assetsMap, 3000);
`,
    timeWindow: 5500
  },
  'grouped-fibonacci': {
    name: 'Grouped Fibonacci',
    code: `const { interval } = Rx;
const { scan, pluck, groupBy } = RxOperators;

interval(1000).pipe(
  scan(
    ({ secondLast, last }) => ({
      secondLast: last,
      last: last + secondLast
    }),
    { secondLast: 0, last: 1 }
  ),
  pluck("secondLast"),
  groupBy(n => Math.floor(Math.log10(n)))
)

`,
    timeWindow: 15000
  },
  'today-is': {
    name: 'Today is...',
    code: `const { of, interval, range, EMPTY } = Rx;
const { delay, take, map, concatMap } = RxOperators;

const sentence = new Date().toString().toUpperCase();
const words = sentence.split(' ');
const delayMS = 1000;

const wordDelay = i =>
  i === 0
    ? delayMS
    : (words[i - 1].length + 1) * delayMS;

const wordStart = i =>
  i < words.length
    ? of(i).pipe(delay(wordDelay(i)))
    : EMPTY.pipe(delay(wordDelay(i)))

const wordObservable = word => {
  const letters = word.split('');

  return interval(delayMS).pipe(
    take(letters.length),
    map(i => letters[i])
  );
};

range(0, words.length + 1).pipe(
  concatMap(wordStart),
  map(i => wordObservable(words[i]))
)
`,
    timeWindow: 17000
  },
  'custom-operator': {
    name: 'Custom operator',
    code: `const { Observable, interval } = Rx;

const sqrt = source$ => Observable.create(observer =>
  source$.subscribe(
    value => {
      const result = Math.sqrt(value);

      if (typeof value !== 'number' || isNaN(result)) {
        observer.error(\`Square root of \${value} doesn't exist\`);
      } else {
        observer.next(result);
      }
    },
    err => observer.error(err),
    () => observer.complete()
  )
);

interval(1000).pipe(sqrt)

`,
    timeWindow: 12000
  },
  'mouse-move': {
    name: 'Mouse move',
    code: `const { fromEvent } = Rx;
const { map, throttleTime } = RxOperators;

fromEvent(document, 'mousemove').pipe(
  map(event => event.clientX),
  throttleTime(300)
)

// Move your mouse over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 10000
  },
  'input-element': {
    name: 'Input element',
    code: `const { fromEvent } = Rx;
const { map, filter } = RxOperators;

const input = document.createElement('input');

input.setAttribute('placeholder', 'Type something');

// \`output\` represents the right hand pane.
// You can prepend/append elements to it.
output.prepend(input);

input.focus();

fromEvent(input, 'keydown').pipe(
  map(e => e.key),
  filter(key => key !== ' ')
)
`,
    timeWindow: 20000
  },
  'pause-and-resume': {
    name: 'Pause and resume',
    code: `const { fromEvent, timer, EMPTY } = Rx;
const { scan, startWith, map, filter, switchMap } = RxOperators;

const pauseResume$ = fromEvent(document, 'click').pipe(
  scan(acc => !acc, true),
  startWith(true)
);
const counter$ = timer(0, 1000);

pauseResume$.pipe(
  switchMap(resume => resume ? counter$ : EMPTY)
)

// Click to pause and resume over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 20000
  },
  custom: {
    name: 'Custom',
    code: `// Write any JavaScript you want, just make sure that
// the last expression is an Rx.Observable

const {  } = Rx;
const {  } = RxOperators;
 `,
    timeWindow: 10000
  }
};
