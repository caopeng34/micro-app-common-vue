import Vue from "vue";
import VueStorage from "vue-ls";
import pkg from "../../package";

// this.$ls
Vue.use(VueStorage, {
  namespace: `${pkg.name}_${pkg.version}_`,
  name: "ls",
  storage: "local"    // 存储名称: session, local, memory
});

export const ls = Vue.ls;