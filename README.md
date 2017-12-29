# chorus

*Clone Hero-friendly Organized Repository of User-provided Songs*

[Link to web app here](http://arcturus.fightthe.pw)

## Introduction

The current state of Guitar Hero/Rock Band/Clone Hero custom songs aggregation is rather unsatisfying and newcomer-averse: this is an attempt to make it more searchable and user-friendly. 

The current sources are based on the
[official CH charts spreadsheet](https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o)
with a ton of songs from talented charters, including conversions from C3. There are currently more than 10,000 charts indexed, and the number is still growing!

## How it works

**chorus** periodically imports links to songs from a list of mostly Google Drive folders (provided in the sources folder). It crawls the provided folders and formally saves the links (**not the song bundles**; I am not hosting/mirroring any charts other than mine) and their metadata in a database: the web app simply reads and searches from it.

Right now, the search engine is a bit in a proof-of-concept, experimental mode (I have no idea what I'm doing with postgres text search and trigrams) but it should work, with quite a bit of leniency!

## How to add your drive

[Follow the instructions described here](source-examples).

## Local installation

Configure a PostgreSQL database and get your Google API client ID and secret. Copy the conf.example folder to a conf folder and fill in the credential files.

`npm install` the node dependencies. `npm run import` to fill your database with all the drives. `npm start` to start the dev server for the web app.

`npm run import <short_name>` to run just one particular import script.

## Roadmap and random ideas

(you can definitely help if you want to!)

* (**Priority**) Index official GH/RB songs and provide individual song download links
* Support YouTube channels and/or playlists
* Support Dropbox
* Support Mediafire
* Fetch the song.ini for every song (if applicable) to get more metadata (individual charters for C3 converts/streamer packs/etc..., album, year, genre, instrument difficulties...)
* Fetch the .chart and/or .mid for every song to browse available difficulties and instruments
* Link the search engine to a Discord bot
* Chart rating system, most likely via Discord (e.g. `!rate <link> 5`, rating storage by user). At the same time, provide a command to flag dead links and request takedowns.
* Give control to charters if their Discord account matches (implies assigning a Discord account to either sources or individual charters): e.g. `!edit <link or ID> title:<My Title> artist:<My Artist>`. Add support for extra tags for searchability.
* Take and save song requests
* Provide quick YouTube search links for songs, and/or even chart previews
