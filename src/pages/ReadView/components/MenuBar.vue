<template>
  <div>
    <div class="nav" :class="{show: showHeader}">
      <span
        class="iconfont nav-item"
        v-for="(item, index) of menuIcon"
        :key="index"
        v-html="item"
        @click="handleNavBarItem(index)"
      ></span>
    </div>
    <div class="schedule" v-if="navBarIndex === 0 && showHeader">
      <text class="time">已阅读{{readTotal}}分钟</text>
      <div class="progress-bar">
        <span class="iconfont" @click="handleCut(0)">&#xe669;</span>
        <progress
          :percent="percent"
          :active="false"
          show-info
          border-radius="10rpx"
          backgroundColor="#eee"
          activeColor="#6e757f"
          active-mode="forwards"
        />
        <span class="iconfont" @click="handleCut(1)">&#xe667;</span>
      </div>
      <text class="section">{{ catalogueList[fileIndex] }}</text>
    </div>
    <div class="theme" v-if="navBarIndex === 1 && showHeader">
      <div class="luminance">
        <span class="iconfont">&#xe748;</span>
        <slider
          :step="0.1"
          :min="0.1"
          :max="1"
          :block-size="20"
          backgroundColor="#eee"
          activeColor="#6e757f"
          aria-label="luminance"
          @changing="changeBrightness"
          @change="changeBrightness"
          :value="baseBrightness"
        />
        <span style="font-size: 50rpx" class="iconfont">&#xe748;</span>
      </div>
      <div class="theme-color">
        <div
          class="color-item"
          :style="{backgroundColor: item, border: index === readTheme.viewColor.index ? border : ''}"
          @click="handleThemeItem(index)"
          v-for="(item, index) of themeColorList"
          :key="index"
        ></div>
      </div>
    </div>
    <div class="text-font" v-if="navBarIndex === 2 && showHeader">
      <span style="font-size: 40rpx">A</span>
      <slider
        show-value
        :step="2"
        :min="14"
        :max="22"
        :value="readTheme.fontSize"
        :block-size="20"
        backgroundColor="#eee"
        activeColor="#6e757f"
        aria-label="fontsize"
        @change="changeFontSize"
        @changing="changeFontSize"
      />
      <span>A</span>
    </div>
    <div class="more" :class="{show: navBarIndex === 3}">
      <div class="header-nav">
        <div
          class="header-item"
          :class="{select: index === selectIndex}"
          v-for="(item, index) of navList"
          :key="index"
          @click="handleToggleNavClick(index)"
        >{{ item }}</div>
      </div>
      <swiper class="swiper" :duration="300" :current="selectIndex" @change="changeTab">
        <swiper-item class="swiper-item">
          <scroll-view scroll-y class="scorll-view" style="height: calc(100vh - 210rpx)">
            <div
              class="item"
              :style="{color: fileIndex === index ? '#f67280' : ''}"
              v-for="(item, index) of catalogueList"
              :key="index"
              hover-class="hover-button"
              @click="handleToCataClick(index)"
            >{{ item }}</div>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <div class="bookmark-title">书签 • {{ bookMarkList.length }}个</div>
          <scroll-view scroll-y class="scorll-view" style="height: calc(100vh - 310rpx)">
            <div
              class="bookmark-item"
              v-for="(item, index) of bookMarkList"
              :key="index"
              @click="handleBookMarkClick(index)"
              hover-class="hover-button"
            >{{ item }}</div>
          </scroll-view>
        </swiper-item>
      </swiper>
      <div class="button-close" @click="handleNavBarItem(null)" hover-class="hover-button">关闭</div>
    </div>
    <div
      class="mask"
      :class="{show: navBarIndex === 3}"
      v-if="navBarIndex === 3"
      @click="handleNavBarItem(null)"
    ></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HomeSearch from "@/components/HomeSearch";
let timing;
export default {
  components: {
    HomeSearch
  },
  data() {
    return {
      menuIcon: ["&#xe696;", "&#xe748;", "&#xe636;", "&#xe601;"],
      selectIndex: 0,
      readTotal: 0,
      border: "1.5px solid #ff9d76",
      navBarIndex: null,
      showHeader: false,
      navList: ["目录", "书签"],
      themeColorList: ["#f9f9f9", "#f1ecd9", "#c7eaca", "#202731"],
      scheduleValue: null,
      baseBrightness: null,
      themeIndex: null
    };
  },
  methods: {
    ...mapMutations(["setBookInfo", "setReadView"]),
    handleToggleNavClick(index) {
      this.selectIndex = index;
    },
    changeTab(e) {
      this.selectIndex = e.mp.detail.current;
    },
    handleThemeItem(index) {
      this.themeIndex = index;
      let fontColor = "#000";
      switch (index) {
        case 0:
        case 1:
        case 2:
        case 3:
          if (index === 3) fontColor = "#f9f9f9";
          this.setReadView({
            viewColor: {
              index,
              backgroundColor: this.themeColorList[index],
              fontColor
            }
          });
          break;
        default:
          break;
      }
    },
    handleBookMarkClick(index) {
      this.handleToCataClick(this.bookMarkIndex[index]);
      this.selectIndex = 0;
    },

    handleCut(index) {
      this.$emit("handleCut", index);
    },
    handleToCataClick(index) {
      this.cataIndex = index;
      this.$emit("handleToCataClick", index);
      this.handleNavBarItem(null);
    },
    changeBrightness(e) {
      wx.setScreenBrightness({
        value: e.mp.detail.value
      });
    },
    changeFontSize(e) {
      this.setReadView({
        fontSize: e.mp.detail.value
      });
    },
    handleNavBarItem(index) {
      index === this.navBarIndex
        ? (this.navBarIndex = null)
        : (this.navBarIndex = index);
    },
    handleControlMenu(scroll) {
      this.navBarIndex = null;
      scroll ? (this.showHeader = false) : (this.showHeader = !this.showHeader);
    },
    handleUnload() {
      clearInterval(timing);
      wx.setScreenBrightness({
        value: this.baseBrightness
      });
    }
  },
  watch: {
    showHeader(val) {
      this.$emit("showBookMark", val);
    }
  },
  computed: {
    ...mapState([
      "catalogueList",
      "catalogueSum",
      "fileIndex",
      "readTheme",
      "bookMarkIndex"
    ]),
    percent() {
      return ((this.fileIndex / this.catalogueSum) * 100).toFixed();
    },
    bookMarkList() {
      return this.bookMarkIndex.map(item => {
        return this.catalogueList[item];
      });
    }
  },
  onReady() {
    timing = setInterval(() => {
      this.readTotal += 1;
    }, 60000);
    wx.getScreenBrightness({
      success: res => {
        this.baseBrightness = res.value;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.nav {
  @include flex(space-around, center);
  position: fixed;
  z-index: 99;
  bottom: 0;
  width: 100%;
  height: 120rpx;
  padding: 0;
  opacity: 0;
  background-color: #fff;
  box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease-out;
  transform: translateY(120rpx);
  .nav-item {
    margin: 0 20rpx;
    font-size: 24px;
    color: #444c57;
  }
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
}
.more {
  @include flex(space-between, start, column);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  width: 640rpx;
  height: 100vh;
  background-color: #fff;
  opacity: 0.8;
  transform: translateX(750rpx);
  transition: all 0.3s ease-in-out;
  .swiper {
    flex: 1;
    width: 100%;
    .bookmark-title {
      position: relative;
      height: 100rpx;
      padding: 0 50rpx;
      font: {
        weight: 600;
        size: 17px;
      }
      line-height: 100rpx;
      color: #444c57;
      &::before {
        content: "";
        position: absolute;
        width: 4px;
        height: 50%;
        top: 50%;
        transform: translate3d(-8px, -50%, 0);
        background-color: #355c7d;
      }
    }

    .scorll-view {
      width: auto;
      .item {
        height: 100rpx;
        padding: 0 40rpx;
        line-height: 100rpx;
        font-size: 14px;
        @include ellipsis;
        border-bottom: 0.5px solid $Divider;
      }
      .bookmark-item {
        position: relative;
        padding: 0 50rpx;
        border-bottom: none;
        @extend .item;
        &::before {
          @extend .bookmark-title::before;
          width: 8px;
          height: 8px;
          top: 50%;
          transform: translate3d(-15px, -50%, 0);
          background-color: #f8b195;
          border-radius: 50%;
        }
      }
    }
  }
  .header-nav {
    @include flex(space-around, center);
    width: 100%;
    height: 110rpx;
    color: #b6b6b6;
    .header-item {
      padding: 10px 20px;
      transition: color 0.2s;
      &.select {
        font: {
          size: 20px;
          weight: 600;
        }
        color: #355c7d;
      }
    }
  }
  .button-close {
    width: 100%;
    height: 100rpx;
    background-color: #f67280;
    color: #fff;
    line-height: 100rpx;
    text-align: center;
  }
  &.show {
    transform: translateX(0);
    opacity: 1;
  }
}
.mask {
  position: fixed;
  z-index: 999;
  width: 750rpx;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
  left: 0;
  top: 0;
  transition: all 0.3s ease-in-out;
  &.show {
    opacity: 1;
    transform: translateX(0);
  }
}
.theme {
  @include flex(space-around, center, column);
  position: absolute;
  z-index: 99;
  bottom: 120rpx;
  width: 100%;
  height: 240rpx;
  padding: 0 40rpx;
  background-color: #fff;
  .luminance {
    @include flex(space-around, center);
    width: 100%;
    font-size: 24px;
    slider {
      width: 460rpx;
    }
    &:first-child {
      font-size: 20px;
    }
  }
  .theme-color {
    @include flex(space-between, center);
    width: 100%;
    .color-item {
      width: 160rpx;
      height: 50rpx;
    }
  }
}

.text-font {
  @extend .theme;
  @include flex(space-around, center);
  height: 130rpx;
  font-size: 24px;
  slider {
    width: 460rpx;
  }
  &:first-child {
    font-size: 20px;
  }
}

.schedule {
  @extend .theme;
  .section {
    display: block;
    width: 100%;
    font-size: 16px;
    text-align: center;
    @include ellipsis;
  }
  .progress-bar {
    @include flex(space-around, center);
    width: 100%;
    progress {
      width: 460rpx;
    }
    .iconfont {
      padding: 10px;
    }
  }
}
</style>
