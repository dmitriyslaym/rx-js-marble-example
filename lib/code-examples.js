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
    code: `const { timer, from } = Rx;
const { reduce, filter, map, takeWhile } = RxOperators;

const generateFilteredAssets = (assetsMap, search) => {
  const assets = Object.values(assetsMap);

  // Timer is used only for demonstration purposes
  // In the app we use from(Object.values(assetsMap)), that emits each asset and completes
  return timer(0, 1000)
    .pipe(
      takeWhile(
        assetIndex => assetIndex <= assets.length - 1
      ),
      filter(
        assetIndex => assets[assetIndex].price >= search
      ),
      map(assetIndex => assets[assetIndex]),
      reduce(
        (acc, filteredAsset) => 
          [...acc, filteredAsset], []
      )
    )
}

const assetsMap = {
  1: {
      id: 1,
      assetName: 'Asset1',
      price: 1111,
      lastUpdate: Date.now(),
  },
  // Will be included
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
  // Will be included
  4: {
      id: 4,
      assetName: 'Asset4',
      price: 4342,
      lastUpdate: Date.now() + 3,
  },
}
generateFilteredAssets(assetsMap, 3000);
`,
    timeWindow: 5500
  },
  'generateSuggestedAssets': {
    name: 'generateSuggestedAssets',
    code: `const { timer, from, range, iif, empty, of } = Rx;
const { reduce, mergeMap, tap, scan, filter, map, takeWhile } = RxOperators;

// generateSuggestedAssets(3000)
const generateSuggestedAssets = (search) => iif(
  () => !!search,
  assets$
    .pipe(
      mergeMap(assetsMap =>
        generateFilteredAssets(assetsMap, search)),
      tap((filteredAssets) => {
        console.log('Updated suggested filters in view', filteredAssets)
      }),
    ),
  of('empty').pipe(
      tap(() => {
        console.log('Clear suggested filters in view')
      }),
    mergeMap(() => empty())
  )
)














const filterSuggestedAssets = (asset, search) => asset.price > +search;

const generateFilteredAssets = (assetsMap, search) =>
  from(Object.values(assetsMap))
    .pipe(
      filter(asset =>
        filterSuggestedAssets(asset, search)
      ),
      reduce(
        (acc, filteredAsset) => [...acc, filteredAsset], []
      ),
    )

const assets$ = timer(0, 5000)
  .pipe(
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
  }
};

generateSuggestedAssets(3000);
`,
    timeWindow: 20000
  },
  'suggestedAssets$': {
    name: 'suggestedAssets$',
    code: `const { timer, from, range, iif, empty, of, fromEvent } = Rx;
const { reduce, mergeMap, switchMap, tap, scan, filter, map, takeWhile, debounceTime } = RxOperators;

const generateSuggestedAssets = (search) => iif(
  () => !!search,
  assets$
    .pipe(
      mergeMap(assetsMap =>
        generateFilteredAssets(assetsMap, search)),
      tap((filteredAssets) => {
        console.log('Updated suggested filters in view', filteredAssets)
      }),
    ),
  of('empty').pipe(
      tap(() => {
        console.log('Clear suggested filters in view')
      }),
    mergeMap(() => empty())
  )
)

const filterSuggestedAssets = (asset, search) => asset.price > +search;

const generateFilteredAssets = (assetsMap, search) =>
  from(Object.values(assetsMap))
    .pipe(
      filter(asset =>
        filterSuggestedAssets(asset, search)
      ),
      reduce(
        (acc, filteredAsset) => [...acc, filteredAsset], []
      ),
    )

const assets$ = timer(0, 5000)
  .pipe(
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
  }
};

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

const suggestedAssets$ = search$.pipe(
  switchMap(generateSuggestedAssets),
);

suggestedAssets$;
`,
    timeWindow: 60000
  },
  'buy$': {
    name: 'buy$',
    code: `const { timer, fromEvent, iif, empty, range, from } = Rx;
const { reduce, mergeMap, switchMap, tap, scan, filter, map, takeWhile, debounceTime, distinctUntilChanged } = RxOperators;

const suggestedAssetIdToBuy = 4;

const button = document.createElement('button');
button.innerText = 'Buy the first suggested asset';
button.id = 'buy';
output.prepend(button);

const buy$ = fromEvent(
  document.getElementById('buy'), 'click'
).pipe(
  map((event) => suggestedAssetIdToBuy),
  mergeMap(
    (investedAssetId) => iif(
      () => !!investedAssetId,
      assets$.pipe(
        map(assetsMap => assetsMap[investedAssetId]),
        filter(asset => asset),
        distinctUntilChanged(
          (oldAsset, newAsset) => oldAsset.price === newAsset.price
        ),
        tap((data) => {
          console.log('updating invested asset', data);
        }),
      ),
      empty()
    )
  )
);
















const assets$ = timer(0, 5000)
  .pipe(
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
  }
};

buy$;
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
