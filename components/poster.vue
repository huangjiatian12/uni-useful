<template>
  <view @tap.stop="hideModal">
    <canvas
      class="poster"
      canvas-id="poster"
      :width="width * 4"
      :height="height * 4"
      :style="{ width: `${width}px`, height: `${height}px` }"
    ></canvas>
    <view class="img_modal" @touchmove.stop.prevent>
      <view class="img_box" v-if="showImg">
        <span
          class="iconfont iconshanchuguanbicha close"
          @tap.stop="hideModal"
        ></span>
        <image
          mode="widthFix"
          :show-menu-by-longpress="true"
          :src="posterImg"
        />
        <view class="save_btn" @tap.stop="savePoster" v-if="showBtn">
          <span class="iconfont iconxiazai iconstyle"></span> 保存至本地
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { showLoading, showModal, showToast } from "../utils";
export default {
  props: {
    poster: {
      type: String,
    },
    options: {
      default: [],
      type: Array,
    },
    getPoster: {
      type: Function,
    },
    hide: {
      type: Function,
    },
    width: {
      default: 375,
      type: Number,
    },
    height: {
      default: 667,
      type: Number,
    },
    posterstate: {
      default: false,
      type: Boolean,
    },
  },
  components: {},
  data() {
    return {
      showImg: false,
      posterImg: "",
      showBtn: false,
      scale: 4,
    };
  },
  onReady() {
    this.showImg = this.posterstate;
    if (this.poster) {
      this.posterImg = this.poster;
      this.showImg = true;
      this.showBtn = true;
    } else {
      this.downloadPoster();
    }
  },
  methods: {
    // * 下载图片
    downPic(url, index) {
      // let us = uni.getStorageSync("userInfo");
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url,
          // header: {
          //   "X-AUTH": us.token,
          // },
          success: (res) => {
            let code = res.statusCode;
            switch (code) {
              case 200:
                resolve({ file: res.tempFilePath, index });
                break;
              default:
                reject({ code: code });
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    downloadPoster() {
      showLoading("海报下载中");
      let t = this,
        options = t.options,
        promises = [];
      t.showImg = true;
      options.map((option, index) => {
        if (option.url) {
          promises.push(t.downPic(option.url, index));
        }
      });
      Promise.all(promises)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            let item = res[i],
              { index, file } = item;
            options[index].url = file;
          }
          t.drawPoster(options);
        })
        .catch((err) => {
          console.log(err.errMsg, "errr");
          showToast({ str: "海报生成出了点小问题" });
          uni.hideLoading();
        });
    },
    roundedRectangle(ctx, x, y, width, height, r, color) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.fillStyle = color; //矩形填充颜色
      ctx.lineTo(x + width - r, y);
      ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      ctx.lineTo(x + width, y + height - r);
      ctx.arc(x + width - r, y + height - r, r, 0, Math.PI * 0.5);
      ctx.lineTo(x + r, y + height);
      ctx.arc(x + r, y + height - r, r, Math.PI * 0.5, Math.PI);
      ctx.lineTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      ctx.fill();
    },
    // 画圆图
    circleImg(ctx, img, x, y, r) {
      ctx.save();
      var d = 2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x, y, d, d);
      ctx.restore();
    },
    drawText: function (
      ctx,
      str,
      leftWidth,
      initHeight,
      titleHeight = 30,
      canvasWidth = 250
    ) {
      ctx.save();
      let lineWidth = 0;
      let lastSubStrIndex = 0; //每次开始截取的字符串的索引
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth) {
          ctx.fillText(
            str.substring(lastSubStrIndex, i),
            leftWidth,
            initHeight
          ); //绘制截取部分
          initHeight += 22; //22为 文字大小20 + 2
          lineWidth = 0;
          lastSubStrIndex = i;
          titleHeight += 22;
        }
        if (i == str.length - 1) {
          //绘制剩余部分
          ctx.fillText(
            str.substring(lastSubStrIndex, i + 1),
            leftWidth,
            initHeight
          );
        }
      }
      // 标题border-bottom 线距顶部距离
      titleHeight = titleHeight + 10;
      return titleHeight;
    },
    // 开始画图
    drawPoster(options) {
      let t = this;
      let pid = uni.createCanvasContext("poster", this);
      pid.save();
      pid.setFillStyle("#ffffff");
      pid.fillRect(0, 0, t.width, t.height);
      for (let i in options) {
        let option = options[i],
          id = option.id;
        pid.restore();
        switch (id) {
          case "img":
            /**
             * url => 图片链接
             * type  => 1: 方形，2： 圆形
             * r     => 圆形图片半径
             * x     => x轴
             * y     => y轴
             * height=> 图片高度
             * width => 图片长度
             */
            if (option.type == 1) {
              // 方形图片
              pid.drawImage(
                option.url,
                option.x,
                option.y,
                option.width,
                option.height
              );
            } else if (option.type == 2) {
              // 圆形图片
              t.circleImg(pid, option.url, option.x, option.y, option.r);
            } else if (option.type == 3) {
              let { clipHeight, clipWidth } = option;
              pid.save();
              pid.beginPath();
              t.roundedRectangle(
                pid,
                option.x,
                option.y,
                clipWidth,
                clipHeight,
                0,
                "#fff"
              );
              pid.clip();
              pid.drawImage(
                option.url,
                option.x,
                option.y,
                option.width,
                option.height
              );
              pid.restore();
            }
            break;
          case "text":
            // 文字
            /**
             * color => 文字颜色
             * size  => 文字大小
             * text  => 文字内容
             * x     => x轴
             * y     => y轴
             * height=> 文字高度
             * width => 文字长度
             */
            pid.beginPath();
            pid.fillStyle = option.color;
            pid.setFontSize(option.size);
            // pid.fillText(option.text, option.x, option.y);
            this.drawText(
              pid,
              option.text,
              option.x,
              option.y,
              option.height,
              option.width
            );
            break;
        }
      }
      pid.draw(false, (res) => {
        t.saveCanvas();
      });
    },
    // 保存画布
    saveCanvas() {
      let t = this,
        width = this.width,
        height = this.height;
      let scale = this.scale;
      uni.canvasToTempFilePath(
        {
          x: 0,
          y: 0,
          width: width * scale,
          height: height * scale,
          destWidth: width * scale,
          destHeight: height * scale,
          canvasId: "poster",
          quality: 1,
          success: function (res) {
            t.posterImg = res.tempFilePath;
            t.showBtn = true;
            t.$emit("getPoster", res.tempFilePath);
          },
          fail(err) {
            console.log(err.errMsg, "errr");
            // showToast({ str: "海报生成出了点小问题" });
          },
          complete() {
            console.log("loading over--------------------");
            uni.hideLoading();
          },
        },
        this
      );
    },
    savePoster() {
      let t = this,
        posterImg = t.posterImg;
      if (posterImg) {
        uni.getSetting({
          success(settingdata) {
            if (settingdata.authSetting["scope.writePhotosAlbum"] == false) {
              t.reGetSave();
            } else {
              uni.saveImageToPhotosAlbum({
                filePath: posterImg,
                success() {
                  showToast({ str: "保存成功" });
                  setTimeout(() => {
                    t.hideModal();
                  }, 800);
                },
                fail(res) {},
                complete: function () {
                  uni.hideLoading();
                },
              });
            }
          },
        });
      }
    },
    // 重新获取保存图片权限
    reGetSave() {
      let t = this;
      function successComfirm() {
        uni.openSetting({
          success(settingdata) {
            if (settingdata.authSetting["scope.writePhotosAlbum"]) {
              // showToast({ str: "获取权限成功,请再次保存海报" });
            } else {
              // showToast({ str: "获取权限失败,将不能保存海报" });
            }
          },
        });
      }
      showModal({
        content: "系统想要访问相册,请开启相关权限",
        confirm: () => successComfirm(),
        cancel: () => {
          showToast({ str: "获取权限失败,将不能保存海报" });
        },
      });
    },
    // 隐藏modal
    hideModal() {
      this.$emit("hide");
    },
  },
};
</script>
<style lang='scss' scoped>
.poster {
  position: fixed;
  top: 0;
  left: -300%;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  text-align: center;
}
.modal:before,
.modal:after    /* :after 可以不需要 */ {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.img_modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(13, 13, 13, 0.75);
  z-index: 999;
  text-align: center;
}

.img_modal:before,
.img_modal:after {
  display: inline-block;
  vertical-align: middle;
  content: "";
  height: 100%;
}
.img_box {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 100%;
  width: 470upx;
  height: 832upx;
  background-color: #fff;
  box-shadow: -3px 5px 15px 0px rgba(0, 0, 0, 0.5);
  animation-timing-function: steps(4);
  animation: slide-out ease 0.8s;
  animation-fill-mode: both;
  transform: perspective(1000);
  z-index: 110;
  image {
    width: 100%;
    height: 100%;
  }
}
.save_btn {
  position: relative;
  display: inline-block;
  margin-top: 10upx;
  padding: 11upx 42upx;
  font-weight: 400;
  border: 1upx solid #fff;
  color: #fff;
  border-radius: 100upx;
  font-size: 28upx;
  z-index: 8;
  .iconstyle {
    margin-right: 10upx;
  }
}
.save_btn:active {
  background-color: #fcbe53;
  color: #fff;
}
.close {
  display: inline-block;
  position: absolute;
  right: 0upx;
  top: -100upx;
  font-size: 50upx;
  color: #fff;
}
@keyframes slide-out {
  from {
    left: -600upx;
    bottom: -960upx;
    transform: scale(2, 0.1) rotate(45deg) rotateX(90deg);
  }
  to {
    vertical-align: middle;
    transform: scale(1, 1) rotate(0) rotateX(0);
  }
}
</style>