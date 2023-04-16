const express = require('express');
const app = express();
const dns = require('./dns');
const path = require('path');
const spfAnalyzer = require('./spf-analyzer');
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
  const getRecordDescription = (type) => {
    const descriptions = {
      A: "A records map a domain to an IPv4 address.",
      AAAA: "AAAA records map a domain to an IPv6 address.",
      CNAME: "CNAME records alias one domain to another.",
      MX: "MX records specify the mail servers for a domain.",
      NS: "NS records delegate a domain to a set of name servers.",
      SOA: "SOA records contain information about a domain's DNS zone.",
      SRV: "SRV records provide service discovery information for a domain.",
      TXT: "TXT records store arbitrary text data associated with a domain.",
    };
    return descriptions[type];
  };

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

  console.log('TXT Records:', records.TXT);

  const spfIssues = records.TXT ? spfAnalyzer.analyzeSpf(records.TXT) : [];

  res.render("index", {
    records,
    domain,
    message,
    spfIssues,
    getRecordDescription,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
