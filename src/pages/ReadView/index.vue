<template>
  <div class="read-container">
    <TitleBar
      ref="titleBar"
      @handleToCommentClick="handleToCommentClick"
      @handleAddToRackClick="handleAddToRackClick"
      @handleShareClick="handleShareClick"
    />
    <ContentView ref="contentView" :themeColor="themeColor" @handleControlNav="handleControlNav" />
    <MenuBar
      ref="menuBar"
      @handleThemeItem="handleThemeItem"
      @handleCut="handleCut"
      @handleToCataClick="handleToCataClick"
      @showBookMark="showBookMarkFunc"
    />
    <div
      v-if="showBookMark"
      class="bookmark"
      :style="{color: join ? '#f67280' : '#f8f8fa'}"
      @click="handleJoinBookMarkClick"
    >
      <span class="iconfont">&#xe780;</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import TitleBar from "./components/TitleBar";
import MenuBar from "./components/MenuBar";
import ContentView from "./components/ContentView";
let fileIndex = null;
export default {
  components: {
    TitleBar,
    MenuBar,
    ContentView
  },
  data() {
    return {
      showBookMark: false,
      windowHeight: null,
      fileDataArr: [""],
      themeColor: ""
    };
  },
  methods: {
    ...mapMutations(["setBookInfo"]),
    showBookMarkFunc(val) {
      this.showBookMark = val;
    },

    handleJoinBookMarkClick() {
      let bookMarkIndex = this.bookMarkIndex;
      if (this.bookMarkIndex.includes(this.fileIndex)) {
        bookMarkIndex = bookMarkIndex.filter(item => item !== this.fileIndex);
        this.deleteBookMark(this.fileIndex);
      } else {
        bookMarkIndex = [...new Set([...bookMarkIndex, this.fileIndex])];
        this.addBookMark(this.fileIndex);
      }
      this.setBookInfo({ bookMarkIndex });
    },

    addBookMark(bookMarkIndex) {
      this.$api
        .addBookMark({
          bookID: this.bookID,
          bookMarkIndex
        })
        .then(res => {
          wx.showToast({
            title: "已添加书签",
            icon: "success",
            duration: 1000
          });
        });
    },

    deleteBookMark(bookMarkIndex) {
      this.$api
        .deleteBookMark({
          bookID: this.bookID,
          bookMarkIndex
        })
        .then();
    },

    handleAddToRackClick() {
      if (this.isStar) return;
      this.$api
        .addBookRack({
          bookID: this.bookID
        })
        .then(res => {
          wx.showToast({
            title: "已加入书架",
            icon: "success",
            duration: 2000
          });
          this.setBookInfo({ isStar: true });
        });
    },

    handleToCommentClick() {
      wx.navigateTo({ url: "/pages/Comment/index" });
    },

    handleShareClick() {
      //分享
    },

    handleThemeItem(themeColor) {
      this.themeColor = themeColor;
    },

    handleToCataClick(fileIndex) {
      this.setBookInfo({ fileIndex });
      this.$refs.contentView.handleToCataClick(fileIndex);
    },

    handleCut(index) {
      this.$refs.contentView.handleCut(index);
    },

    handleControlNav(scroll) {
      this.$refs.titleBar.handleControlTitle(scroll);
      this.$refs.menuBar.handleControlMenu(scroll);
    }
  },
  computed: {
    ...mapState([
      "bookName",
      "fileIndex",
      "bookID",
      "userID",
      "join",
      "isStar",
      "bookMarkIndex",
      "oldScrollTop",
      "systemInfo",
      "bookFile",
      "catalogueSum",
      "readTheme"
    ]),
    join() {
      return this.bookMarkIndex.includes(this.fileIndex);
    }
  },
  watch: {
    fileIndex(val) {
      if (val < 0) this.setBookInfo({ fileIndex: 0 });
      else if (val > this.catalogueSum - 1)
        this.setBookInfo({ fileIndex: this.catalogueSum - 1 });
    }
  },
  onPageScroll(e) {
    this.setBookInfo({ oldScrollTop: e.scrollTop });
  },

  onShareAppMessage(res) {
    return {
      title: this.bookName,
      path: `/pages/BookDetail/index?bookID=${this.bookID}&bookName=${this.bookName}`
    };
  },
  onLoad(options) {
    fileIndex = Number(options.fileIndex);

    // #ifdef MP-ALIPAY
    my.setNavigationBar({
      title: this.bookName
    });
    // #endif

    // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO
    wx.setNavigationBarTitle({
      title: this.bookName
    });
    // #endif
  },
  onReady() {
    this.$api
      .getBookContentInfo({
        bookID: this.bookID
      })
      .then(res => {
        const { progress, bookFile, isStar } = res;
        // 选择章节进入
        if (fileIndex >= 0) {
          res.progress = [0, 0, 0];
          //点击阅读进入记住上次位置
        } else if (isStar) {
          fileIndex = progress[0];
          // 未加入书架而点击阅读进入
        } else {
          fileIndex = 0;
        }
        this.$refs.contentView.getBookFile(fileIndex, bookFile);
        this.setBookInfo({ ...res, fileIndex });
        // #ifdef MP-ALIPAY
        my.setNavigationBar({
          backgroundColor: this.readTheme.viewColor.backgroundColor
        });
        // #endif

        // #ifdef MP-WEIXIN || MP-QQ
        wx.setNavigationBarColor({
          frontColor: this.readTheme.viewColor.fontColor,
          backgroundColor: this.readTheme.viewColor.backgroundColor
        });
        // #endif
      });
  },
  onUnload() {
    if (this.isStar)
      // 更新阅读进度
      this.$api.putReadProgress({
        bookID: this.bookID,
        progress: [
          this.fileIndex,
          this.oldScrollTop,
          this.systemInfo.windowWidth
        ]
      });

    //重置oldScrollTop
    this.setBookInfo({ oldScrollTop: 0 });
    // 清除计时器
    this.$refs.menuBar.handleUnload();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.read-container {
  background-color: #f8f8fa;
  .bookmark {
    @include center;
    position: fixed;
    z-index: 9;
    width: 60px;
    height: 60px;
    right: 50px;
    bottom: 110px;
    border-radius: 50%;
    background-color: #444c57;
    .iconfont {
      font: {
        size: 30px;
      }
    }
  }
}
</style>
