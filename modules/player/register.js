const {player} = require('@venture-api/fixtures/constants/player');


module.exports = async function (playerData) {

    const {kojo, logger} = this;
    const {mongo} = kojo.get();
    const index = mongo.db(player).collection('index');
    try {
        const {ops: [newPlayer]} = await index.insertOne(playerData);
        return newPlayer;
    } catch (error) {
        if (error.code = 11000) {
            logger.debug('player already registered');

        } else {
            throw error;
        }
    }

};
