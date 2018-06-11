const {assert} = require('chai');
const {spawn} = require('child_process');
const {players: {bonner}, factories: {rdrn}, regions: {grasswall}} = require('@venture-api/fixtures');


let stair;
let tasu;
let mongo;
let mold;
let config;
let nats;
let stan;

describe('mold', () => {

    before(async function ()  {
        // stan = spawn('export GOPATH=$HOME/go && export PATH=$PATH:$GOPATH/bin && nats-streaming-server', ['-p', '4223', '-DV'], {shell: '/bin/bash'});
        // nats = spawn('export GOPATH=$HOME/go && export PATH=$PATH:$GOPATH/bin && gnatsd', ['-p', '4222', '-DV'], {shell: '/bin/bash'});
        const Mold = require('../mold');
        mold = await Mold([['region.create', grasswall]]);
        stair = mold.get('stair');
        tasu = mold.get('tasu');
        mongo = mold.get('mongo');
        config = mold.get('config');
    });

    after(async () => {
        console.log('> stopping test mold');
        tasu.close();
        stair.close();
        await Promise.all(Object.entries(config.databases).map(([k, name]) => {
            return mongo.db(name).dropDatabase();
        }));
        mongo.close();
        // console.log('> killing transports');
        // stan.kill('SIGINT');
        // nats.kill('SIGINT');
    });

    describe('initial module', () => {

        describe('feed', () => {

            it('feeds initial commands', async () => {
                const regions = mongo.db(config.databases.regions).collection('index');
                const grasswall = await regions.findOne({name: 'grasswall'});
                assert.equal(grasswall.name, 'grasswall');
                assert.equal(grasswall.defects.length, 1);
                assert.equal(grasswall.resourceTypes.length, 2);
            })
        });
    });

    describe('player subscribers', () => {

        it('handles player.register', (done) => {

            const {id, email, name} = bonner;
            stair.write('player.register', {id, email, name});
            tasu.subOnce(`${id}.player.registered`, async () => {
                const index = mongo.db(config.databases.players).collection('index');
                const newPlayer = await index.findOne({id});
                assert.equal(newPlayer.email, email);
                done();
            });
        })
    });

    describe('factory subscribers', () => {

        it('handles factory.create', (done) => {

            const {id, name, region} = rdrn;
            stair.write('factory.create', rdrn);
            tasu.subOnce(`${rdrn.ownerId}.factory.created`, async () => {
                const index = mongo.db(config.databases.factories).collection('index');
                const newFactory = await index.findOne({id});
                assert.equal(newFactory.name, name);
                assert.equal(newFactory.region, region);
                done();
            });

        })

    });

});

