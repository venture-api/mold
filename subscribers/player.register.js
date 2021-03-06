module.exports = async (kojo, logger) => {

    const {stair, tasu} = kojo.get();
    const {player, acl} = kojo.modules;

    await stair.read('player.register', async (payload) => {
        logger.debug(payload);

        // create player record
        const newPlayer = await player.register(payload);

        // create acl record
        await acl.create('player', newPlayer);

        logger.info('registered:', newPlayer);
        tasu.publish(`${newPlayer.id}.player.registered`, newPlayer);
    });
};
