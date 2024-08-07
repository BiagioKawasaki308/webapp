import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve i file statici dalla cartella "public"
app.use(express.static('public'));

// API per ottenere i tag
app.get('/api/tags', async (req, res) => {
    const query = req.query.query;
    const apiUrl = `https://danbooru.donmai.us/tags.json?search[name_matches]=${query}*`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).send('Server Error');
    }
});

// API per ottenere le immagini
app.get('/api/images', async (req, res) => {
    const tag = req.query.tag;
    const limit = req.query.limit || 20;
    const apiUrl = `https://danbooru.donmai.us/posts.json?tags=${tag}&limit=${limit}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send('Server Error');
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
