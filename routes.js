const express = require('express');
const router = express.Router();
const dns = require('./dns');
const spfAnalyzer = require('./spf-analyzer');
const getRecordDescription = require('./recordDescriptions');
const path = require('path');

router.use(express.urlencoded({ extended: false }));

router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    res.render('index', {
        records: {},
        domain: null,
        message: null,
        spfIssues: [],
        getRecordDescription: getRecordDescription
    });
});

router.get('/lookup', async (req, res) => {
    let domain = req.query.domain;

    if (!domain) {
        return res.render('content', {
            records: {},
            domain: null,
            message: 'Please enter a domain name.',
            spfIssues: []
        });
    }

    if (domain && domain.startsWith('www.')) {
        domain = domain.slice(4);
    }

    const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'SRV', 'TXT'];

    let message = null;

    let records;
    try {
        records = await dns.resolveRecords(domain, recordTypes);
        console.log(records);
    } catch (err) {
        message = 'Error resolving DNS records.';
    }

    if (Object.keys(records).every(type => records[type].length === 0)) {
        message = 'No DNS records found for the specified domain.';
    }

    console.log('TXT Records:', records.TXT);

    const spfIssues = records.TXT ? spfAnalyzer.analyzeSpf(records.TXT) : [];

    res.render('content', {
        records,
        domain,
        message,
        spfIssues: spfIssues
    });
});
module.exports = router;
