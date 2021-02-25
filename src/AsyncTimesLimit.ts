import AsyncQueue from './AsyncQueue';

const getIterator = (val: number | any[]): { isArray: boolean, iterator: any[] } => {
    const isArray = Array.isArray(val);
    const iterator = isArray ? val as any[] : Array(val as number).fill(0)
    return {
        iterator,
        isArray
    }
}


interface iteratee {
    (n: number, next: any): void
}

interface iteratee {
    (n: number, data: any, next: any): void
}

/**
 * 
 * @param {number | Array} tasks - Number or Iterable collection to run
 * @param {number} limit - Maximum limit of asynchronous tasks to run at any time
 * @param {iteratee} iteratee - Async Function to call each time 
 */
const asyncTimesLimit = (tasks: number | any[], 
    limit: number, 
    iteratee: iteratee): Promise<any> => {
    const { isArray, iterator } = getIterator(tasks);
    return new Promise((resolve, reject) => {
        try {
            let idx = 0;
            const taskQueue = iterator.map((item) => {
                return isArray 
                    ? iteratee.bind(this, idx++, item as any)
                    : iteratee.bind(this, idx++);
            })
            new AsyncQueue(taskQueue, limit, resolve).run();
        } catch(err) {
            reject(err);
        }
    })
}

export default asyncTimesLimit;