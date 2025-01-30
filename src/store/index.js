import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Dummy state
const store = new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++;
        },
        decrement(state) {
            state.count--;
        },
    },
    actions: {
        increment({ commit }) {
            commit('increment');
        },
        decrement({ commit }) {
            commit('decrement');
        },
    },
    getters: {
        count: (state) => state.count,
    },
});

export default store;
