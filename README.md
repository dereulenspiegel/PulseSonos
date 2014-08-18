PulseSonos
==========

PulseSonos is a small Server based on [AirSonos](https://github.com/stephen/airsonos) by [@stephencwan](https://twitter.com/stephencwan)

PulseSonos connects to a PulseAudio server and streams the playback stream to all found sonos devices.

Installation
------------

PulseSonos requires [node.js](http://nodejs.org) v0.10.x installed to run.

Install latest via source
```
$ git clone https://github.com/dereulenspiegel/PulseSonos.git
$ cd PulseSonos
$ npm install -g
```

On linux machines, there are dependencies for `libavahi-compat-libdnssd-dev libasound2-dev libpulse-dev` packages. On distributions with `apt`...
```
$ sudo apt-get install libavahi-compat-libdnssd-dev libasound2-dev libpulse-dev
```

Example usage
-------------
TODO

Development
-----------
```
$ git clone https://github.com/dereulenspiegel/PulseSonos.git
$ cd PulseSonos
$ npm install
$ node index.js
```

Changelog
---------

See ```CHANGELOG.md```
