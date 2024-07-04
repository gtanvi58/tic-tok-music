const routes = {
    home: '/',
    following: '/following',
    profile: '/@:nickname',
    upload: '/upload',
    search: '/search',
    live: '/live',
    music: '/music',
    magicTiles: (id) => `/magic-tiles/${id}`,
    // magicTilesNew: (id) => `/magic-tiles-new/${id}`,
};

export default routes;
