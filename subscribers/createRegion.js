const {region} = require('@venture-api/fixtures/dictionary');


module.exports = (kojo, logger) => {

    const {stair, mongo} = kojo.get();

    stair.read('createRegion', async (regionData) => {
        const index = mongo.db(region).collection('index');
        const {ops: [newRegion]} = await index.insertOne(regionData);
        logger.info('created:', newRegion);
    });
};
