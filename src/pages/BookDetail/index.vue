<template>
  <div class="detail-container" :style="{opacity}">
    <DetailHeader :detailHeader="detailHeader" @changeImgLoad="changeImgLoad" />
    <DetailBody
      :detailBody="detailBody"
      :author="author"
      :bookID="bookInfo.bookID"
      :comments="comments"
      :fixedTab="fixedTab"
      :scrollY="scrollY"
      @handleOrderClick="handleOrderClick"
      @handleAddBookRack="handleAddBookRack"
      @handleGradeClick="handleGradeClick"
      @handleDelComment="handleDelComment"
    />
    <div v-if="share" class="float--button iconfont" @click="handleHomeClick">&#xe867;</div>
    <div v-if="!token" class="mask" catchtouchmove="move" @click="handleLoginClick"></div>
  </div>
</template>

<script>
import DetailHeader from "./components/DetailHeader";
import DetailBody from "./components/DetailBody";
import { deleteComment } from "@/libs/mixin";
import { mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  mixins: [deleteComment],
  components: {
    DetailBody,
    DetailHeader
  },
  data() {
    return {
      share: 0,
      opacity: 0,
      detailHeader: {},
      detailBody: {},
      author: {},
      comments: [],
      bookInfo: {},
      fixedTab: false,
      scrollY: false
    };
  },
  methods: {
    move() {},
    handleOrderClick() {
      this.detailBody.catalogueList = this.detailBody.catalogueList.reverse();
    },
    changeImgLoad() {
      // #ifndef MP-TOUTIAO
      wx.hideNavigationBarLoading();
      // #endif
    },
    handleGradeClick() {
      wx.navigateTo({
        url: `/pages/Comment/index`
      });
    },
    handleAddBookRack() {
      this.detailBody.isStar = true;
      this.$api
        .addBookRack({
          bookID: this.bookInfo.bookID
        })
        .then(res => {
          wx.showToast({
            title: "已加入书单",
            icon: "success",
            duration: 2000
          });
        });
    },

    getBookDetail(bookID, bookName) {
      this.$api
        .getBookDetail(bookID)
        .then(res => {
          this.opacity = 1;
          let {
            catalogueSum,
            catalogueList,
            author,
            bookCover,
            bookDesc,
            bookType,
            wordSum,
            readSum,
            isStar,
            commentSum
          } = res.book;
          this.author = author;
          this.detailHeader = {
            bookAuthor: author.name,
            bookCover,
            wordSum,
            readSum,
            bookType
          };
          this.detailBody = {
            catalogueSum,
            catalogueList,
            bookDesc,
            commentSum,
            isStar
          };
          this.$store.commit("setBookInfo", {
            bookID,
            bookName,
            bookCover,
            bookAuthor: author.name
          });
        })
        .catch(err => {
          // #ifndef MP-TOUTIAO
          wx.hideNavigationBarLoading();
          // #endif
        });
    },

    getComment(bookID) {
      this.$api.getComment(bookID).then(res => {
        this.comments = res.comment;
      });
    },
    handleLoginClick() {
      wx.showModal({
        title: "提示",
        content: "登录后查看更多内容",
        showCancel: true,
        confirmText: "登录",
        cancelText: "暂不登录",
        confirmColor: "#f67280",
        success: res => {
          if (res.confirm)
            wx.navigateTo({ url: `/pages/Login/index?share=true` });
        }
      });
    },
    handleHomeClick() {
      wx.switchTab({ url: "/pages/Home/index" });
    }
  },
  //博客内容
  onShareAppMessage() {
    return {
      title: `${this.bookInfo.bookName}-古典名著苑`,
      path: `/pages/BookDetail/index?share=1&bookID=${this.bookInfo.bookID}&bookName=${this.bookInfo.bookName}`
    };
  },
  computed: {
    ...mapState(["token"])
  },
  onLoad(options) {
    this.share = Number(options.share);
    wx.setNavigationBarTitle({
      title: options.bookName
    });

    // #ifndef MP-TOUTIAO
    wx.showNavigationBarLoading();
    // #endif

    this.bookInfo = options;
    this.getBookDetail(this.bookInfo.bookID, this.bookInfo.bookName);
  },

  onShow() {
    if (!this.token) return;
    this.getComment(this.bookInfo.bookID);
  },

  onPageScroll(e) {
    if (e.scrollTop >= 255) {
      this.fixedTab = true;
      this.scrollY = true;
    } else {
      this.fixedTab = false;
      this.scrollY = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.float--button {
  position: fixed;
  z-index: 999;
  bottom: 200rpx;
  right: 110rpx;
  background-color: #fff;
  @include center;
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  box-shadow: 0 5rpx 10rpx 5rpx rgba(0, 0, 0, 0.08);
  font-size: 50rpx;
  color: $Theme;
}
.loading {
  @include center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
  img {
    width: 300rpx;
    height: 300rpx;
  }
}
.detail-container {
  opacity: 0;
  transition: opacity 0.16s;
  overflow: hidden;
  .mask {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
}
</style>
