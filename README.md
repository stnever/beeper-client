# beeper-client

A client library to talk to a Beeper server. See the [server docs](http://github.com/stnever/beeper-server) for details on what this is.

This also includes a small utility to post beeps from the command line.

# Installing

This will give you the client library, if you want to `require()` it in you own systems:

    npm install --save beeper-client

If you want the command-line utility you'll want the `-g` flag (and probably run with `sudo`):

    npm install -g beeper-client

# Using in your own systems

To send a beep:

    var BeeperClient = require('beeper-client');

    // Configure the target host and access token, if any
    new BeeperClient({
      host: 'http://localhost:4444'
    })

    // Posts a beep from a source
    .postBeep({
      source: 'unittest/src1',
      contents: 'Test Message'
    })

    // Returns a (bluebird) Promise
    .then(function() {
      console.log('Sent successfully')
    })

In most non-trivial systems, you will probably want to isolate the configuration part in a thin wrapper of your own. See the `examples/my-beeper.js` file for details. It would look something like this:

    // in my-beeper.js
    var BeeperClient = require('beeper-client')
        client = new BeeperClient({
          host: myAppConfig.beeperHost     // use your app config, or
          token: myAppConfig.beeperToken   // environment vars, or whatever
        });

    module.exports = function beep(source, contents) {
      return client.postBeep({
        source: 'MyApp/' + source,        // perhaps you want to prefix all
        contents: contents                // beeps with a common string, or
                                          // use util.format() on the message
      })
    }

    // elsewhere in your code
    var beep = require('../my-beeper.js');

    var count = processLargeDataset();

    // you could wait for this promise to resolve, but since
    // this is just a notification, you don't really need to.
    beep('OrdersConsumer', 'Finished processing ' + count + ' #orders')


# CLI

The CLI utility assumes that at least part of the source will be the machine name. You can use it like this:

    user@server1 ~$ beeper "AppServer is up"
    (source will be "server1")

You can append a source using the -s switch:

    user@server1 ~$ beeper -s AppServer "I'm up"
    (source will be "server1/AppServer")

You can also override this and set the whole source. The configuration switches are explained when you do `beeper --help`. Or check the [cli help file](beeper-cli-help.md).