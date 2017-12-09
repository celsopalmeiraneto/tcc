"use strict";

class ParallelOrchestrator {
  constructor(argumentsArray, parallelExecutions, func, context, verbose = false) {
    this.argumentsArray = [].concat(argumentsArray);
    this.parallelExecutions = parallelExecutions;
    this.func = func;
    this.context = context;
    this.verbose = verbose;

    this._availableSeats = parallelExecutions;
  }

  async run(){
    let initialItems = this.argumentsArray.splice(0, this.parallelExecutions);
    this._availableSeats -= initialItems.length;

    return await Promise.all(initialItems.map(v => {
      return this._internalExecution(v);
    }));
  }

  async _internalExecution(args){
    try {
      if(!Array.isArray(args))
        args = [args];
      await this.func.apply(this.context, [args]);
    } catch (e) {
      console.log(e);
    }
    this._availableSeats++;
    if(this._availableSeats > 0 && this.argumentsArray.length > 0){
      this._availableSeats--;
      await this._internalExecution(this.argumentsArray.shift());
    }
  }

}

module.exports = ParallelOrchestrator;
