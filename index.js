const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const artistJsonPath = path.join(__dirname, "", "artists.json");
const galleryJsonPath = path.join(__dirname, "", "galleries.json");
const paintingsJsonPath = path.join(__dirname, "", "paintings-nested.json");

const galleryJsonData = fs.readFileSync(galleryJsonPath);
const artistJsonData = fs.readFileSync(artistJsonPath);
const paintingsJsonData = fs.readFileSync(paintingsJsonPath);

const artists = JSON.parse(artistJsonData);
const galleries = JSON.parse(galleryJsonData);
const paintings = JSON.parse(paintingsJsonData);

/*
app.get('/', (req, res) => {
    res.send(paintings);
});
*/

// if a request is made for artist, return the artists.json file 
//TESTED: YES

app.get('/artist', (req, res) => {
    // return all artist names in the artists.json file
    res.send(artists);
    console.log("artists.json file returned");
    
    });

// Returns JSON for all artists from the specified country. This should be case insensitive 
//TESTED: YES
app.get('/artist/:country', (req, res) => {
    const country = req.params.country;
    const artistsByCountry = artists.filter(artist => artist.Nationality.toLowerCase() === country.toLowerCase());
    if (artistsByCountry.length === 0) 
    {
        res.status(404).json('No artists found in that country');
    }
    else
    {
        res.send(artistsByCountry);
    }
    
    console.log("artists country returned");
});

// Returns JSON for all galleries 
//TESTED: YES
app.get('/gallery', (req, res) => {
    res.send(galleries);
    console.log("galleries.json file returned");
});

// Returns JSON for all galleries from the specified country. This should be case insensitive 
// TESTED: YES
app.get('/gallery/:country', (req, res) => {
    const country = req.params.country;
    const galleriesByCountry = galleries.filter(gallery => gallery.GalleryCountry.toLowerCase() === country.toLowerCase());
    if (galleriesByCountry.length === 0)
    {
        res.status(404).json("No galleries found in that country");
    }
    else
    {
        res.send(galleriesByCountry);
    }
    console.log("galleries country returned");
});

// Returns JSON for all paintings
// TESTED: YES
app.get('/painting', (req, res) => {
    res.send(paintings);
    console.log("paintings.json file returned");
});




// Returns JSON for the paintings whose gallery id matches the provided gallery id.
// TESTED: YES
app.get('/painting/gallery/:id', (req, res) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByGalleryId = paintings.filter(painting => painting.gallery.galleryID === id);
    
    if(paintingsByGalleryId.length === 0)
    {
        res.status(404).json("No paintings found in that gallery");
    }
    else
    {
        res.send(paintingsByGalleryId);
    }
    console.log("paintings gallery id returned");
});



// Returns JSON for the paintings whose artist id matches the provided artist id.
// TESTED: YES
app.get('/painting/artist/:id', (req, res) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByArtistId = paintings.filter(painting => painting.artist.artistID === id);

    if(paintingsByArtistId.length === 0)
    {
        res.status(404).json("No paintings found by that artist");
    }
    else
    {
        res.send(paintingsByArtistId);
    }
    console.log("paintings artist id returned");
});


// Returns all paintings whose yearOfWork field is between the two supplied values.
// TESTED: YES
app.get('/painting/year/:min/:max', (req, res) => {
    const temp1 = req.params.min;
    const temp2 = req.params.max;
    const min = parseInt(temp1);
    const max = parseInt(temp2);

    const paintingsByYear = paintings.filter(painting => painting.yearOfWork >= min && painting.yearOfWork <= max);
     
    if(paintingsByYear.length === 0)
    {
        res.status(404).json("No paintings found in that year range");
    }
    else
    {
        res.send(paintingsByYear);
    }
    console.log("paintings year returned");
});



// Returns JSON for the paintings whose title contains (somewhere) the provided text. This search should be case insensitive.
// TESTED: YES
app.get('/painting/title/:text', (req, res) => {
    const text = req.params.text;
    const paintingsByTitle = paintings.filter(painting => painting.title.toLowerCase().includes(text.toLowerCase()));

    if(paintingsByTitle.length === 0)
    {
        // send a json object with a message property that says "No paintings found with that title"
        res.status(404).json("No paintings found with that title")
    }
    else
    {
        res.send(paintingsByTitle);
    }
    console.log("paintings title returned");
});



// Returns JSON for the paintings that have a color that matches the provided hex value. Each painting has a dominantColors array with the six most common colors in the painting; each of these color values comes with a property named name that contains the name for that color. This should be case insensitive.
// TESTED: YES
app.get('/painting/color/:name', (req, res) => {
    const name = req.params.name;
    const paintingsByColor = paintings.filter(painting => painting.details.annotation.dominantColors.some(color => color.name.toLowerCase() === name.toLowerCase()));
   
    if(paintingsByColor.length === 0)
    {
        res.status(404).json("No paintings found with that color");
    }
    else
    {
        res.send(paintingsByColor);
    }
    console.log("paintings color returned");
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));
