module.exports = (kojo) => {

    const tasu = kojo.get('tasu');
    const player = kojo.module('player');

    tasu.listen('player.identify', async ({email}) => {
        return await player.identify({email});
    });
};
