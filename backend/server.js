import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(bodyParser.raw({type:'application/octet-stream', limit:'100mb'}));
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use('/uploads', express.static('uploads'));

app.post('/upload', (req, res) => {
  const {name,currentChunkIndex,totalChunks} = req.query;
  const firstChunk = parseInt(currentChunkIndex) === 0;
  const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) -1;
  const data = req.body.toString().split(',')[1];
  const buffer = new Buffer(data, 'base64');
  if (firstChunk && fs.existsSync('./uploads/'+name)) {
    fs.unlinkSync('./uploads/'+name);
  }
  fs.appendFileSync('./uploads/'+name, buffer);
  if (lastChunk) {
    const finalFilename = name;
    fs.renameSync('./uploads/'+name, './uploads/'+finalFilename);
    res.json({finalFilename});
  } else {
    res.json('ok');
  }
});

app.listen(5000);