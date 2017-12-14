const Plant = require('@venture-api/plant');
const pack = require('./package.json');

async function main() {
    const plant = new Plant('mold', {}, pack);
    await plant.ready();
}

return main();