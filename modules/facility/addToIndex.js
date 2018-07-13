const {facility} = require('@venture-api/fixtures/dictionary');


module.exports = async function (factoryData) {

    const {kojo} = this;
    const {mongo} = kojo.get();
    const index = mongo.db(facility).collection('index');
    const {ops: [newFacility]} = await index.insertOne(factoryData);
    return newFacility;
};
