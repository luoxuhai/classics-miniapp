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
      "bookMarkIndex",
      "oldScrollTop",
      "systemInfo",
      "bookFile",
      "catalogueSum"
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
  onShareAppMessage(res) {
    return {
      title: this.bookName,
      path: `/pages/HomeDetail/index?bookID=${this.bookID}&bookName=${this.bookName}`
    };
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.bookName
    });
    let fileIndex = Number(options.fileIndex);

    this.$api
      .getBookContentInfo({
        bookID: this.bookID
      })
      .then(res => {
        const { progress, bookFile } = res;
        //记住上次位置
        if (fileIndex === 0 && progress[0] !== 0 && progress[1] !== 0)
          fileIndex = progress[0];
        this.$refs.contentView.getBookFile(fileIndex, bookFile);
        this.setBookInfo({ ...res, fileIndex });
      });
  },
  onUnload() {
    // 更新阅读进度
    this.$api.putReadProgress({
      bookID: this.bookID,
      progress: [this.fileIndex, this.oldScrollTop, this.systemInfo.windowWidth]
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
