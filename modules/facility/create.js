const {facility} = require('@venture-api/fixtures/dictionary');


module.exports = async function (facilityData) {

    const {kojo, module} = this;
    const {mongo} = kojo.get();
    const index = mongo.db(facility).collection('index');
    const {ops: [newFacility]} = await index.insertOne(facilityData);
    module.emit('facilityCreated', facilityData);
    return newFacility;
};
