<!--          <v-vant-uploader-->
<!--              vname="kky643"-->
<!--              vlabel="试剂结果照片"-->
<!--              :vfastdfsurl="fastdfsurl"-->
<!--              :vfastdfsimg="personobj.kky643"-->
<!--              :uploaderapi="fileupload"-->
<!--              :deleteapi="filedelete"-->
<!--          />-->
<template>
  <div class="vvantpackuploader">
    <van-field :name="vname" :label="vlabel">
      <template #input>
        <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            :before-delete="deleteFile"
            :max-count="maxCount"
        />
      </template>
    </van-field>
  </div>
</template>

<script>
import imgHandle from "./imgCompress"

export default {
  name: "index",
  props: {
    vname: {
      type: String,
      default: 'vuploader'
    },
    vlabel: {
      type: String,
      default: '文件上传'
    },
    // fastdfsurl（例如：https://service.neuqsoft.com/medical/py/）
    vfastdfsurl: {
      type: String,
      default: ''
    },
    // 图片url（例如：group1/M00/03/93/rB4KFWJiVL-AGaUsAAHYu9bSUks922.png）
    vfastdfsimg: {
      type: String,
      default: ''
    },
    uploaderapi: {
      type: Function,
      default: null
    },
    deleteapi: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      fileList: [],   // 文件
      maxCount: 1,    // 限制文件数量
    }
  },
  watch: {
    vfastdfsimg(nv) {
      this.initimg(nv)
    },
    fileList(nv) {
      if (nv && nv.length) {
        this.emitimg(nv[0].path)
      } else {
        this.emitimg('')
      }
    },
  },
  methods: {
    // 初始化图片
    initimg(val) {
      this.fileList = []
      let file = {
        path: val,
        url: this.vfastdfsurl + val,
        status: 'done',
        message: ''
      }
      this.fileList.unshift(file)
    },
    // 更新父级组件
    emitimg(val) {
      this.$emit("update:vfastdfsimg", val)
    },
    // 上传文件
    afterRead(file) {
      if (!file || !file.file) {
        return false
      }
      file.status = "uploading";
      file.message = "上传中...";
      imgHandle(file.file).then(newfile => {
        this.uploaderapi(newfile).then(res => {
          if (res.code === 0) {
            file.url = res.data.fullpath;
            file.path = res.data.path;
            file.status = "done";
            file.message = "上传成功";
          } else {
            file.status = "failed";
            file.message = "上传失败";
            this.showvtoast(res.msg)
          }
        })
      })
    },
    // 删除文件
    deleteFile(file, info) {
      if (!file || file.status !== "done" || !file.path) {
        return false
      }
      file.message = "删除中";
      file.status = "uploading";
      this.deleteapi(file.path).then(res => {
        if (res.code === 0) {
          this.fileList.splice(info.index, 1);
        } else {
          file.status = "done";
          file.message = "";
          this.showvtoast(res.msg)
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import "./index";
</style>