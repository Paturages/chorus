module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0B2cTDJt4RaShTFBxak9nM212T0U',
  driveName: "DigitalSquirrel's charts",
  charterName: 'DigitalSquirrel',
  nameParser: name => {
    let artist, song;
    // If the file name does not have any '-' in it,
    // put "N/A" as an artist name
    if (name.indexOf('-') < 0) {
      artist = 'N/A';
      // Add spaces between words (i.e. before capitals)
      // only if the names are not entirely in caps
      // and discard the file extension
      song = name.match(/[a-z]/) ? name.slice(0, -4).replace(/([A-Z])/g, ' $1').trim() : name;
    } else {
      // If there is a '-', there is an artist/band we can use!
      // Decompose the file name into artist and song parts
      // and discard the file extension
      // (Hopefully no artist or song name has a '-' in it...)
      [, artist, song] = name.match(/(.+)-(.+)\.zip/);
      // Add spaces between words (i.e. before capitals)
      // only if the names are not entirely in caps
      // (e.g. "WAR")
      artist = artist.match(/[a-z]/) ? artist.replace(/([A-Z])/g, ' $1') : artist;
      song = song.match(/[a-z]/) ? song.replace(/([A-Z])/g, ' $1') : song;
    }
    // The format the function has to return is an object
    // with the attributes "artist" and "song"
    //
    // If "song" is null, the file is ignored
    // (useful for e.g. README.txt files)
    return { artist, song };
  }
}
