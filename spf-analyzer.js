const analyzeSpf = (txtRecords) => {
    const flattenedTxtRecords = txtRecords.flat();
    const spfRecords = flattenedTxtRecords.filter((record) => record.startsWith('v=spf1'));
    const issues = [];

    if (spfRecords.length === 0) {
        issues.push("No SPF record found. It's recommended to have an SPF record to prevent email spoofing.");
    } else if (spfRecords.length > 1) {
        issues.push("Multiple SPF records found. It's recommended to have only one SPF record.");
    }
    else {
        const spfRecord = spfRecords[0] && spfRecords[0].data;
        if (spfRecord) {
            const checks = [
                {
                    condition: !spfRecord.includes('mx') && !spfRecord.includes('a'),
                    message: "Neither 'a' nor 'mx' mechanisms found. At least one should be included to specify authorized senders."
                },
                {
                    condition: spfRecord.includes('all'),
                    message: "'all' mechanism found. This allows anyone to send mail from your domain."
                },
                {
                    condition: spfRecord.includes('ptr'),
                    message: "'ptr' mechanism found. Its use is discouraged due to performance and security concerns."
                },
                {
                    condition: (spfRecord.match(/ip4:/g) || []).length > 2,
                    message: "More than 2 'ip4:' mechanisms found. It's recommended to minimize the number of IP addresses allowed to send mail."
                },
                {
                    condition: spfRecord.includes('?all'),
                    message: "'?all' mechanism found. This is a neutral result and provides no authentication value."
                },
                {
                    condition: spfRecord.includes('~all'),
                    message: "'~all' mechanism found (softfail). Mail from unauthorized sources is accepted but marked as suspect. It's better to use '-all' (fail) for stronger enforcement."
                },
            ];
        } else {
            issues.push("Error reading SPF record data.");
        }
    }

    return issues;
};

module.exports = {
    analyzeSpf
};
