const {assert} = require('chai');
const {bonner} = require('@venture-api/fixtures/fixtures/player');
const {rdrn} = require('@venture-api/fixtures/fixtures/facility');
const {grasswall} = require('@venture-api/fixtures/fixtures/region');
const {region, player, facility} = require('@venture-api/fixtures/dictionary');


let stair;
let tasu;
let mongo;
let mold;
let config;

describe('mold', () => {

    before(async function ()  {
        const Mold = require('../mold');
        mold = await Mold([['createRegion', grasswall]]);
        stair = mold.get('stair');
        tasu = mold.get('tasu');
        mongo = mold.get('mongo');
        config = mold.get('config');
    });

    after(async () => {
        console.log('> stopping test mold');
        tasu.close();
        stair.close();
        await Promise.all(['acl', region, player, facility].map((name) => {
            console.log('> dropping db', name);
            return mongo.db(name).dropDatabase();
        }));
        mongo.close();
    });

    describe('initial module', () => {

        describe('feed', () => {

            it('feeds initial commands', async () => {
                const regions = mongo.db(region).collection('index');
                const grasswall = await regions.findOne({name: 'grasswall'});
                assert.equal(grasswall.name, 'grasswall');
                assert.equal(grasswall.defects.length, 1);
                assert.equal(grasswall.resourceTypes.length, 2);
            })
        });
    });

    describe('player subscribers', () => {

        it('handles registerPlayer', (done) => {

            const {id, email, name} = bonner;
            stair.write('registerPlayer', {id, email, name});
            tasu.subOnce(`${id}.playerRegistered`, async () => {
                const index = mongo.db(player).collection('index');
                const newPlayer = await index.findOne({id});
                assert.equal(newPlayer.email, email);
                done();
            });
        })
    });

    describe('facility subscribers', () => {

        it('handles createFacility', (done) => {

            const {id, name, region} = rdrn;
            stair.write('createFacility', rdrn);
            tasu.subOnce(`${rdrn.ownerId}.facilityCreated`, async () => {
                const index = mongo.db(facility).collection('index');
                const newFactory = await index.findOne({id});
                assert.equal(newFactory.name, name);
                assert.equal(newFactory.region, region);
                done();
            });

        })

    });

});

