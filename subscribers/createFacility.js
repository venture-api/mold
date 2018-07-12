module.exports = (kojo, logger) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const {factory} = kojo.modules;

    stair.read('createFacility', async (message) => {
        const newFacility = await factory.create(message);
        logger.info('created:', newFacility);
        await tasu.publish(`${newFacility.ownerId}.facilityCreated`, newFacility);
    });
};
