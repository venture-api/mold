const assert = require('assert');


module.exports = async function ({id, email, name}) {

    assert(id, 'id missing');
    assert(email, 'email missing');
    const {kojo, logger} = this;
    const mongo = kojo.get('mongo');
    const {databases} = kojo.get('config');
    const index = mongo.db(databases.players).collection('index');
    const {ops: [newPlayer]} = await index.insertOne({id, email, name});
    logger.info(newPlayer);
    return newPlayer;
};
