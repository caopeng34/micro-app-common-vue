<template>
  <van-notice-bar color="#E6A23C" background="#FDF6EC"
                  left-icon="volume-o" :scrollable="false" wrapable
                  :text="text"
  />
</template>

<script>
export default {
  name: "index",
  props: {
    // 内容
    text: {
      type: String,
      default: ''
    },
  },
}
</script>

<style scoped>

</style>