<template>
  <view>
    <view
      class="nav"
      :class="{show: showHeader}"
      :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
    >
      <!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS -->
      <view
        class="iconfont nav-item"
        v-for="(item, index) of menuIcon"
        :key="index"
        v-html="item"
        @click="handleNavBarItem(index)"
      />
      <!-- #endif -->

      <!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
      <label class="iconfont nav-item" @click="handleNavBarItem(0)">&#xe696;</label>
      <label class="iconfont nav-item" @click="handleNavBarItem(1)">&#xe748;</label>
      <label class="iconfont nav-item" @click="handleNavBarItem(2)">&#xe636;</label>
      <label class="iconfont nav-item" @click="handleNavBarItem(3)">&#xe601;</label>
      <!-- #endif -->
    </view>
    <view
      class="schedule"
      v-if="navBarIndex === 0 && showHeader"
      :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
    >
      <text class="time">已阅读{{readTotal}}分钟</text>
      <view class="progress-bar">
        <label class="iconfont" @click="handleCut(0)">&#xe669;</label>
        <progress
          :percent="percent"
          :active="false"
          show-info
          border-radius="10rpx"
          backgroundColor="#eee"
          activeColor="#6e757f"
          active-mode="forwards"
        />
        <label class="iconfont" @click="handleCut(1)">&#xe667;</label>
      </view>
      <text class="section">{{ catalogueList[fileIndex] }}</text>
    </view>
    <view
      class="theme"
      v-if="navBarIndex === 1 && showHeader"
      :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
    >
      <!-- #ifndef MP-TOUTIAO -->
      <view class="luminance">
        <label class="iconfont">&#xe748;</label>
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
        <label style="font-size: 50rpx" class="iconfont">&#xe748;</label>
      </view>
      <!-- #endif -->
      <view
        class="theme-color"
        :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
      >
        <view
          class="color-item"
          :style="{backgroundColor: item, border: index === readTheme.viewColor.index ? border : ''}"
          @click="handleThemeItem(index)"
          v-for="(item, index) of themeColorList"
          :key="index"
        ></view>
      </view>
    </view>
    <view
      class="text-font"
      v-if="navBarIndex === 2 && showHeader"
      :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
    >
      <view class="font__size">
        <text style="font-size: 40rpx">A</text>
        <slider
          show-value
          :step="2"
          :min="14"
          :max="26"
          :value="readTheme.fontSize"
          :block-size="20"
          backgroundColor="#eee"
          activeColor="#6e757f"
          aria-label="fontsize"
          @change="changeFontSize"
          @changing="changeFontSize"
        />
        <text>A</text>
      </view>
    </view>
    <view
      class="more"
      :class="{show: navBarIndex === 3}"
      :style="{backgroundColor: readTheme.viewColor.backgroundColor, color: readTheme.viewColor.fontColor}"
      catchtouchmove="move"
    >
      <view class="header-nav">
        <view
          class="header-item"
          :class="{select: index === selectIndex}"
          v-for="(item, index) of navList"
          :key="index"
          @click="handleToggleNavClick(index)"
        >{{ item }}</view>
      </view>
      <swiper class="swiper" :duration="300" :current="selectIndex" @change="changeTab">
        <swiper-item class="swiper-item">
          <scroll-view scroll-y class="scorll-view" style="height: calc(100vh - 210rpx)">
            <view
              class="item"
              :style="{color: fileIndex === index ? '#f67280' : ''}"
              v-for="(item, index) of catalogueList"
              :key="index"
              hover-class="hover-button"
              @click="handleToCataClick(index)"
            >{{ item }}</view>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <view class="bookmark-title">书签 • {{ bookMarkList.length }}个</view>
          <scroll-view scroll-y class="scorll-view" style="height: calc(100vh - 310rpx)">
            <view
              class="bookmark-item"
              v-for="(item, index) of bookMarkList"
              :key="index"
              @click="handleBookMarkClick(index)"
              hover-class="hover-button"
            >{{ item }}</view>
          </scroll-view>
        </swiper-item>
      </swiper>
      <view class="button-close" @click="handleNavBarItem(null)" hover-class="hover-button">关闭</view>
    </view>
    <view
      class="mask"
      :class="{show: navBarIndex === 3}"
      v-if="navBarIndex === 3"
      catchtouchmove="move"
      @click="handleNavBarItem(null)"
    />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
let timing;
export default {
  data() {
    return {
      menuIcon: ["&#xe696;", "&#xe748;", "&#xe636;", "&#xe601;"],
      selectIndex: 0,
      readTotal: 0,
      border: "1.5px solid #ff9d76",
      navBarIndex: null,
      showHeader: false,
      navList: ["目录", "书签"],
      themeColorList: ["#f9f9f9", "#f1ecd9", "#c7eaca", "#000000"],
      scheduleValue: null,
      baseBrightness: null,
      themeIndex: null
    };
  },
  methods: {
    ...mapMutations(["setBookInfo", "setReadView"]),
    move() {},
    handleToggleNavClick(index) {
      this.selectIndex = index;
    },
    changeTab(e) {
      this.selectIndex = e.mp.detail.current;
    },
    handleThemeItem(index) {
      this.themeIndex = index;
      let fontColor = "#000000";
      switch (index) {
        case 0:
        case 1:
        case 2:
        case 3:
          if (index === 3) fontColor = "#f9f9f9";
          this.setReadView({
            ...this.readTheme,
            viewColor: {
              index,
              backgroundColor: this.themeColorList[index],
              fontColor
            }
          });
          // #ifdef MP-ALIPAY
          my.setNavigationBar({
            backgroundColor: this.readTheme.viewColor.backgroundColor
          });
          // #endif

          // #ifdef MP-WEIXIN || MP-QQ || APP-PLUS
          wx.setNavigationBarColor({
            frontColor:
              this.readTheme.viewColor.fontColor === "#f9f9f9"
                ? "#ffffff"
                : this.readTheme.viewColor.fontColor,
            backgroundColor: this.readTheme.viewColor.backgroundColor
          });
          // #endif
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
        ...this.readTheme,
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
      return (
        (this.fileIndex / (this.catalogueList.length - 1)) *
        100
      ).toFixed();
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  z-index: 99;
  bottom: 0;
  width: 100%;
  height: 120rpx;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: translateY(120rpx);
  transition: opacity 0.4s ease-out;
  transition: transform 0.2s ease-out;
  .nav-item {
    padding: 40rpx;
    font-size: 24px;
    color: #444c57;
  }
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
}
.more {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    display: flex;
    justify-content: space-around;
    align-items: center;
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
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  z-index: 999;
  bottom: 120rpx;
  width: 100%;
  height: 240rpx;
  padding: 0 40rpx;
  background-color: #fff;
  box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.05);
  .luminance {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    font-size: 48rpx;
    slider {
      width: 460rpx;
    }
    &:first-child {
      font-size: 40rpx;
    }
  }
  .theme-color {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .color-item {
      width: 160rpx;
      height: 50rpx;
    }
  }
}

.text-font {
  @extend .theme;
  .font__size {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    font-size: 48rpx;
    slider {
      width: 460rpx;
    }
    text:first-child {
      font-size: 40rpx;
    }
  }
  .font__family {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.schedule {
  @extend .theme;
  .section {
    display: block;
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    @include ellipsis;
  }
  .progress-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    progress {
      width: 460rpx;
    }
    .iconfont {
      padding: 20rpx;
    }
  }
}
</style>
