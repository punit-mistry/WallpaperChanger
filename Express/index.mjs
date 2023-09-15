import express from 'express';
import fs from 'fs';
import { createCanvas } from 'canvas';
import { setWallpaper } from 'wallpaper';
import { createWorker } from 'tesseract.js'; // Import tesseract.js
import cors  from 'cors';
const app = express();
const Port = 8000;
app.use(cors());
app.use(express.json());
let CurrentText= 'Hello World'
// Define a route to retrieve the text from the image (GET request)
app.get('/getimage', async (req, res) => {
    try {
        const text = CurrentText;
        res.status(200).json({ text });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/', async (req, res) => {
    const text = req.body.text; // Assuming the incoming JSON has a "text" field
    CurrentText=text;
    try {
        const imagePath = await TexttoImage(text);
        await setWallpaper(imagePath);
        res.status(200).json({ message: 'Wallpaper set successfully', imagePath });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(Port, () => {
    console.log('Listening on port', Port);
});
async function TexttoImage(text) {
    return new Promise((resolve, reject) => {
        // Create a canvas
        const canvas = createCanvas(1920, 1080);  // Set the canvas size as needed

        // Get a 2D drawing context on the canvas
        const ctx = canvas.getContext('2d');

        // Set the background color
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the text properties
        ctx.fillStyle = 'white';
        ctx.font = '100px Arial'; // You can specify your font here

        // Draw the text on the canvas
        ctx.fillText(text, 40, 100); // Adjust the position as needed

        // Save the image to a file
        const imagePath = 'image.png'; // Specify the path and filename
        const outStream = fs.createWriteStream(imagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(outStream);

        outStream.on('finish', () => {
            console.log('Image saved successfully');
            resolve(imagePath);
        });

        outStream.on('error', (error) => {
            console.error('Image saving error:', error);
            reject(error);
        });
    });
}

async function extractTextFromImage(imagePath) {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng'); // Load the English language data
    await worker.initialize('eng');

    const {
        data: { text },
    } = await worker.recognize(imagePath); // Perform OCR on the image

    await worker.terminate(); // Terminate the worker

    return text;
}
