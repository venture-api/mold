module.exports = async function (factoryData) {

    const {kojo, logger} = this;
    const mongo = kojo.get('mongo');
    const index = mongo.db('factories').collection('index');
    const {result} = await index.insertOne(factoryData);
    logger.info(result);
    return factoryData;
};
