import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
// Downloads the image, filters it, returns it, then deletes the temp file.
// 200 = success, 400 = missing image_url, 422 = image could not be processed

    app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;

  // 1. validate the image_url query
  if (!image_url) {
    return res.status(400).send({ message: "image_url is required" });
  }

  try {
    // 2. filter the image
    const filteredpath = await filterImageFromURL(image_url);

    // 3. send the resulting file
    return res.sendFile(filteredpath, async (err) => {
      await deleteLocalFiles([filteredpath]);
      if (err && !res.headersSent) {
        return res.status(500).send({ message: "Error sending the image" });
      }
    });
  } catch (error) {
    return res.status(422).send({
      message: "Unable to process the image. Please provide a valid image URL.",
    });
  }
});
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
