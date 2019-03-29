const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  user: String,
  poke: String,
  cp: String,
  type: Array,
  caught: String,
  path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);
app.use(express.static('public'));


// connect to the database
mongoose.connect('mongodb://localhost:27017/pokemon', {
  useNewUrlParser: true
});
//Also not needed i think
// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '/var/www/lab4.ianhagen.net/images/',
  limits: {
    fileSize: 10000000
  }
});

// Get a list of all of the items in the museum.
app.get('/api/pokemon', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.get('/api/pokemon/:user', async (req, res) => {
  try {
    let items = await Item.find({"user": req.params.user});
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//Dont think that i need this since images are hosted on the cloud
// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.put('/api/pokemon/:id', async (req, res) => {
	try {
		let item = await Item.findOne({_id: req.params.id})
    	item.cp = req.body.cp,
   		item.caught = req.body.caught,
		await item.save()
		res.sendStatus(200)
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
})

app.delete('/api/pokemon/:id', async (req, res) => {
	try {
		await Item.deleteOne({_id: req.params.id})
		res.sendStatus(200)
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
	
})

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/addPokemon/trade', async (req, res) => {
  const item = new Item({
	poke: req.body.poke,
    user: req.body.user,
    cp: req.body.cp,
    type: req.body.type,
    caught: req.body.caught,
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));
