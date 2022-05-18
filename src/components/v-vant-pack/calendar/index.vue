<template>
  <div class="vvantpackpagecalendar">
    <van-field
        v-model="dateval" :name="calendarname" :label="calendarlabel" is-link readonly
        placeholder="请选择" @click="show = true"
        :rules="rule1 ? [{ validator: rules_null , message: '请选择' }] : [{required: false}]"
    />
    <van-calendar v-model="show" type="range" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm"
                  color="#1989fa"/>
  </div>
</template>

<script>
import rules from "../../../mixins/fieldrules";

export default {
  name: "index",
  mixins: [rules],
  props: {
    // 日期label
    calendarlabel: {
      type: String,
      default: '选择日期区间'
    },
    // 日期name
    calendarname: {
      type: String,
      default: 'calendar'
    },
    // 是否打开校验
    rule1: {
      type: Boolean,
      default: true
    },
    // 日期区间值（数组中是日期类型的值）
    vdates: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
      dateval: '',        // 显示内容
      // calendar组件
      show: false,        // 显示日期组件
      minDate: new Date(new Date().getFullYear() - 1, 0, 1),
      maxDate: new Date(new Date().getFullYear() + 1, 11, 31),
    }
  },
  watch: {
    vdates(nv) {
      if (Array.isArray(nv) && nv.length) {
        this.fieldinfo(nv)
      } else {
        this.dateval = ''
      }
    },
  },
  created() {
    Array.isArray(this.vdates) && this.vdates.length && this.fieldinfo(this.vdates)
  },
  methods: {
    // field显示内容
    fieldinfo(date) {
      const [start, end] = date;
      this.dateval = `${this.formatDate(start)} - ${this.formatDate(end)}`;
    },
    // 选择好日期
    onConfirm(date) {
      Array.isArray(date) && date.length && this.fieldinfo(date)
      this.show = false;
      const [startdate, enddate] = date;
      let dates = []
      dates.push(new Date(startdate.getFullYear(),startdate.getMonth() + 1,startdate.getDate(),0,0,0))
      dates.push(new Date(enddate.getFullYear(),enddate.getMonth() + 1,enddate.getDate(),23,59,59))
      this.$emit("update:vdates", dates)
    },
    // 日期转字符串
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
  }
}
</script>

<style scoped>
.vvantpackpagecalendar {

}
</style>