const express = require('express');
const dns = require('./dns');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { records: {}, domain: null, message: null });
});

app.post('/lookup', async (req, res) => {
  let domain = req.body.domain;

  if (domain && domain.startsWith('www.')) {
    domain = domain.slice(4);
  }

  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'SRV', 'TXT'];
  let records = {};
  let message = null;

  try {
    records = await dns.resolveRecords(domain, recordTypes);
  } catch (err) {
    message = 'Error resolving DNS records.';
  }

  if (Object.keys(records).every(type => records[type].length === 0)) {
    message = 'No DNS records found for the specified domain.';
  }

  res.render('index', { records, domain, message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
