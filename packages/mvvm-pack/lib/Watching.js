class Watching {
  constructor(compiler, watchOptions, handler) {
    this.startTime = null;
    this.invalid = false;
    this.handler = handler;
    this.callbacks = [];
    this.closed = false;
    if (typeof watchOptions === "number") {
      this.watchOptions = {
        aggregateTimeout: watchOptions
      };
    } else if (watchOptions && typeof watchOptions === "object") {
      this.watchOptions = Object.assign({}, watchOptions);
    } else {
      this.watchOptions = {};
    }
    this.watchOptions.aggregateTimeout = this.watchOptions.aggregateTimeout || 200;
    this.compiler = compiler;
    this.running = true;
    this._go();
  }

  async _go() {
    this.startTime = Date.now();
    this.running = true;
    this.invalid = false;
    await this.compiler.run();
    this._done();

  }

  _getStats(compilation) {
    const stats = new Stats(compilation);
    stats.startTime = this.startTime;
    stats.endTime = Date.now();
    return stats;
  }

  _done(err, compilation) {
    this.running = false;
    if (this.invalid) {return this._go();}
    this.handler(null, this.compiler);
    let contextDependencies = [];
    let missingDependencies = [];
    if (!this.closed) {
      this.watch([...this.compiler.fileDependencies], contextDependencies, missingDependencies);
    }
  }

  watch(files, dirs, missing) {
    this.pausedWatcher = null;
    this.watcher = this.compiler.watchFileSystem.watch(files, dirs, missing, this.startTime, this.watchOptions, (err, filesModified, contextModified, missingModified, fileTimestamps, contextTimestamps) => {
      this.pausedWatcher = this.watcher;
      this.watcher = null;
      if (err) {return this.handler(err);}
      this.compiler.fileTimestamps = fileTimestamps;
      this.compiler.contextTimestamps = contextTimestamps;
      this.invalidate();
    }, (fileName, changeTime) => {
      this.compiler.emit("invalid", fileName, changeTime);
    });
  }

  invalidate(callback) {
    if (callback) {
      this.callbacks.push(callback);
    }
    if (this.watcher) {
      this.pausedWatcher = this.watcher;
      this.watcher.pause();
      this.watcher = null;
    }
    if (this.running) {
      this.invalid = true;
      return false;
    } else {
      this._go();
    }
  }

  close(callback) {
    if (callback === undefined) {callback = function() {};}

    this.closed = true;
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.pausedWatcher) {
      this.pausedWatcher.close();
      this.pausedWatcher = null;
    }
    if (this.running) {
      this.invalid = true;
      this._done = () => {
        this.compiler.emit("watch-close");
        callback();
      };
    } else {
      this.compiler.emit("watch-close");
      callback();
    }
  }
}

module.exports = Watching;
