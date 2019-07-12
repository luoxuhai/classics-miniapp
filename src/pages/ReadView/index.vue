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
    const fileIndex = Number(options.fileIndex);
    // 首先加载文件
    const bookFileUrl = `https://classics.oss-cn-beijing.aliyuncs.com/books/contents/${this.bookID}`;
    this.$refs.contentView.getBookFile(fileIndex, bookFileUrl);

    this.$api
      .getBookContentInfo({
        bookID: this.bookID
      })
      .then(res => {
        //加载文件失败重新加载
        if (bookFileUrl !== res.bookFile)
          this.$refs.contentView.getBookFile(fileIndex, res.bookFile);
        this.setBookInfo({ ...res, fileIndex: fileIndex });
      });

    wx.setNavigationBarTitle({
      title: this.bookName
    });
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
