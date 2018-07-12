module.exports = (kojo, logger) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const {facility} = kojo.modules;

    stair.read('createFacility', async (payload) => {
        const newFacility = await facility.addToIndex(payload);
        logger.info('created:', newFacility);
        await tasu.publish(`${newFacility.ownerId}.facilityCreated`, newFacility);
    });
};
