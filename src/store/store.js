const fileManagement = {
  namespaced: true,
  state: {
    directoryInfo: [],
    userInfo: {},
    email: null,
  },
  getters: {
    directoryInfo: (state) => {
      return state.directoryInfo;
    },
    userInfo: (state) => {
      return state.userInfo;
    },
    email: (state) => {
      return state.email;
    },
  },
  mutations: {
    set_DirectoryInfo(state, directoryInfo) {
      state.directoryInfo = directoryInfo;
    },
    set_UserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    set_Email(state, email) {
      state.email = email;
    },
  },
  actions: {
    set_DirectoryInfo(context, directoryInfo) {
      context.commit("set_DirectoryInfo", directoryInfo);
    },
    set_UserInfo(context, userInfo) {
      context.commit("set_UserInfo", userInfo);
    },
    set_Email(context, email) {
      context.commit("set_Email", email);
    },

  },
};

export default fileManagement;
