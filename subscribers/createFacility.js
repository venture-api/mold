module.exports = (kojo) => {

    const stair = kojo.get('stair');
    const {facility} = kojo.modules;

    stair.read('createFacility', async (payload) => {
       await facility.create(payload);
    });
};
