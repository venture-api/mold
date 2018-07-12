module.exports = (kojo, logger) => {

    const stair = kojo.get('stair');
    stair.read('produce', async (payload, done) => {
        const produce = kojo.module('produce');
        await produce.addToIds(payload);
        done();
    });
};
