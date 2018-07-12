const {resource} = require('@venture-api/fixtures/dictionary');


module.exports = async function (payload) {

    const {kojo, logger} = this;
    const {mongo} = kojo.get();
    const index = mongo.db(resource).collection('index');
    logger.debug(payload);
    await index.insertOne(payload);
};
