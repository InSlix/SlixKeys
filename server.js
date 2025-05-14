
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const licensesFile = './licenses.json';
let licenses = {};

if (fs.existsSync(licensesFile)) {
    licenses = JSON.parse(fs.readFileSync(licensesFile));
}

app.get('/licenses', (req, res) => {
    res.json(licenses);
});

app.get('/addlicense', (req, res) => {
    const { key, type } = req.query;
    if (!key || !type) {
        return res.status(400).send('Missing key or type');
    }
    licenses[key] = {
        status: "active",
        type: type,
        expires: type === "lifetime" ? "never" : "TBD"
    };
    saveLicenses();
    res.send('License added successfully.');
});

app.get('/removelicense', (req, res) => {
    const { key } = req.query;
    if (!key || !licenses[key]) {
        return res.status(400).send('Key not found');
    }
    delete licenses[key];
    saveLicenses();
    res.send('License removed successfully.');
});

function saveLicenses() {
    fs.writeFileSync(licensesFile, JSON.stringify(licenses, null, 2));
}

app.listen(PORT, () => {
    console.log(`License Server running on port ${PORT}`);
});
