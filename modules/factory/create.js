module.exports = async function (factoryData) {

    const {kojo, logger} = this;
    const mongo = kojo.get('mongo');
    const {databases} = kojo.get('config');
    const index = mongo.db(databases.factories).collection('index');
    const {result} = await index.insertOne(factoryData);
    logger.info(result);
    return factoryData;
};
