const {facility: facilityWrd} = require('@venture-api/fixtures/dictionary');


module.exports = (kojo, logger) => {

    const tasu = kojo.get('tasu');
    const {facility, acl} = kojo.modules;

    facility.on('facilityCreated', async (facilityData) => {
        logger.debug('creating ACL for', facilityData.id);
        await acl.initialize({
            principalType: facilityWrd,
            elementId: facilityData.id,
            principalId: facilityData.ownerId
        });
        logger.info('done:', facilityData.id);
        await tasu.publish(`${facilityData.ownerId}.facilityCreated`, facilityData);
    });
};
