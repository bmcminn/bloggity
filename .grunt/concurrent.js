
module.exports = {

  tasks: ['connect:server', 'watch', 'open'],
  test: ['jshint', 'mdlint'],
  options: {
    logConcurrentOutput: true
  }

};
