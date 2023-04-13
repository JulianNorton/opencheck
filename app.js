const express = require('express');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { txtRecords: null, domain: null });
});

app.post('/lookup', (req, res) => {
    const domain = req.body.domain;

    dns.resolveTxt(domain, (err, records) => {
        if (err) {
            res.render('index', { txtRecords: null, domain: null });
            return;
        }

        res.render('index', { txtRecords: records.flat(), domain: domain });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

