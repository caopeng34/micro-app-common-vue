<!-- 这个图片剪裁插件，兼容ios与安卓 -->
<!--              <v-vant-imgclip-->
<!--                  :vfastdfsurl="fastdfsurl"-->
<!--                  :vfastdfsimg.sync="personobj.kky643"-->
<!--                  :uploaderapi="fileupload"-->
<!--                  :deleteapi="filedelete"-->
<!--              />-->
<template>
  <div>
    <van-uploader
        v-model="fileList"
        accept="image/*"
        :deletable="vdeletable"
        :disabled="vdisabled"
        :after-read="afterRead"
        :before-delete="deleteFile"
        :max-count="maxCount"
    />
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import imgHandle from "./imgCompress";

export default {
  props: {
    // 定义的宽高比
    widthRate: {
      type: Number,
      default: 1,
    },
    // 定义的宽高比
    heightRate: {
      type: Number,
      default: 1
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
    },
    vdeletable: {
      type: Boolean,
      default: true
    },
    vdisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      fileList: [],   // 文件
      maxCount: 1,    // 限制文件数量
      vanfile: null,  // 上传文件
      originUrl: '',  // 上传文件转url
      cropper: null,  // 裁剪对象
      reagion: null,  // 裁剪父级DIV的DOM
      preview: null,  // 预览裁剪中图片DOM
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
      if (val) {
        let file = {
          path: val,
          url: this.vfastdfsurl + val,
          status: 'done',
          message: ''
        }
        this.fileList.unshift(file)
      }
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
      this.vanfile = file
      this.clipHandle({
        file: file.file,
        autoCropArea: 0.8,
        aspectWithRatio: Number(this.widthRate) || 1,
        aspectHeightRatio: Number(this.heightRate) || 1
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
    // 调用裁剪方法
    clipHandle(opt) {
      try {
        // 创建裁剪DOM
        this.createElement(opt.file);
        // 创建裁剪对象
        this.initCropper(opt)
        // 调用方法转成url格式
        this.originUrl = this.getObjectURL(opt.file);
        // 裁剪组件显示裁剪图片
        if (this.cropper) {
          this.cropper.replace(this.originUrl);
        }
      } catch (e) {
        console.log(e)
        if (this.cropper) { // 关闭裁剪
          this.destoried()
        }
      }
    },
    // 创建一些必要的DOM，用于图片裁剪
    createElement(file) {
      let self = this;
      // 初始化图片为空对象
      this.preview = null;
      let str = '<div><img id="clip_image" src="originUrl"></div><button type="button" id="cancel_clip">取消</button><button type="button" id="clip_button">确定</button>';
      str += '<div class="crop_loading"><div class="crop_content"><div class="crop_text">图片处理中...</div></div></div>';
      str += '</div>';
      let body = document.getElementsByTagName('body')[0];
      this.reagion = document.createElement('div');
      this.reagion.id = 'clip_container';
      this.reagion.className = 'container';
      this.reagion.innerHTML = str;
      // 添加创建好的DOM元素
      body.appendChild(this.reagion);
      this.preview = document.getElementById('clip_image');
      // 绑定一些方法
      this.clickBtn = document.getElementById('clip_button');
      this.cancelBtn = document.getElementById('cancel_clip');
      // 绑定确定事件
      this.addEvent(this.clickBtn, 'click', function () {
        let imgName = file.name     // 文件名
        let imgType = file.type     // 文件类型
        self.crop(imgName, imgType);
      })
      // 绑定取消事件
      this.addEvent(this.cancelBtn, 'click', function () {
        self.cancelcrop();
      })
    },
    // 创建裁剪对象
    initCropper(opt) {
      // 初始化裁剪对象
      this.cropper = new Cropper(this.preview, {
        aspectRatio: opt.aspectWithRatio / opt.aspectHeightRatio || 1,
        autoCropArea: opt.autoCropArea || 0.8,
        viewMode: 2,
        guides: true,
        cropBoxResizable: true,         // 是否通过拖动来调整剪裁框的大小
        cropBoxMovable: true,           // 是否通过拖拽来移动剪裁框。
        dragCrop: false,
        dragMode: "move",               // ‘crop’: 可以产生一个新的裁剪框  ‘move’: 只可以移动  ‘none’: 什么也不处理
        center: true,
        zoomable: true,                 // 是否允许放大图像。
        zoomOnTouch: true,              // 是否可以通过拖动触摸来放大图像。
        scalable: true,
        background: false,
        checkOrientation: true,
        checkCrossOrigin: true,
        zoomOnWheel: false,
        toggleDragModeOnDblclick: false,
        ready: function () {
        }
      });
    },
    // 点击确定进行裁剪
    crop(imgName, imgType) {
      let self = this;
      let image = new Image();
      let croppedCanvas;
      let roundedCanvas;
      // 显示修剪中
      document.querySelector('.crop_loading').style.display = 'block';
      setTimeout(function () {
        croppedCanvas = self.cropper.getCroppedCanvas();
        roundedCanvas = self.getRoundedCanvas(croppedCanvas);
        let imgData = roundedCanvas.toDataURL();
        image.src = imgData;
        // 判断图片是否大于100k，不大于直接上传，反之压缩
        if (imgData.length < (100 * 1024)) {
          // 图片上传
          self.postImg(imgData, imgName, imgType);
        } else {
          image.onload = function () {
            // 压缩处理
            let data = self.compress(image);
            // 图片上传
            self.postImg(data, imgName, imgType);
          }
        }
      }, 20)
    },
    // 获取裁剪图片资源
    getRoundedCanvas(sourceCanvas) {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let width = sourceCanvas.width;
      let height = sourceCanvas.height;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      context.rect(0, 0, width, height);
      context.fill();
      return canvas;
    },
    // 取消裁剪
    cancelcrop() {
      this.fileList = []
      this.vanfile = null
      this.destoried();
    },
    // 销毁原来的对象
    destoried() {
      //移除事件
      this.removeEvent(this.clickBtn, 'click', null);
      this.removeEvent(this.cancelBtn, 'click', null);
      // 移除裁剪框
      this.reagion.parentNode.removeChild(this.reagion);
      // 销毁裁剪对象
      this.cropper.destroy();
      this.cropper = null;
    },
    // 图片转码方法
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // 图片上传
    postImg(imageData, imgName, imgType) {
      // 图片URL转File
      let newfile = this.dataURLToFile(imageData, imgName, imgType)
      // 关闭裁剪
      this.destoried()
      // 上传
      this.vanfile.status = "uploading";
      this.vanfile.message = "上传中...";
      this.uploaderapi(newfile).then(res => {
        if (res.code === 0) {
          this.vanfile.url = res.data.fullpath;
          this.vanfile.path = res.data.path;
          this.vanfile.status = "done";
          this.vanfile.message = "上传成功";
          this.initimg(res.data.path)
        } else {
          this.vanfile.status = "failed";
          this.vanfile.message = "上传失败";
          this.showvtoast(res.msg)
        }
      })
    },
    // 图片压缩
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      // 瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.3);
      // let ndata = canvas.toDataURL('image/png', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    // 转为file文件
    dataURLToFile(dataURL, imgName, imgType) {
      // eslint-disable-next-line one-var
      let arr = dataURL.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let newblob = new Blob([u8arr], {type: mime})
      let newfile = new File([newblob], imgName, {type: imgType, lastModified: Date.now()})
      return newfile
    },
    // 添加事件
    addEvent(obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
      } else {
        obj.attachEvent('on' + type, fn);
      }
    },
    // 移除事件
    removeEvent(obj, type, fn) {
      if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);
      } else {
        obj.detachEvent('on' + type, fn);
      }
    },
  }
}
</script>
<style scoped>
.vue-box {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0.4rem;
}

.vue-box .file {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 0;
  left: 0;
  z-index: 99;
  cursor: pointer;
}

img {
  display: none;
  width: 100%;
  height: 100%;
}
</style>
<style>
#clip_button {
  position: absolute;
  right: 10%;
  bottom: 30px;
  width: 66px;
  height: 32px;
  border: none;
  border-radius: 2px;
  background: #1AAD19;
  color: #fff;
  font-size: 14px;
}

#cancel_clip {
  position: absolute;
  left: 10%;
  bottom: 30px;
  width: 66px;
  height: 32px;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
  background: #E64340;
}

#clip_container.container {
  z-index: 99999;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
}

#clip_container.container > div {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#clip_image {
  max-width: 100%;
}

.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}

.crop_loading {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.crop_loading .crop_content {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  background: #000;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
}

.crop_loading .crop_content .crop_text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: .5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;
  display: block;
  opacity: .5;
  border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: .75
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: .1;
}

.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}

.cropper-line {
  background-color: #39f
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}

.cropper-point {
  width: 5px;
  height: 5px;
  opacity: .75;
  background-color: #39f
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}

@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}

@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMzTjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>