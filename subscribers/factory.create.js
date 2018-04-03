module.exports = (kojo) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const factory = kojo.module('factory');

    stair.read('factory.create', async (message) => {
        const newFactory = await factory.create(message);
        await tasu.publish(`${newFactory.ownerId}.factory.created`, newFactory);
    });
};
