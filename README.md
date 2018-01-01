# chorus

*Clone Hero-friendly Organized Repository of User-provided Songs*

[Link to web app here](http://arcturus.fightthe.pw)

## Introduction

The current state of Guitar Hero/Rock Band/Clone Hero custom songs aggregation is rather unsatisfying, scattered and newcomer-averse: this is an attempt to make it more searchable and user-friendly. 

The current sources are based on the
[official CH charts spreadsheet](https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o)
with a ton of songs from talented charters, including conversions from C3. There are currently more than 14,000 charts indexed, and the number is still growing!

*Disclaimer: I am not responsible of the charts and songs that are indexed by chorus (except the charts that are attributed to "Paturages"). If you have an issue with any of those, please contact the source owners (links to sources are provided for every song).*

## How it works

**chorus** periodically imports links to songs from a list of mostly Google Drive folders (manually provided in the sources folder). It crawls the provided folders and formally saves the links (**not the song bundles**; I am not hosting/mirroring any charts other than mine) and their metadata in a database: the web app simply reads and searches from it.

The search engine makes use of PostgreSQL's `ts_vectors` and trigrams (via the `pg_trgm` extension): it operates on the concatenation of artist/band, song, charter and source names. It seems to be working pretty well for now!

## How to add your drive

[Follow the instructions described here](source-examples).

## Local installation

Configure a PostgreSQL database and get your Google API client ID and secret. Copy the conf.example folder to a conf folder and fill in the credential files.

`npm install` the node dependencies. `npm run import` to fill your database with all the drives. `npm start` to start the dev server for the web app.

`npm run import <short_name>` to run just one particular import script.

## Roadmap and random ideas

(you can definitely help if you want to!)

* *(In progress)* Index other popular custom packs (e.g. from FoF, Phase Shift...)
* **(Priority)** Fetch the song.ini for every song (if applicable) to get more metadata (individual charters for C3 converts/streamer packs/etc..., album, year, genre, instrument difficulties...)
* Fetch the .chart and/or .mid for every song to browse available difficulties and instruments
* Compute the checksum (`sha1` most likely) of .chart/.mid files (possibly for each difficulty/instrument) to detect duplicates and to be able to find a download link just from the .chart/.mid file (would be especially useful for streamers wanting to provide individual song download links for their setlists). Possibly cooperate with the Clone Hero dev team in regards to online leaderboards and highscores (potentially mergeable with chorus).
* Detect features in a .chart/.mid: Tap notes, open notes... Compute total notes and note density (total notes / song length (between first and last note))
* Investigate possibilities of detecting stolen charts (percentage of similarity in one difficulty/instrument)
* Support other hosting solutions (i.e. write [drivers](src/drivers) for them), such as Dropbox, Mediafire, MEGA...
* Link the search engine to a Discord bot
* Chart rating system, either via Discord (e.g. `!rate <link> 5`, rating storage by user), Google accounts (directly on the web app) or any kind of "fingerprinting" to avoid spam and duplicate votes. At the same time, provide a command to flag dead links and request takedowns.
* Introduce administration and maintenance accounts for charters/helpers for fixing links and song metadata if necessary. Give control to charters on their own charts, possibly via Discord (e.g. `!edit <link or ID> title:<My Title> artist:<My Artist>`). Add support for extra tags for searchability.
* Take and save song requests (low viability, but might be considered)
* Provide quick YouTube search links for songs, and/or even chart previews. Possibly work with the Clone Hero dev team in regards to .chart/.mid web previews.
