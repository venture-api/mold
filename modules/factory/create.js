module.exports = async function (factoryData) {

    const {kojo} = this;
    const {mongo, config} = kojo.get();
    const {databases: {factories}} = config;
    const index = mongo.db(factories).collection('index');
    const {ops: [newFactory]} = await index.insertOne(factoryData);
    return newFactory;
};
