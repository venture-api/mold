module.exports = (kojo, logger) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const {factory} = kojo.modules;

    stair.read('factory.create', async (message) => {
        const newFactory = await factory.create(message);
        logger.info('created:', newFactory);
        await tasu.publish(`${newFactory.ownerId}.factory.created`, newFactory);
    });
};
