<template>
  <article
    class="content-container"
    :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
  >
    <header class="header">{{ catalogueList[fileIndex] }}</header>
    <scroll-view scroll-y :scroll-top="scrollTop" class="scroll-view" @scroll="changeScroll">
      <div class="scroll-continer">
        <text
          selectable
          :style="{fontSize: readTheme.fontSize - 2 + 'px'}"
          class="title"
        >{{ catalogueList[fileIndex] }}</text>
        <!-- <text selectable>{{ bookContent }}
        </text>-->
        <rich-text
          class="content"
          :style="{fontSize: readTheme.fontSize + 'px'}"
          space="nbsp"
          :nodes="bookContent"
          @click="handleControlNav"
        />
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
    </scroll-view>
  </article>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";
export default {
  props: {
    themeColor: String
  },
  data() {
    return {
      bookContent: "",
      bookFileSavePath: [],
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
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
        console.log(this.bookFile);
        this.getBookFile(this.fileIndex, this.bookFile);
        console.log(this.fileIndex);
      }
    },
    changeScroll(e) {
      this.old.scrollTop = e.detail.scrollTop;
      this.handleControlNav(e, true);
    },
    //'e'为点击事件参数
    handleControlNav(e, scroll = false) {
      this.$emit("handleControlNav", scroll);
    },
    getBookFile(fileIndex, bookFile) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      this.$api.getBookContent(`${bookFile}/${fileIndex}.html`).then(res => {
        this.bookContent = res;
        //监听scroll事件，记录组件内部变化的值，在设置新值之前先设置为记录的当前值
        this.scrollTop = this.old.scrollTop;
        this.$nextTick(() => {
          this.scrollTop = 0;
          wx.hideLoading();
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
      "bookFile",
      "readTheme",
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
  .header {
    display: block;
    height: 100rpx;
    padding: 0 55rpx 0 25rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.12);
    font-size: 14px;
    line-height: 50px;
    @include ellipsis;
    color: #a0a5ab;
  }
  .scroll-view {
    width: auto;
    height: calc(100vh - 100rpx);
    .scroll-continer {
      padding: 0 25rpx;
      .title {
        display: block;
        margin: 50rpx auto;
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
}
</style>