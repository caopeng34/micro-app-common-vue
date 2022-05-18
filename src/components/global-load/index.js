import Vue from "vue";
import GLoad from "./GLoad";

const obj = {}

obj.install = (Vue) => {
    // 创建组件构造器
    const gloadContrustor = Vue.extend(GLoad)
    // 通过new的方式，用组件构造器创造一个组件对象
    const gload = new gloadContrustor()
    // 将组件对象挂载到div元素上
    gload.$mount(document.createElement('div'))
    // 将div元素挂在到页面
    document.body.append(gload.$el)
    // 将组件对象挂载到Vue全局方法
    Vue.prototype.$gload = gload
}
export default obj