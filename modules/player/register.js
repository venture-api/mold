module.exports = async function ({id, email, name}) {

    const {kojo, logger} = this;
    const mongo = kojo.get('mongo');
    const index = mongo.db('players').collection('index');
    const {ops: [newPlayer]} = await index.insertOne({id, email, name});
    logger.info(newPlayer);
    return newPlayer;
};
