
module.exports = {

  dist: {
    files: [
      {
        expand: true,
        dot: true,
        cwd: process.cwd(),
        dest: '.dist',
        src: [
          'images/**',
          // 'scripts/**',
          'styles/**.css',
          'styles/fonts/**',
        ]
      }
    ]
  }

};
