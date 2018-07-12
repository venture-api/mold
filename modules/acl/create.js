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
                {_id: `${id}::read::/player`},
                {_id: `${id}::update::/player`},
                {_id: `${id}::create::/factories`},
            ]);
            break;

        case 'factory':
            mongoRes = await index.insert([
                {_id: `${ownerId}::read::/factories/${id}`},
                {_id: `${ownerId}::update::/factories/${id}`},
                {_id: `${ownerId}::delete::/factories/${id}`},

                {_id: `${id}::create::/production`},
            ]);
            break;
    }

    logger.info(mongoRes.result);
};
