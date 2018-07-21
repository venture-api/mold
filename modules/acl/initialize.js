const assert = require('assert');
const {create, read, update, destroy, player, facility, self, produce} = require('@venture-api/fixtures/dictionary');


module.exports = async function ({principalId, principalType, elementId}) {

    assert(principalId);
    assert(principalType);

    const {kojo, logger} = this;
    logger.debug(principalId, principalType, elementId);
    const mongo = kojo.get('mongo');
    const index = mongo.db('acl').collection('index');
    let mongoRes;

    switch (principalType) {

        case player:
            mongoRes = await index.insert([
                {_id: `${principalId}::${read}::${self}`},
                {_id: `${principalId}::${update}::${self}`},
                {_id: `${principalId}::${create}::${facility}`},
            ]);
            break;

        case facility:
            mongoRes = await index.insert([
                {_id: `${principalId}::${read}::${elementId}`},
                {_id: `${principalId}::${update}::${elementId}`},
                {_id: `${principalId}::${destroy}::${elementId}`},

                {_id: `${principalId}::${produce}`},
            ]);
            break;
    }

    logger.info(mongoRes.result);
};
