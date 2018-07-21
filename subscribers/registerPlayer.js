const {player: playerWrd} = require('@venture-api/fixtures/dictionary');


module.exports = async (kojo, logger) => {

    const {stair, tasu} = kojo.get();
    const {player, acl} = kojo.modules;

    await stair.read('registerPlayer', async (payload) => {
        logger.debug(payload);

        // create player record
        const newPlayerData = await player.create(payload);

        // create ACL record set
        await acl.initialize({principalType: playerWrd, principalId: newPlayerData.id});

        logger.info('registered:', newPlayerData);
        tasu.publish(`${newPlayerData.id}.playerRegistered`, newPlayerData);
    });
};
