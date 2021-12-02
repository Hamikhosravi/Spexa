const general = {
  namespaced: true,
  state: {
    isLoading: false,
  },
  getters: {
    isLoading: (state) => {
      return state.isLoading;
    },
  },
  mutations: {
    Set_IsLoading(state, payload) {
      state.isLoading = payload;
    },
  },
};

export default general;
