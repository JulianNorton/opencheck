module.exports.getRecordDescription = function (type) {
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
