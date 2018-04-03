module.exports = (kojo, logger) => {

    const stair = kojo.get('stair');
    stair.read('produce', async (message, done) => {
        const produce = kojo.module('produce');
        await produce.addToIds(message);
        done();
    });
};
