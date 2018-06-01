module.exports = async function (items=[]) {

    const {kojo, logger} = this;
    const stair = kojo.get('stair');
    logger.debug('items count:', items.length);
    const promises = [];
    items.map(([subject, payload]) => {
        logger.debug(subject, payload);
        promises.push(stair.write(subject, payload));
    });
    await Promise.all(promises);
    logger.info(`${promises.length} items fed`);
};
