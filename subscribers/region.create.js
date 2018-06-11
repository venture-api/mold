module.exports = (kojo, logger) => {

    const {stair, mongo, config: {databases: {regions}}} = kojo.get();

    stair.read('region.create', async (regionData) => {
        const index = mongo.db(regions).collection('index');
        const {ops: [newRegion]} = await index.insertOne(regionData);
        logger.info('created:', newRegion);
    });
};
