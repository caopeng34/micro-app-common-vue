<template>
  <div class="vvantpackpagepicker">
    <van-field
        readonly
        clickable
        :name="pickerlabel"
        :value="choosevalue.value"
        :label="pickerlabel"
        placeholder="点击选择"
        @click="showPicker = true"
        :rules="rule1 ? [{ validator: rules_null , message: '请选择' }] : [{required: false}]"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
          show-toolbar
          value-key="value"
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import rules from "../../../mixins/fieldrules";

export default {
  name: "index",
  mixins: [rules],
  props: {
    // 名称
    pickerlabel: {
      type: String,
      default: ''
    },
    // 值
    pickervalue: {
      type: String,
      default: ''
    },
    // 值对应显示内容
    pickername: {
      type: String,
      default: ''
    },
    // 选项
    options: {
      type: Object,
      default: null
    },
    // 是否打开校验
    rule1: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      // 选中的项
      choosevalue: {
        key: '',
        value: ''
      },
      // picker组件
      columns: [],
      showPicker: false,
    };
  },
  watch: {
    pickervalue(nv) {
      this.updatechoose(nv)
    },
    choosevalue(nv) {
      this.$emit('update:pickervalue', nv.key)
      this.$emit('update:pickername', nv.value)
    },
    options(nv) {
      this.updatecolumns(nv)
    }
  },
  created() {
    // 更新选项
    this.updatecolumns(this.options)
    // 选中的值
    this.choosevalue.key = this.pickervalue || ''
    this.choosevalue.value = this.options && this.options[this.choosevalue.key] ? this.options[this.choosevalue.key] : ''
  },
  methods: {
    // 更新选项
    updatecolumns(nv) {
      this.columns = []
      for (const nvKey in nv) {
        this.columns.push({
          key: nvKey,
          value: nv[nvKey]
        })
      }
      setTimeout(()=> {
        // 刷新数据
        this.updatechoose(this.pickervalue)
      })
    },
    // 更新选中项显示
    updatechoose(nv) {
      this.choosevalue.key = nv || ''
      this.choosevalue.value = this.options && this.options[this.choosevalue.key] ? this.options[this.choosevalue.key] : ''
    },
    // 选中
    onConfirm(value) {
      this.choosevalue = value;
      this.showPicker = false;
      setTimeout(() => {
        this.$emit('pickerConfirm', value)
      })
    },
  },
}
</script>

<style scoped>
.vvantpackpagepicker {

}
</style>