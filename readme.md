

[![Latest Stable Version](https://img.shields.io/npm/v/@mjyocca/async-parallel-limit.svg)](https://www.npmjs.com/package/sfdx-deploy-webpack-plugin)
[![NPM Downloads](https://img.shields.io/npm/dm/sfdx-deploy-webpack-plugin.svg)](https://www.npmjs.com/package/@mjyocca/async-parallel-limit)
[![License](https://img.shields.io/github/license/mjyocca/async-parallel-limit.svg)](https://github.com/mjyocca/async-parallel-limit)


# async-parallel-limit

Limits the amount of asynchronous operations running in parallel at a given time with a provided callback interface. 

*Inspired by async's asyncTimesLimit*.

Instead of queueing up an array of asynchronous tasks to run in parallel such as `await Promise.all([...]);`, 

&&

Instead of queueing those promises in a form of a batch and waiting for all promises in the batch to resolve before processing the next batch,
`async-parallel-limit`, will queue up the next promise once one in the existing processing queue resolves.


<!-- 
Instead of chunking a batch of promises and waiting for each chunk to ***all*** resolve (Promise.all([...])), once one promise resolves, it adds the next promise to the queue so there is always a constant amount of asynchronous tasks running. -->


#### Visualized

Example => **12** tasks, limit of **3** in parallel

<img align="center" src="https://github.com/mjyocca/async-parallel-limit/blob/main/parallel.gif" />


### Install via npm

```bash
npm i --save @mjyocca/async-parallel-limit
```


<h3>Arguments</h2>

|    Param     |        Type       |                                                           
| :---------:  | :--------------:  |
|   tasks      | `{Array/number}`  |                                        
|    limit     | `{number}`         | 
|   iteratee   | `{Async Function}`   |


```js
import asyncParallel from '@mjyocca/async-parallel-limit';

// Process 20 total async tasks with a limit of 5 at time
await asyncParallel(20, 5, async (n, next) => {
    // processing
    next();
})
```

### Module Support

#### ESM

```js
import asyncTimesLimit from '@mjyocca/async-parallel-limit';
```

#### CommonJs

```js
const asyncTimesLimit = require('@mjyocca/async-parallel-limit');
```


### Example 1

```js
import asyncTimesLimit from '@mjyocca/async-parallel-limit'

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


### Example 2

```js
import asyncTimesLimit from '@mjyocca/async-parallel-limit'

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
