
/**
 * 
 */
export default class AsyncQueue {

    concurrent: number;
    total: number;
    tasks: { () : any } [];
    running: Promise<any>[];
    complete: Promise<any>[];
    passThrough: any[];
    resolve: (data?: any[]) => void;
    
    /**
     * 
     * @param {Array} promises 
     * @param {*} concurrentCount 
     * @param {*} done 
     */
  constructor(promises=[], concurrentCount=1, resolve) {
    this.concurrent = concurrentCount;
    this.total = promises.length;
    this.tasks = promises;
    this.running = [];
    this.complete = [];
    this.passThrough = [];
    this.resolve = resolve;
  }

  get next() {
    return (this.running.length < this.concurrent) && this.tasks.length;
  }
  
  get queueComplete() {
  	return this.running.length === 0 && this.total === this.complete.length;
  }

  done() {
      if (this.passThrough.length > 0) {
        this.resolve(this.passThrough);
      } else {
        this.resolve();
      }
  }

  run() {
    while (this.next) {
      const task = this.tasks.shift();
      const promiseTask = new Promise((resolve) => {
        // pass the resolve as next
        return task.call(this, resolve)
      });
      promiseTask.then((data) => {
        if (data) this.passThrough.push(data)
        this.complete.push(this.running.shift());
        if(this.queueComplete) {
           this.done();
        } else {
       	   this.run();
	    }
      });
      this.running.push(promiseTask);
    }
   }
}