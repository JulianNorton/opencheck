const analyzeSpf = (txtRecords) => {
    const spfRecords = txtRecords.filter(record => record.data && record.data.startsWith('v=spf1'));
    const issues = [];

    if (spfRecords.length === 0) {
        issues.push("No SPF record found. It's recommended to have an SPF record to prevent email spoofing.");
    } else if (spfRecords.length > 1) {
        issues.push("Multiple SPF records found. It's recommended to have only one SPF record.");
    }

    return issues;
};


module.exports = {
    analyzeSpf
};
