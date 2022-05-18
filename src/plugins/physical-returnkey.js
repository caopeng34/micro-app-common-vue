// 浏览器的物理返回键方法（注意：不要多个页面交叉调用否则返回混乱）

let componentobj = null // 组件对象（注意：对象中必须有back()方法）

export default {
    // 进入组件页面调用（beforeRouteEnter方法下）
    componentStart(val){
        // 存储组件对象
        componentobj = val
        // 设置监听浏览器物理返回
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
            window.addEventListener('popstate', this.callcomponentback, false) // false阻止默认事件
        }
    },
    // 离开组件页面调用（beforeRouteLeave方法下）
    componentEnd(){
        // 移除监听浏览器物理返回
        window.removeEventListener('popstate', this.callcomponentback, false)// false阻止默认事件
    },
    // 调用组件自己的返回方法
    callcomponentback(){
        if (componentobj.returnroute) {     // 物理返回键调用页面back方法
            componentobj.back()
        } else {                            // 关闭物理返回键
            window.history.pushState('forward', null, null)
            window.history.forward(1)
        }
    }
}
