#!/usr/bin/env node

const Service = require('../lib/Service');

// console.log('CREATE SERVICE');

if (process.env.CHISEL_TEST) {
  module.exports = (argv) => {
    const service = new Service();
    return service.run(argv[0], argv.slice(1));
  };
} else {
  const service = new Service();
  service.run(process.argv[2], process.argv.slice(3)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
