

<!-- [![Latest Stable Version](https://img.shields.io/npm/v/sfdx-deploy-webpack-plugin.svg)](https://www.npmjs.com/package/sfdx-deploy-webpack-plugin)
[![NPM Downloads](https://img.shields.io/npm/dm/sfdx-deploy-webpack-plugin.svg)](https://www.npmjs.com/package/sfdx-deploy-webpack-plugin)
[![License](https://img.shields.io/github/license/mjyocca/sfdx-deploy-webpack-plugin.svg)](https://github.com/mjyocca/sfdx-deploy-webpack-plugin) -->


# async-parallel-limit

Limits the amount of concurrent asynchronous operations that can run at a given time. Inspired by async's asyncTimesLimit.

Instead of chunking a batch of promises and awaiting for each chunk to all resolve, once one promise resolves, adds the next one to the queue so there is always a constant amount of asynchronous tasks running.

### Arguments



### Module Support

#### ESM

```js
import asyncTimesLimit from 'async-parallel-limit';
```

#### Commonjs

```js
const asyncTimesLimit = require('async-parallel-limit');
```


## Example 1

```js
import asyncTimesLimit from 'async-parallel-limit'

(async () => {

    // array of objects
    const dataToProcess = getData();
    // will process the entire collection limiting only to running 10 in parallel
    // once each promise resolves, the next promise is added to the queue
    const apiProcessedIds = await asyncTimesLimit(
        dataToProcess, 
        10, 
        // async callback function to process the data
        async (n, data, next) => {
            const apiRes = await getFromAPI(data);
            // call next to resolve async task
            // and can pass data to collect once all promises resolve
            next(apiRes.id);
        }
    )
    // Array of Id's [,,,,]
    console.log(apiProcessedIds)

})();
```


## Example 2

```js
import asyncTimesLimit from 'async-parallel-limit'

(async () => {

    // Will process 50 times with a max of 10 concurrently/parallel
    const apiProcessedIds = await asyncTimesLimit(50, 10, 
        async (n, next) => {
            const apiRes = await getFromAPI(data);
            // call next to resolve async task
            // and can pass data to collect once all promises resolve
            next(apiRes.id);
        }
    )
    // Array of Id's [,,,,]
    console.log(apiProcessedIds)

})();
```
