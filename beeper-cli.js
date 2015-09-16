#!/usr/bin/env node

var BeeperClient = require('./beeper-client.js'),
    os = require('os'),
    fs = require('fs');

var config = {
  host: process.env.BEEPER_HOST,
  token: process.env.BEEPER_TOKEN
}

var beep = {
  sourcePrefix: process.env.BEEPER_SOURCE || os.hostname()
}

var args = process.argv;

function usage() {
  console.log(fs.readFileSync(__dirname + '/beeper-cli-help.md', 'utf-8'));
  process.exit();
}

if ( process.argv.length < 3 ) usage();

for ( var i = 2; i < args.length; i++ ) {
  if ( args[i] == '--help' )        usage();
  else if ( args[i] == '-t' )       config.token = args[++i];
  else if ( args[i] == '-h' )       config.host = args[++i];
  else if ( args[i] == '-s' )       beep.source = args[++i];
  else beep.contents = args[i]
}

var client = new BeeperClient(config)

beep.source = (beep.source.charAt(0) == '/')
  ? beep.source.substring(1)
  : beep.sourcePrefix + '/' + beep.source;

client.postBeep(beep).then(function() {
  console.log('Beep sent successfully at ' + new Date().toISOString());
})