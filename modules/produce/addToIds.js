module.exports = async function (projectData) {

    const {kojo, logger} = this;
    const db = kojo.get('db');
    const ids = db.collection('resource.ids');
    logger.debug(projectData);
    await ids.insertOne(projectData);
};
