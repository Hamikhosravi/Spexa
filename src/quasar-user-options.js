import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import { Notify, Loading } from "quasar";

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    notify: {},
    loading: {},
  },
  plugins: {
    Notify,
    Loading,
  },
};
