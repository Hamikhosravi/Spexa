import { createStore, createLogger } from "vuex";
import general from "./general";
import fileManagement from "./store"

export const store = createStore({
  plugins: [createLogger()],
  modules: {
    fileManagement,
    general,
  },
});
