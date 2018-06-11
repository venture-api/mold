module.exports = async function (items=[]) {

    const {kojo, logger} = this;
    const stair = kojo.get('stair');
    logger.debug(`items count: ${items.length}`);
    await Promise.all(items.map(([subject, payload]) => {
        logger.info('feeding', subject, payload);
        return stair.write(subject, payload);
    }));
};
