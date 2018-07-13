const {resource} = require('@venture-api/fixtures/dictionary');
const cooldownKey = require('@venture-api/fixtures/util/cooldownKey');


module.exports = (kojo, logger) => {

    const {stair, tasu, mongo, redisSet} = kojo.get();

    stair.read('produce', async ({id, location, ownerId, type, defects}) => {
        logger.debug('producing', id);
        const [{ops: [newResource]}] = await Promise.all([
            // create index record
            mongo.db(resource).collection('index').insertOne({
                id, location, ownerId, type, defects, producedAt: location
            }),
            // create cooldown record for the facility
            redisSet(cooldownKey(location), id, 'EX', 10)
        ]);
        logger.info('produced:', id);
        await tasu.publish(`${ownerId}.resourceProduced`, newResource);
    });
};
