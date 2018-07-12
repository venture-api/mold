const {player} = require('@venture-api/fixtures/dictionary');


module.exports = async function (playerData) {

    const {kojo, logger} = this;
    const {mongo} = kojo.get();
    const index = mongo.db(player).collection('index');
    const {ops: [newPlayer]} = await index.insertOne(playerData);
    logger.info(newPlayer);
    return newPlayer;
};
