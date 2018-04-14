module.exports = async (kojo, logger) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const player = kojo.module('player');
    const acl = kojo.module('acl');

    await stair.read('player.register', async (payload) => {
        logger.debug(payload);

        // create player record
        const newPlayer = await player.register(payload);

        // create acl record
        await acl.create('player', newPlayer);

        logger.debug('player registered, sending event');
        await tasu.publish(`${payload.id}.player.registered`, newPlayer);
    });
};
