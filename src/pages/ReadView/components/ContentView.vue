<template>
  <article
    class="content-container"
    :style="{ opacity, backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
  >
    <header class="header">{{ catalogueList[fileIndex] }}</header>
    <div class="scroll-continer">
      <text
        selectable
        :style="{fontSize: readTheme.fontSize - 2 + 'px'}"
        class="title"
      >{{ catalogueList[fileIndex] }}</text>
      <div
        class="content"
        :style="{fontSize: readTheme.fontSize + 'px'}"
        @click="handleControlNav"
        @touchmove="handleControlNavHide"
      >
        <HtmlParse :content="bookContent" />
      </div>

      <footer v-if="bookContent" class="toggle-button">
        <div
          class="last"
          :style="{color: disableCutIndex === index ? '#ccc' : ''}"
          v-for="(item, index) of buttonList"
          :key="index"
          @click="handleCut(index)"
          :hover-class="disableCutIndex === index ? '' : 'hover-button'"
        >{{ item }}</div>
      </footer>
    </div>
  </article>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";
import HtmlParse from "@/components/HtmlParse/parse.vue";
export default {
  props: {
    themeColor: String
  },

  components: {
    HtmlParse
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

      this.$api.getBookContent(`${bookFile}/${fileIndex}.html`).then(res => {
        this.bookContent = res;
        this.$nextTick(() => {
          wx.hideLoading();
          wx.pageScrollTo({
            scrollTop:
              this.progress[1] *
              (this.progress[2] / this.systemInfo.windowWidth),
            duration: 0
          });
          this.setBookInfo({ progress: [0, 0, 0] });
          this.opacity = 1;
        });
      });
    },
    disableCut() {
      if (this.fileIndex <= 0) {
        return 0;
      } else if (this.fileIndex >= this.catalogueSum - 1) {
        return 1;
      } else return null;
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
  height: 100vh;
  padding-top: 100rpx;
  transition: opacity 0.16s;
  .header {
    display: block;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100rpx;
    padding: 0 55rpx 0 25rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.12);
    font-size: 14px;
    line-height: 50px;
    @include ellipsis;
    color: #a0a5ab;
  }
  // .scroll-view {
  //   width: auto;
  //   height: calc(100vh - 100rpx);
  .scroll-continer {
    padding: 0 12px;
    .title {
      display: block;
      margin: 25px auto;
      font-size: 16px;
      text-align: center;
    }
    .content {
      display: block;
      line-height: 40px;
      text-align: justify;
      &::first-letter {
        font: {
          size: 26px;
          weight: 600;
        }
      }
    }
    .toggle-button {
      @include flex(space-around, center);
      width: 100%;
      height: 140rpx;
      .last,
      .next {
        width: 220rpx;
        height: 70rpx;
        border-radius: 10rpx;
        background-color: #fff;
        text-align: center;
        line-height: 70rpx;
      }
    }
  }
  .footer {
    @extend .header;
    text-align: right;
  }
}
// }
</style>