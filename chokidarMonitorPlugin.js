var util = require('util');
var chokidar = require('chokidar');


class ChokidarMonitorPlugin {

    /**
    * Constructor
    *
    * An io-event-reactor MonitorPlugin fulfilled by Chokidar: https://github.com/paulmillr/chokidar
    *
    * @param reactorId - id of the IoReactor this Monitor plugin is bound to
    * @param logFunction - a function to be used for logging w/ signature function(severity, origin, message)
    * @param errorCallback - a function to be used for relaying any errors w/ signature function(message, sourceErrorObject)
    *
    * @param ioEventCallback - when a file/dir event occurs, invoke this function(eventType, fullPath, optionalFsStats, optionalExtraInfo)
    *   - where 'eventType' is one of 'add', 'addDir', 'unlink', 'unlinkDir', 'change'
    *   - where 'fullPath' is the full path to the file/dir the event is for
    *   - when available, "optionalFsStats" if not null, should be = https://nodejs.org/api/fs.html#fs_class_fs_stats
    *   - when available, "optionalExtraInfo", varies by plugin
    *
    * @param initializedCallback - when this MonitorPlugin is full initialized, this callback should be invoked
    *
    * @param pluginConfig - Chokidar configuration object that contains the following Chokidar specific options, see: https://github.com/paulmillr/chokidar
    *
    *   paths - REQUIRED: (string or array of strings). Paths to files, dirs to be watched recursively, or glob patterns.
    *   options - REQUIRED object of chokidar options as defined in the chokidar documentation at: https://github.com/paulmillr/chokidar
    *
    */
    constructor(reactorId,
                logFunction,
                errorCallback,
                ioEventCallback,
                initializedCallback,
                pluginConfig) {

        try {
            this._reactorId = reactorId;
            this._logFunction = logFunction;
            this._errorCallback = errorCallback;
            this._ioEventCallback = ioEventCallback;
            this._initializedCallback = initializedCallback;

            this.watcher = chokidar.watch(pluginConfig.paths,pluginConfig.options);

            this.watcher.on('add',this._handleAdd.bind(this));
            this.watcher.on('change',this._handleChange.bind(this));
            this.watcher.on('unlink',this._handleUnlink.bind(this));
            this.watcher.on('addDir',this._handleAddDir.bind(this));
            this.watcher.on('unlinkDir',this._handleUnlinkDir.bind(this));
            this.watcher.on('ready',this._handleReady.bind(this));
            this.watcher.on('error',this._handleError.bind(this));

        } catch(e) {
            var errMsg = this.__proto__.constructor.name +"["+this._reactorId+"] unexpected error: " + e;
            this._log('error',errMsg);
            this._onError(errMsg,e);
        }

    }

    /**
    *  Helper log function
    *  will set origin = this class' name
    */
    _log(severity,message) {
        //console.log(severity + ' ' + message);
        this._logFunction(severity,(this.__proto__.constructor.name + '[' + this._reactorId + ']'),message);
    }

    /**
    *  Helper error function
    */
    _onError(errorMessage, error) {
        this._errorCallback(errorMessage, error);
    }

    /**
    * _reactToEvent() - coure event routing method to reactors
    *
    * @event name of the event
    * @path affected path
    * @stats optional stats, may be present for add, addDir and change only
    * @details optional details structure, only present for 'raw'
    */
    _reactToEvent(event,path,stats,details) {
        this._ioEventCallback(event,path,stats,details);
    }


    _handleReady() {
        this._log('trace','READY');
        this._initializedCallback();
    }

    _handleError(error) {
        var errMsg = "handleError() received: " + error;
        this._log('error',errMsg);
        this._errorCallback('errMsg',error);
    }


    _handleUnlink(path) {
        this._reactToEvent('unlink',path);
    }

    _handleUnlinkDir(path) {
        this._reactToEvent('unlinkDir',path);
    }

    _handleAddDir(path,stats) {
        this._reactToEvent('addDir',path,stats);
    }

    _handleAdd(path,stats) {
        this._reactToEvent('add',path,stats);
    }

    _handleChange(path,stats) {
        this._reactToEvent('change',path,stats);
    }


}


module.exports = ChokidarMonitorPlugin;
