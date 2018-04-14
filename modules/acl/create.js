const assert = require('assert');


module.exports = async function (principalType, {id, ownerId}) {

    assert(principalType);
    assert(id);

    const {kojo, logger} = this;
    logger.debug(principalType, id, ownerId);
    const mongo = kojo.get('mongo');
    const index = mongo.db('acl').collection('index');
    let mongoRes;

    switch (principalType) {

        case 'player':
            mongoRes = await index.insert([
                {key: `${id}::read::/player`},
                {key: `${id}::update::/player`},
                {key: `${id}::create::/factories`},
            ]);
            break;

        case 'factory':
            mongoRes = await index.insert([
                {key: `${ownerId}::read::/factories/${id}`},
                {key: `${ownerId}::update::/factories/${id}`},
                {key: `${ownerId}::delete::/factories/${id}`},

                {key: `${id}::create::/production`},
            ]);
            break;
    }


    logger.info(mongoRes.result);
};
