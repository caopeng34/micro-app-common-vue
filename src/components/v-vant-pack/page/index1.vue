<template>
<div class="v-vant-pack-page">
  <div class="v-vant-pack-page-1">
    <van-nav-bar
        :title="navbartitle"
        :left-text="navbarleft"
        :right-text="navbarright"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
  </div>
  <div :ref="pageareaid" class="v-vant-pack-page-2" :style="{backgroundColor: pagebackgroundColor}">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "index1",
  props: {
    // van-nav-bar标题
    navbartitle: {
      type: String,
      default: ''
    },
    // van-nav-bar返回
    navbarleft: {
      type: String,
      default: ''
    },
    // van-nav-bar按钮
    navbarright: {
      type: String,
      default: ''
    },
    // 内容区ref值
    pageareaid: {
      type: String,
      default: 'pageareaid'
    },
    // 内容区背景色
    pagebackgroundColor: {
      type: String,
      default: '#f4f4f4'
    }
  },
  methods: {
    onClickLeft() {
      this.$emit('navbarOnLeft')
    },
    onClickRight() {
      this.$emit('navbarOnRight')
    },
  }
}
</script>

<style scoped lang="less">
@import "index";

</style>