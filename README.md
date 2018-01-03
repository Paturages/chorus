# chorus

*Clone Hero-friendly Organized Repository of User-provided Songs*

[Link to web app here](https://chorus.fightthe.pw)

## Introduction

The current state of Guitar Hero/Rock Band/Clone Hero custom songs aggregation is rather unsatisfying, scattered and newcomer-averse: this is an attempt to make it more searchable and user-friendly. 

The current sources are based on the
[official CH charts spreadsheet](https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o)
with a ton of songs from talented charters, including conversions from C3, as well as the official GH/RB setlists. There are currently more than 18,000 charts indexed, and the number is still growing!

*Disclaimer: I am not responsible of the charts and songs that are indexed by chorus (except the charts that are attributed to "Paturages"). If you have an issue with any of those, please contact the source owners (links to sources are provided for every song).*

## How it works

**chorus** periodically imports links to songs from a list of mostly Google Drive folders (manually provided in the sources folder). It crawls the provided folders and formally saves the links (**not the song bundles themselves**) and their metadata in a database: the web app simply reads and searches from it.

The search engine makes use of PostgreSQL's `ts_vectors` and trigrams (via the `pg_trgm` extension): it operates on the concatenation of artist/band, song, charter and source names. It seems to be working pretty well for now!

## How to add your drive

[Follow the instructions described here](source-examples).

## Local installation

Configure a PostgreSQL database and get your Google API client ID and secret. Copy the conf.example folder to a conf folder and fill in the credential files.

`npm install` the node dependencies. `npm run import` to fill your database with all the drives. `npm start` to start the dev server for the web app.

`npm run import <short_name>` to run just one particular import script.

## Roadmap and random ideas

(you can definitely help if you want to!)

[My roadmap is actually getting considerable enough for it to warrant its own GitHub project page. Check it out!](https://github.com/Paturages/chorus/projects/1)
