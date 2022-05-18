<template>
  <div class="div0 div1" v-show="loadshow > 0">
    <div class="div2">
      <div class="vloadingindex">
        <div class="v_loading">{{ hintinfo || "努力加载中" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gload",
  components: {},
  watch: {
  },
  data() {
    return {
      loadshow: 0,    // 显示控制
      hintinfo: '',   // 显示内容
    };
  },
  created() {
  },
  mounted() {

  },
  methods: {
    // 显示动画
    showanimation() {
      let loading = document.querySelector(".v_loading");
      let letters = (this.hintinfo || '努力加载中').split("");
      loading.textContent = "";
      letters.forEach((letter, i) => {
        let span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${i / 10}s`;
        loading.append(span);
      });
    },
    // 显示组件
    async show(vparam = '') {
      return new Promise(resolve => {
        this.loadshow += 1
        let showflag = (this.loadshow === 1) || (this.hintinfo === vparam)
        this.hintinfo = vparam
        setTimeout(() => {  // 延时，等页面刷新后再执行
          showflag && this.showanimation()
          resolve()
        })
      })
    },
    // 关闭组件
    async close() {
      return new Promise(resolve => {
        this.loadshow -= 1
        this.loadshow < 0 && (this.loadshow = 0)
        resolve()
      })
    },
    // 调用组件
    async gload(vparam = '') {
      if (typeof vparam === 'boolean' || typeof vparam === 'number') {
        if (vparam) {     // true  或 大于0
          await this.show(null)   // 显示组件
        } else {          // false 或 0
          await this.close()              // 关闭组件
        }
      } else if (typeof vparam === 'string') {
        await this.show(vparam)           // 显示组件
      } else {
        await this.show(null)     // 显示组件
      }
    }
  }
}
</script>

<style>
.vloadingindex .v_loading {
  display: flex;
  color: #666666;
  font-size: 0.48rem;
  font-family: Lato, sans-serif;
  letter-spacing: 0.16rem;
  text-transform: uppercase;
}

.vloadingindex .v_loading span {
  animation: shrink 2s infinite;
}

@keyframes shrink {
  50% {
    transform: scale(0);
  }
}
</style>

<style scoped>
.div0 {
  width: 0px;
  height: 0px;
  overflow: hidden;
}

.div1 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 990;
  /*background: rgba(0, 0, 0, 0);*/
  background: #f4f4f4;
  opacity: 0.9;
}

.div2 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>