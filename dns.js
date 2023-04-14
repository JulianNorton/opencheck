const dns = require('dns');

const resolveRecords = (domain, recordTypes) => {
  return Promise.all(recordTypes.map(type => {
    return new Promise((resolve) => {
      dns.resolve(domain, type, (err, data) => {
        if (!err) {
          resolve({ type, data });
        } else {
          resolve({ type, data: [] });
        }
      });
    });
  })).then(records => {
    return records.reduce((acc, record) => {
      acc[record.type] = record.data;
      return acc;
    }, {});
  });
};

module.exports = {
  resolveRecords
};
