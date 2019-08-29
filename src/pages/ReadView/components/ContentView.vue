<template>
  <view
    class="content-container"
    :style="{ opacity, backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
  >
    <text
      v-if="opacity"
      class="title"
      :style="{fontSize: readTheme.fontSize - 2 + 'px'}"
      selectable
    >{{ catalogueList[fileIndex] }}</text>
     <!-- #ifdef MP-WEIXIN -->
    <view
      class="content"
      :style="{ fontSize: readTheme.fontSize + 'px'}"
      :class="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
      @click="handleControlNav"
      @touchmove="handleControlNavHide"
    >
     <!-- #endif -->
    <!-- #ifdef MP-QQ -->
    <view
      class="content"
      :style="{ fontSize: readTheme.fontSize + 'px'}"
      @click="handleControlNav"
      @touchmove="handleControlNavHide"
    >
    <!-- #endif -->
      <!-- #ifdef MP-QQ -->
      <HtmlParse
        :content="bookContent"
        :className="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
      />
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <parser :html="bookContent" selectable @ready="onReady" />
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
// #ifdef MP-QQ
import HtmlParse from "@/components/HtmlParse/parse.vue";
// #endif
import { setTimeout } from "timers";
export default {
  // #ifdef MP-QQ
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
        this.bookContent = res;
        // #ifdef MP-QQ
        setTimeout(() => {
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
        }, 50);
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
    onReady() {
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
      "fileIndex"
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
  opacity: 0;
  transition: opacity 0.16s;
  .title {
    margin: 25px auto;
    font-size: 16px;
  }
  .content {
    min-height: 70vh;
    line-height: 1.8em;
    text-align: justify;
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