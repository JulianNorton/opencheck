const express = require('express');
const dns = require('dns');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { txtRecords: null, domain: null });
});

app.post('/lookup', (req, res) => {
    const domain = req.body.domain;
    let message = null;

    dns.resolveTxt(domain, (err, txtRecords) => {
        if (err) {
            txtRecords = null;
            message = `Error fetching TXT records: ${err.message}`;
        }

        dns.resolve4(domain, (err, aRecords) => {
            if (err) {
                aRecords = null;
                if (message) {
                    message += ` | Error fetching A records: ${err.message}`;
                } else {
                    message = `Error fetching A records: ${err.message}`;
                }
            }

            res.render('index', { txtRecords, aRecords, domain, message });
        });
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

