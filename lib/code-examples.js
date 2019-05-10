export default {
  'basic-interval': {
    name: 'Flattening an Observable',
    code: `const { range, from } = Rx;
const { map, mergeMap } = RxOperators;
    
const assetsData$ = range(1, 5).pipe(
    map((id) => from(fetchAsset(id))),
    //mergeMap((id) => from(fetchAsset(id))),
  );
  
  // [1, [4, 5]] => [1, 4, 5]
  // Obs<1, Obs<4>, Obs<5>> => Obs<1, 4, 5>
    
    




    

    
    
    
    
    
    
    
    
    
    
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
assetsData$;
`,
    timeWindow: 5000
  },
  asset$: {
    name: 'Asset$',
    code: `const { range, from, timer } = Rx;
const { mergeMap, scan } = RxOperators;
    
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
const { reduce, filter, map, takeWhile, scan } = RxOperators;

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
        index => assets[index].price >= search
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
    code: `const { timer, from, range, iif, empty, of, fromEvent, ReplaySubject } = Rx;
const { reduce, mergeMap, switchMap, tap, scan, filter, map, takeWhile, debounceTime, multicast, refCount } = RxOperators;

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
    }, {}),
    multicast(() => new ReplaySubject(1)),
    refCount()
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
  switchMap(
    (minPrice) => generateSuggestedAssets(minPrice)
  ),
);

suggestedAssets$;
`,
    timeWindow: 60000
  },
  'buy$': {
    name: 'buy$',
    code: `const { timer, fromEvent, iif, empty, range, from, ReplaySubject } = Rx;
const { reduce, mergeMap, switchMap, tap, scan, filter, map, takeWhile, debounceTime, distinctUntilChanged, multicast, refCount } = RxOperators;

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
          (oldAsset, newAsset) => 
            oldAsset.price === newAsset.price
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
    }, {}),
    multicast(() => new ReplaySubject(1)),
    refCount()
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
  'assetsAlive$': {
    name: 'assetsAlive$',
    code: `const { timer, fromEvent, iif, empty, range, from } = Rx;
const { reduce, mergeMap, switchMap, tap, scan, filter, map, takeWhile, debounceTime, distinctUntilChanged, startWith, pairwise, takeUntil } = RxOperators;

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

const assetsAlive$ = search$.pipe(
  startWith(0),
  pairwise(),
  mergeMap(([prevSearch, currentSearch]) => iif(
    () => !prevSearch && !!currentSearch,
    assets$.pipe(
      takeUntil(
        search$.pipe(filter(search => !search))
      ),
    ),
    empty()
  ))
)














const assets$ = timer(0, 5000)
  .pipe(
    mergeMap(() => assetsData$),
    scan((acc, asset) => {
      return { ...acc, [asset.id]: asset }
    }, {}),
    multicast(() => new ReplaySubject(1)),
    refCount()
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

assetsAlive$;

`,
    timeWindow: 45000
  },
};
