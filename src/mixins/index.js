import Vue from "vue";
// 物理返回键控制设置
import wlfhjset from '../plugins/physical-returnkey'

Vue.mixin({
    data() {
        return {
            currentroute: '',   // 当前路由
            returnroute: '',    // 返回路由
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 当前页面路由名
            vm.currentroute = to.name
            // 物理返回键设置
            wlfhjset.componentStart(vm);
        });
    },
    beforeRouteLeave(to, from, next) {
        // 物理返回键解除设置
        wlfhjset.componentEnd();
        next();
    },
    methods: {
        // 公共返回方法
        back() {
            this.$router.push({name: this.returnroute})
        },
    }
});
