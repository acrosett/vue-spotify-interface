export const state = () => ({
    list: []
})

export const mutations = {
    addArtist(state, artist) {
        if (state.list.filter(item => item.id == artist.id).length == 0) {
            state.list.push(artist);
        }
        if (state.list.length > 5) {
            state.list.shift();
        }
    },
    removeArtist(state, artist) {
        state.list = state.list.filter(item => item !== artist);
    }

}