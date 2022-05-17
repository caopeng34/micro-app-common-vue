import Vue from "vue";
import VueStorage from "vue-ls";
import pkg from "../../package";

// this.$ls_local
Vue.use(VueStorage, {
  namespace: `${pkg.name}_${pkg.version}_`,
  name: "ls_local",
  storage: "local"    // 存储名称: session, local, memory
});

// this.$ls_session
Vue.use(VueStorage, {
  namespace: `${pkg.name}_${pkg.version}_`,
  name: "ls_session",
  storage: "session"    // 存储名称: session, local, memory
});

export const ls_local = Vue.ls_local;

export const ls_session = Vue.ls_session;
