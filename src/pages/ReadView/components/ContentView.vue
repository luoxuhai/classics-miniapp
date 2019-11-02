<template>
  <view
    class="content-container"
    :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
  >
    <text
      v-if="opacity"
      class="title"
      :style="{fontSize: readTheme.fontSize - 2 + 'px'}"
      selectable
    >{{ catalogueList[fileIndex] }}</text>
    <!-- #ifdef MP-QQ || MP-WEIXIN -->
    <view
      class="content"
      :style="{opacity, fontSize: readTheme.fontSize + 'px'}"
      @click="handleControlNav"
      @touchmove="handleControlNavHide"
    >
      <!-- #endif -->

      <!-- #ifdef MP-QQ -->
      <HtmlParse :content="bookContent" />
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <!-- <parser html="<div>Hello World!</div" selectable @ready="handleReady" @error="binderror" /> -->
      <HtmlParse :style="{fontWeight: isBold ? 'bold' : ''}" :content="bookContent" />
      <!-- #endif -->
    </view>

    <view v-if="opacity" class="toggle-button">
      <view
        class="last"
        :style="{color: disableCutIndex === index ? '#ccc' : ''}"
        v-for="(item, index) of buttonList"
        :key="index"
        @click="handleCut(index)"
        :hover-class="disableCutIndex === index ? '' : 'hover-button'"
      >{{ item }}</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// #ifdef MP-QQ || MP-WEIXIN
import HtmlParse from "@/components/HtmlParse/parse.vue";
// #endif
export default {
  // #ifdef MP-QQ || MP-WEIXIN
  components: {
    HtmlParse
  },
  // #endif
  props: {
    themeColor: String
  },
  data() {
    return {
      opacity: 0,
      bookContent: "",
      bookFileSavePath: [],
      buttonList: ["上一章", "下一章"]
    };
  },
  methods: {
    ...mapMutations(["setBookInfo", "resetBookInfo"]),
    handleToCataClick(fileIndex) {
      this.setBookInfo({ fileIndex });
      this.getBookFile(fileIndex, this.bookFile);
    },
    handleCut(index) {
      if (this.disableCut() === index) return;
      else {
        if (index === 0) {
          this.setBookInfo({ fileIndex: --this.fileIndex });
        } else {
          this.setBookInfo({ fileIndex: ++this.fileIndex });
        }
        this.getBookFile(this.fileIndex, this.bookFile);
      }
    },

    handleControlNav() {
      this.$emit("handleControlNav", false);
    },

    handleControlNavHide() {
      this.$emit("handleControlNav", true);
    },

    getBookFile(fileIndex, bookFile) {
      this.opacity = 0;
      wx.showLoading({
        title: "加载中",
        mask: true
      });

      this.$api.getOSSContent(`${bookFile}/${fileIndex}.html`).then(res => {
        this.bookContent = res.replace(/　　{2,}/g, "　　");
        // #ifdef MP-WEIXIN || MP-QQ
        this.$nextTick(() => {
          wx.pageScrollTo({
            scrollTop:
              this.progress[1] *
              (this.progress[2] / this.systemInfo.windowWidth),
            // #ifdef MP-WEIXIN || MP-QQ
            duration: 0
            // #endif
          });
          this.setBookInfo({ progress: [0, 0, 0] });
          this.opacity = 1;
          wx.hideLoading();
        });
        // #endif
      });
    },
    disableCut() {
      if (this.fileIndex <= 0) {
        return 0;
      } else if (this.fileIndex >= this.catalogueSum - 1) {
        return 1;
      } else return null;
    },
    handleReady() {
      console.log("ready");
      wx.hideLoading();
      wx.pageScrollTo({
        scrollTop:
          this.progress[1] * (this.progress[2] / this.systemInfo.windowWidth),
        // #ifdef MP-WEIXIN || MP-QQ
        duration: 0
        // #endif
      });
      this.setBookInfo({ progress: [0, 0, 0] });
      this.opacity = 1;
    }
  },
  computed: {
    ...mapState([
      "catalogueList",
      "catalogueSum",
      "bookID",
      "bookFile",
      "readTheme",
      "progress",
      "systemInfo",
      "fileIndex",
      "isBold"
    ]),
    disableCutIndex(val) {
      return this.disableCut();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  padding: 20px 20px 0 20px;
  transition: all 0.2s ease-out;
  .title {
    margin: 25px auto;
    font-size: 16px;
  }
  .content {
    min-height: 70vh;
    line-height: 1.8em;
    text-align: justify;
    opacity: 0;
  }
  .toggle-button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 140rpx;
    .last,
    .next {
      width: 220rpx;
      height: 70rpx;
      border-radius: 10rpx;
      background-color: #fff;
      color: $Title;
      text-align: center;
      line-height: 70rpx;
    }
  }
}
</style>