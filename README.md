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
$ sudo apt-get install libavahi-compat-libdnssd-dev libasound2-dev libpulse-dev build-essential
```

Example usage
-------------

1. start pulsesonos
```bash

...PulseSonos$ node index.js
PulseAudio Context state: connecting
PulseAudio Context state: authorizing
PulseAudio Context state: setting_name
PulseAudio Context state: ready
Creating playback stream
PlaybackStream state: creating
PlaybackStream state: ready
PlaybackStream connected
Creating Icecast server
Stream is reachable via http://10.0.0.101:9000/listen.m3u
Starting Sonos service
```

2. In sonos, add a radio station with the above similar address: `http://10.0.0.101:9000/listen.m3u`

3. play that radio station

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
