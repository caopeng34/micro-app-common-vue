<template>
  <div class="v-vant-pack-page">
    <div class="v-vant-pack-page-1">
      <van-nav-bar
          :title="navbartitle"
          :left-text="navbarleft"
          left-arrow
          @click-left="onClickLeft"
      >
        <template #right v-if="isshowsx">
          <div class="v-vant-pack-page-filter">
            <van-dropdown-menu active-color="#1989fa">
              <van-dropdown-item get-container="body" title="筛选" ref="item">
                <slot name="slot-filter"></slot>
                <div class="v-vant-pack-page-filter-btn">
                  <van-button square block type="default" plain @click="resetClick">重置</van-button>
                  <van-button square block type="info" @click="confirmClick">确定</van-button>
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
        </template>
      </van-nav-bar>
    </div>
    <div class="v-vant-pack-page-3" :class="noticetext ? 'v-vant-pack-page-3_2' : ''">
      <van-notice-bar color="#999999" background="#ffffff"
                      left-icon="info-o" :scrollable="false"
                      :text="noticetext" @click="dialogshow = true"
      />
      <van-dialog v-model="dialogshow" title="信息">
        <slot name="slot-dialog"></slot>
      </van-dialog>
    </div>
    <div :id="pageareaid" class="v-vant-pack-page-2" :class="noticetext ? 'v-vant-pack-page-2_2' : ''"
         :style="{backgroundColor: pagebackgroundColor}">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100%;">
        <img v-show="(datalist.length === 0 && finished === true)" class="meiyougengduoimg"
             src="../../../assets/img/empty-image-default.png"/>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <div v-for="(item, index) in datalist" :key="item.id || index" style="width: 100%;">
            <slot name="slot-scope" v-bind="{row: item, index:index}"></slot>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <v-suspend v-if="isshowxz">
      <div class="suspendadd">
        <van-icon name="add" @click="additem"/>
      </div>
    </v-suspend>
  </div>
</template>

<script>
import VSuspend from "../../v-suspend";

export default {
  name: "index1",
  components: {VSuspend},
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
    // tab选中
    tabidx: {
      type: String,
      default: ''
    },
    // 接口
    calltabapi: {
      type: Function,
      default: null
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
    },
    // 接口
    callapi: {
      type: Function,
      default: null
    },
    // 数据
    datas: {
      type: Array,
      default: () => []
    },
    // 打开时触发查询标志
    openqueryflag: {
      type: Boolean,
      default: true
    },
    // 显示筛选按钮
    isshowsx: {
      type: Boolean,
      default: true
    },
    // 显示新增按钮
    isshowxz: {
      type: Boolean,
      default: true
    },
    // 消息提示内容
    noticetext: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      /* 数据 */
      datalist: [],                       // 数据
      pageNo: 0,                          // 第几页
      pageSize: 10,                       // 搜索条数
      total: 1,                           // 总条数
      /* 加载中 */
      refreshing: false,                  // 显示加载中刷新
      loading: false,                     // 显示加载中
      finished: true,                     // 控制上拉加载中
      /* dialog组件 */
      dialogshow: false,                  // 消息明细展示控制
    };
  },
  watch: {
    datas(nv) {
      this.datalist = nv
    },
    // 控制显示没有更多
    datalist(nv) {
      // console.log('-*->', this.datalist.length ,this.total)
      if (this.datalist.length >= this.total) {
        this.finished = true
      } else {
        this.finished = false
      }
      this.$emit("update:datas", nv);
    }
  },
  created() {
  },
  mounted() {
    if (this.openqueryflag) this.onSearch()
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$emit('navbarOnLeft')
    },
    // 条件重置
    resetClick() {
      this.$emit('dropdownReset')
    },
    // 条件确定
    confirmClick() {
      this.$refs.item.toggle();
      this.onSearch()
    },
    // 搜索
    onSearch() {
      this.datalist = []
      this.pageNo = 0
      this.loading = true
      this.query().then(() => {
        document.getElementById(this.pageareaid) && (document.getElementById(this.pageareaid).scrollTop = 0)
      })
    },
    onRefresh() {
      // console.log("刷新");
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    // 加载中
    onLoad() {
      // console.log("加载中");
      if (this.refreshing) {
        this.datalist = [];
        this.refreshing = false;
      }
      this.query();
    },
    // 查询
    query() {
      // 页码
      this.pageNo = Math.floor(this.datalist.length / this.pageSize); // 页码
      this.pageNo === 0 ? (this.datalist = []) : ''
      // console.log(this.pageNo)
      // 接口查询
      return this.callapi({
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false
        if (typeof res.code !== "number" || !Array.isArray(res.data) || typeof res.total !== "number") {
          console.log('出参结果不符合标准，标准结构：', [{code: 0, data: [], total: 0}])
          this.finished = true
          return false
        }
        // console.log(res)
        if (res.code === 0) {
          res.data.forEach(item => {
            this.datalist.push(item)
          })
        }
        this.total = res.total || 0
        if (this.total === 0) {
          this.finished = true
        }
        // console.log('-->', res)
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    additem() {
      this.$emit('addHandle')
    },
  }
}
</script>

<style lang="less">
@import "index";

</style>