# chorus

*Clone Hero-friendly Organized Repository of User-provided Songs*

[Link to web app here](https://chorus.fightthe.pw)

## Introduction

The current state of Guitar Hero/Rock Band/Clone Hero custom songs aggregation is rather unsatisfying, scattered and newcomer-averse: this is an attempt to make it more searchable and user-friendly. 

A good part of the sources are based on the
[official CH charts spreadsheet](https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o)
with a ton of songs from talented charters, including conversions from C3, as well as the official GH/RB setlists. [Props to everyone who has added to the list as well!](sources/sources.txt) There are currently more than 20,000 charts indexed, and the number is still growing!

*Disclaimer: I am not responsible of the charts and songs that are indexed by chorus (except the charts that are attributed to "Paturages"). If you have an issue with any of those, please contact the charters and/or the source owners (links to sources are provided for every song).*

## How it works

**chorus** periodically imports links to songs from a list of mostly Google Drive folders (manually provided in the sources folder). It crawls the provided folders, downloads the `.chart`/`.mid` and `song.ini` files (or entire archives) to parse them for information, formally saves the links (**not the song bundles themselves**) and their metadata in a database and discards the downloaded items. The web app simply reads and searches from the data that is saved in the database.

The search engine makes use of PostgreSQL's `ts_vectors` and trigrams (via the `pg_trgm` extension): it operates on the concatenation of artist/band, song, charter and source names. It seems to be working pretty well for now!

## How to add your drive

[Follow the instructions described here](sources/sources.txt).

## Local installation and development

### Frontend

`npm install` dependencies, `npm run start:frontend` to boot the dev environment.

### Full stack

(*This might or might not work on Windows. Please reach out to me if you encounter problems.*)

Configure a PostgreSQL database and get your Google API client ID and secret. Copy the conf.example folder to a conf folder and fill in the credential files.

`npm install` the node dependencies. `npm run import` to fill your database with all the drives. `npm start` to start the dev server for the web app.

`npm run import <short_name>` to run just one particular import script.

Fair warning: the very first run will take more than 12 hours, so make sure to run the script as a background task. The following runs should only take about an hour, depending on the amount of new charts. If you're not willing to go through the 12+ hours, feel free to ask me for a database dump on Discord (`Paturages#9405`) or elsewhere.

## API documentation

```
/api/count
```
Yields the total amount of indexed charts

```
/api/random
```
Yields 20 charts picked at random

```
/api/latest
```
Grabs the 20 most recent charts

Query parameters
* `from` (Number): Offset from which the 20 charts are fetched

```
/api/search
```
Searches according to a query string, yields 20 results

Query parameters
* `query` (String): The search terms. It can either be generic words or an "advanced query" string composed of:
  * `name="some name"`: Song name
  * `artist="some artist"`: Artist/band name
  * `album="some album"`: Album name
  * `genre="some genre"`: Song genre
  * `charter="some charter"`: Charter name (as documented in their `song.ini`/`notes.chart`)
  * `tier_band`, `tier_guitar`, `tier_bass`, `tier_rhythm`, `tier_drums`, `tier_vocals`, `tier_keys`, `tier_guitarghl`, `tier_bassghl`: Difficulty tier as defined in `song.ini` by the `diff_*` entries (number from 0 to 6, usually). For instance, `tier_guitar=lt3` will look for tiers that are less than 3, `tier_guitar=gt3` will look for tiers higher than 3.
  * `diff_guitar`, `diff_bass`, `diff_rhythm`, `diff_drums`, `diff_vocals`, `diff_keys`, `diff_guitarghl`, `diff_bassghl`: Which difficulty parts (easy, medium, hard, expert) are available. It is a 4-wide bitmap (1 bit per difficulty part): `1` is easy, `2` is medium, `4` is hard, `8` is expert. Add numbers together to make multi-part queries.
  * `hasForced`, `hasOpen`, `hasTap`, `hasSections`, `hasStarPower`, `hasSoloSections`, `hasStems`, `hasVideo`: self explanatory, `0` to query for absence, `1` to query for presence.
* `from` (Number): Offset from which the 20 charts are fetched

`/api/search`, `api/random` and `/api/latest` both yield JSON in the following format:
* `roles` (Object): Key is lowercase charter name, value is their "caption", a.k.a. what's gonna show up when they get hovered.
* `songs` (Array of Objects): song entities containing:
  * `name`, `artist`, `album`, `genre`, `charter`, `year`
  * `hasForced`, `hasOpen` (Object containing parts that have them), `hasTap`, `hasSections`, `hasStarPower`, `hasSoloSections`, `hasStems`, `hasVideo`, `isPack`, `is120` (true if chart only has one BPM marker and it is 120)
  * `length`, `effectiveLength` (Number, in seconds; effective length is the duration between the first and the last note)
  * `tier_*` entries (`song.ini` difficulty tiering)
  * `diff_*` entries (bitmaps of difficulty parts, see a bit above for explanation)
  * `uploadedAt`, `lastModified` ("last modified" is the timestamp of the latest file modification. It is `null` when it couldn't be found (e.g. GDrive folders and charts that could not have been scanned only have `uploadedAt`))
  * `hashes`: MD5 checksums
    * `file`: MD5 of the chart itself
    * Other entries are parts that contain checksums per difficulty part
  * `noteCounts`: How many notes are in a part, per difficulty part
  * `link`: Download link. It either directs to
    * If it is a GDrive archive, the "view" page, where you have to explicitly click on "download"
    * If it is a GDrive folder, the folder itself
    * Else, it will most likely be a direct download link
  * `directLinks` (experimental): These links should allow you to directly trigger a download if you access/wget them.
  * `sources` (Array): Where it was pulled from

## Roadmap and random ideas

(you can definitely help if you want to!)

[My roadmap is actually getting considerable enough for it to warrant its own GitHub project page. Check it out!](https://github.com/Paturages/chorus/projects/1)
