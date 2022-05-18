<template>
  <!-- 外层ul控制卡片范围 -->
  <div>
    <div class="floatBtn" :id="domid"
         :class="[{moveBtn: longClick}, `${btnType}Btn`]"
         @touchstart="touchstart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)"
    >
      <slot></slot>
    </div>
  </div>

</template>

<script>
export default {
  name: "index",
  props: {
    domid: {
      type: String,
      default: 'vsuspend'
    },
  },
  data() {
    return {
      timeOutEvent: 0,
      longClick: 0,
      // 手指原始位置
      oldMousePos: {},
      // 元素原始位置
      oldNodePos: {},
      btnType: 'right'
    };
  },
  methods: {
    touchstart(ev) {
      // 定时器控制长按时间，超过500毫秒开始进行拖拽
      this.timeOutEvent = setTimeout(() => {
        this.longClick = 1;
      }, 200);
      const selectDom = ev.currentTarget;
      const {pageX, pageY} = ev.touches[0]; // 手指位置
      const {offsetLeft, offsetTop} = selectDom; // 元素位置
      // 手指原始位置
      this.oldMousePos = {
        x: pageX,
        y: pageY
      };
      // 元素原始位置
      this.oldNodePos = {
        x: offsetLeft,
        y: offsetTop
      };
      selectDom.style.left = `${offsetLeft}px`;
      selectDom.style.top = `${offsetTop}px`;
    },
    touchMove(ev) {
      // 未达到500毫秒就移动则不触发长按，清空定时器
      clearTimeout(this.timeOutEvent);
      if (this.longClick === 1) {
        const selectDom = ev.currentTarget;
        // x轴偏移量
        const lefts = this.oldMousePos.x - this.oldNodePos.x;
        // y轴偏移量
        const tops = this.oldMousePos.y - this.oldNodePos.y;
        const {pageX, pageY} = ev.touches[0]; // 手指位置
        selectDom.style.left = `${pageX - lefts}px`;
        selectDom.style.top = `${pageY - tops}px`;
      }
    },
    touchEnd(ev) {
      // 清空定时器
      clearTimeout(this.timeOutEvent);
      if (this.longClick === 1) {
        this.longClick = 0;
        const selectDom = ev.currentTarget;
        const {clientWidth, clientHeight} = document.body;
        const {offsetLeft, offsetTop} = selectDom;
        let domwidth = selectDom.style.width || selectDom.clientWidth || selectDom.offsetWidth || selectDom.scrollWidth
        let domheight = selectDom.style.height || selectDom.clientHeight || selectDom.offsetHeight || selectDom.scrollHeight
        selectDom.style.left =
            (offsetLeft + domwidth / 2) > (clientWidth / 2) ?
                'calc(100% - ' + (domwidth / 2 * 3) + 'px)' : (domwidth / 2) + 'px';
        if (offsetTop < (domheight / 2)) {
          selectDom.style.top = domheight + 'px';
        } else if (offsetTop + domheight > clientHeight) {
          selectDom.style.top = `${clientHeight - domheight}px`;
        }
        this.btnType =
            (offsetLeft + domheight / 2) > (clientWidth / 2) ?
                'right' : 'left';
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@mixin notSelect {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}

@mixin not-touch {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.floatBtn {
  @include notSelect();
  @include not-touch();
  position: fixed;
  z-index: 1;
  left: calc(100% - 66px);
  top: calc(100% - 88px);
  overflow: hidden;
  width: 44px;
  height: 44px;
  //background: #F4F4F4;
  //box-shadow: 0 0 2px #ffffff;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  &.rightBtn {
    border-radius: 23px 23px 23px 23px;
  }

  &.leftBtn {
    border-radius: 23px 23px 23px 23px;
  }

  &.moveBtn {
    border-radius: 23px;
  }
}
</style>