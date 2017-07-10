const log   = process.env.NODE_ENV === 'production' ? function() { return; } : console.log.bind(console);

log.info    = process.env.NODE_ENV === 'production' ? function() { return; } : console.info.bind(console);
log.error   = process.env.NODE_ENV === 'production' ? function() { return; } : console.error.bind(console);


module.exports = log;
