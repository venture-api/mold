module.exports = async function (playerData) {

    const {kojo, logger} = this;
    const {mongo, config} = kojo.get();
    const {databases: {players}} = config;
    const index = mongo.db(players).collection('index');
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
