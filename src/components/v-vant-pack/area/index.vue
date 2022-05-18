<template>
  <div class="vvantpackpagearea">
    <van-field
        v-model="fieldValue" :name="arealabel" :label="arealabel" is-link readonly
        placeholder="请选择" @click="show = true" type="textarea" autosize
        :rules="rule1 ? [{ validator: rules_null , message: '请选择区划' }] : [{required: false}]"
    />
    <van-field
        v-model.trim="vaddress" clearable rows="2" type="textarea" autosize maxlength="200"
        :name="addresslabel" :label="addresslabel" placeholder="请输入门牌号，如：XX小区XX号楼XX单元XX号"
        :rules="rule2 ? [{ validator: rules_null , message: '请输入详细地址' }] : [{required: false}]"
    />
    <van-popup v-model="show" round position="bottom">
      <div class="cascaderheader">
        <div class="cascaderheader-1" @click="chongzhi">
          重置
        </div>
        <div class="cascaderheader-2">
          请选择
        </div>
        <div class="cascaderheader-1" @click="show = false">
          关闭
        </div>
      </div>
      <van-cascader
          active-color="#1989fa"
          v-model="cascaderValue"
          :show-header="false"
          :closeable="false"
          :options="options"
          @change="onChange"
          @finish="onFinish"
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
    // 区划label
    arealabel: {
      type: String,
      default: ''
    },
    // 地址label
    addresslabel: {
      type: String,
      default: ''
    },
    // 区划代码
    areacode: {
      type: String,
      default: ''
    },
    // 区划省
    areaname1: {
      type: String,
      default: ''
    },
    // 区划市
    areaname2: {
      type: String,
      default: ''
    },
    // 区划区（县）
    areaname3: {
      type: String,
      default: ''
    },
    // 区划街道（乡镇）
    areaname4: {
      type: String,
      default: ''
    },
    // 区划社区（村）
    areaname5: {
      type: String,
      default: ''
    },
    // 详细地址
    address: {
      type: String,
      default: ''
    },
    // 接口
    callapi: {
      type: Function,
      default: null
    },
    // 是否打开校验
    rule1: {
      type: Boolean,
      default: true
    },
    // 是否打开校验
    rule2: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      vareacode: this.areacode,       // 区划代码
      vareaname1: this.areaname1,     // 区划省
      vareaname2: this.areaname2,     // 区划市
      vareaname3: this.areaname3,     // 区划区（县）
      vareaname4: this.areaname4,     // 区划街道（乡镇）
      vareaname5: this.areaname5,     // 区划社区（村）
      vaddress: this.address,         // 详细地址
      // 组件
      show: false,                    // 区划组件显示
      fieldValue: '',                 // 区划组件显示内容
      cascaderValue: '',              // 区划代码
      options: [],                    // 区划数据
    }
  },
  watch: {
    areacode(nv, ov) {
      this.vareacode = nv
      // 更新区划时需要更新
      setTimeout(() => {
        this.init()
      })
    },
    vareacode(nv, ov) {
      this.$emit('update:areacode', nv)
    },
    areaname1(nv, ov) {
      this.vareaname1 = nv
    },
    vareaname1(nv, ov) {
      this.$emit('update:areaname1', nv)
    },
    areaname2(nv, ov) {
      this.vareaname2 = nv
    },
    vareaname2(nv, ov) {
      this.$emit('update:areaname2', nv)
    },
    areaname3(nv, ov) {
      this.vareaname3 = nv
    },
    vareaname3(nv, ov) {
      this.$emit('update:areaname3', nv)
    },
    areaname4(nv, ov) {
      this.vareaname4 = nv
    },
    vareaname4(nv, ov) {
      this.$emit('update:areaname4', nv)
    },
    areaname5(nv, ov) {
      this.vareaname5 = nv
    },
    vareaname5(nv, ov) {
      this.$emit('update:areaname5', nv)
    },
    address(nv, ov) {
      this.vaddress = nv
    },
    vaddress(nv, ov) {
      this.$emit('update:address', nv)
    },
  },
  mounted() {
    setTimeout(() => {
      (!this.areacode) && this.init()
    })
  },
  methods: {
    onChange(val) {
      // console.log(val)
      if (val.selectedOptions && val.selectedOptions.length < 5) {
        this.getarea(val.value, true)
      }
    },
    onFinish({selectedOptions}) {
      // console.log(selectedOptions, selectedOptions[selectedOptions.length - 1].text)
      this.show = false;
      // this.fieldValue = selectedOptions.map((option) => option.text).join('/');
      if (selectedOptions && selectedOptions.length > 0) {
        this.vareacode = selectedOptions[selectedOptions.length - 1].value
        this.vareaname1 = selectedOptions.length > 0 ? selectedOptions[0].text : ''
        this.vareaname2 = selectedOptions.length > 1 ? selectedOptions[1].text : ''
        this.vareaname3 = selectedOptions.length > 2 ? selectedOptions[2].text : ''
        this.vareaname4 = selectedOptions.length > 3 ? selectedOptions[3].text : ''
        this.vareaname5 = selectedOptions.length > 4 ? selectedOptions[4].text : ''
      }
      this.scqhmc()
    },
    // 生成fieldValue字段值
    scqhmc() {
      let areas = []
      this.vareaname1 ? areas.push(this.vareaname1) : ''
      this.vareaname2 ? areas.push(this.vareaname2) : ''
      this.vareaname3 ? areas.push(this.vareaname3) : ''
      this.vareaname4 ? areas.push(this.vareaname4) : ''
      this.vareaname5 ? areas.push(this.vareaname5) : ''
      this.cascaderValue = this.vareacode
      this.fieldValue = areas.length > 0 ? areas.map((option) => option).join('/') : ''
    },
    // 重置
    chongzhi() {
      this.vareacode = ''
      this.vareaname1 = ''
      this.vareaname2 = ''
      this.vareaname3 = ''
      this.vareaname4 = ''
      this.vareaname5 = ''
      this.cascaderValue = ''
      this.fieldValue = ''
      this.show = false
    },
    // 有初始区划时处理
    async init() {
      // 初始化
      this.options = []
      // 已选择区划
      let vareano = this.areacode ? this.areacode : '000000000000000'
      // 区划码拆分出各级
      let re_eighteen = /^(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{3})$/;
      let arr_data = vareano.match(re_eighteen);
      let code1 = arr_data[1]
      let code2 = arr_data[2]
      let code3 = arr_data[3]
      let code4 = arr_data[4]
      let code5 = arr_data[5]
      let code6 = arr_data[6]
      // 区划数组
      let areas = ['000000000000000']
      // 计算区划数组
      if (code1 !== '00') { // 省
        areas.push(code1 + '0000000000000')
      }
      if (code2 !== '00') { // 市
        areas.push(code1 + code2 + '00000000000')
      }
      if (code3 !== '00') { // 区
        areas.push(code1 + code2 + code3 + '000000000')
      }
      if (code4 !== '000') { // 乡
        areas.push(code1 + code2 + code3 + code4 + '000000')
      }
      if (code5 !== '000') { // 村
        areas.push(code1 + code2 + code3 + code4 + code5 + '000')
      }
      // 移除最后一个需要查询的
      if (areas.length > 1) {
        areas.pop()
      }
      // 初始化options
      for (let i in areas) {
        await this.getarea(areas[i], false)
      }
      // 生成fieldValue字段值
      this.scqhmc()
    },
    // 查询区划
    async getarea(vcode, vdisableload = false) {
      return new Promise(resolve => {
        // 获取区划数据
        this.callapi({
          parentno: vcode,
          disableload: vdisableload
        }).then(res => {
          if (typeof res.code !== "number" || !Array.isArray(res.data)) {
            console.log('出参结果不符合标准，标准结构：', [{code: 0, data: []}], '当前数据：', res)
            return false
          }
          if (res.code === 0) {
            let restmp = []
            res.data.forEach(item => {
              restmp.push(item)
            })
            // 追加数据
            this.addoptions(vcode, restmp, this.options)
            resolve(restmp)
          } else {
            resolve(false)
          }
        }).catch(() => {
          resolve(false)
        })
      })
    },
    // options追加数据
    addoptions(pid, datas, voptions) {
      if (pid === '000000000000000') {
        datas.forEach(item => {
          voptions.push(item)
        })
      } else {
        for (let i in voptions) {
          if (voptions[i].value === pid) {
            voptions[i].children = []
            datas.forEach(item => {
              voptions[i].children.push(item)
            })
          } else {
            if (voptions[i].children && voptions[i].children.length > 0) {
              this.addoptions(pid, datas, voptions[i].children)
            }
          }
        }
      }
    },
  }
}
</script>
<style>
.vvantpackpagearea .van-cascader__header {
  height: 0 !important;
}
</style>
<style scoped lang="less">
.cascaderheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;

  .cascaderheader-1 {
    margin: 0 16px;
    font-size: 14px;
    color: #999999;
  }

  .cascaderheader-2 {
    font-size: 16px;
    color: #333333;
  }
}
</style>