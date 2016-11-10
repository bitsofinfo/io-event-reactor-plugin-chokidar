# io-event-reactor-plugin-chokidar

[![Build Status](https://travis-ci.org/bitsofinfo/io-event-reactor-plugin-chokidar.svg?branch=master)](https://travis-ci.org/bitsofinfo/io-event-reactor-plugin-chokidar) 

[Chokidar](https://github.com/paulmillr/chokidar) filesystem event monitor plugin for the [io-event-reactor](https://github.com/bitsofinfo/io-event-reactor) module

[![NPM](https://nodei.co/npm/io-event-reactor-plugin-chokidar.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/io-event-reactor-plugin-chokidar/)

## Usage

To configure this MonitorPlugin in your application that uses [io-event-reactor](https://github.com/bitsofinfo/io-event-reactor) do the following

```
npm install io-event-reactor-plugin-chokidar
```

Then in your [io-event-reactor](https://github.com/bitsofinfo/io-event-reactor) configuration object that you pass to the `IoReactorService`
constructor, you will specify this plugin in the `monitor` block as so:

```
var ioReactorServiceConf = {

  ...

  ioReactors: [

          {
              id: "reactor1",

              monitor: {
                  plugin: "io-event-reactor-plugin-chokidar",

                  config: {

                      // the paths to have chokidar monitor
                      paths: ['path1/','/path2/x', ....],

                      // the options below are standard Chokidar options
                      // see: https://github.com/paulmillr/chokidar
                      options: {
                          alwaysStat: false,
                          awaitWriteFinish: {
                              stabilityThreshold: 200,
                              pollInterval: 100
                          },
                          ignoreInitial:true
                      }
                  }
              },

              evaluators: [...],
              reactors:[...]
        },
        ....
    ]

    ...
};
```

### Unit tests

To run the unit tests go to the root of the project and run the following.

```
mocha test/all.js
```
