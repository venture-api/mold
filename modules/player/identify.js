module.exports = async function ({email}) {

    const {kojo, logger} = this;
    const mongo = kojo.get('mongo');
    const index = mongo.db('players').collection('index');
    const result = await index.findOne({email});
    logger.info(result);
    return result;
};
