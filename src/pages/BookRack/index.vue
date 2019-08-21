<template>
  <div class="rack-container">
    <header class="rack-header">
      <div class="header-date">
        <div class="date">
          No.
          <text>{{ date[2] }}</text>
        </div>
        <div class="year-month">
          <text>{{ date[1] }}月</text>
          <text>{{ date[0] }}</text>
        </div>
      </div>
      <text space="nbsp" decode class="header-content">{{ aphorism }}</text>
      <span class="header-share iconfont">&#xe6f4;</span>
    </header>
    <main class="rack-main">
      <div
        class="book-item"
        v-for="(item, index) of books"
        :key="index"
        @longpress="handleTaggleAction(item.book._id, item.book.bookName, item.book.bookCover)"
        @click="handleBookRackItem(item.book._id, item.book.bookName, item.book.bookCover)"
      >
        <img
          class="book-cover"
          mode="aspectFill"
          :src="item.book.bookCover + '?x-oss-process=style/m'"
        />
        <text space="nbsp" decode class="book-name">{{item.book.bookName}}</text>
      </div>
    </main>
    <view class="tip" @click="handleToHome">没有更多书单了, 点我查找更多</view>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import LoadingMore from "@/components/LoadingMore";
import { showShareMenu, pagingLoadMixin } from "@/libs/mixin";
export default {
  mixins: [showShareMenu, pagingLoadMixin],
  components: {
    LoadingMore
  },
  data() {
    return {
      load: false,
      per_page: 10,
      total: 1,
      page: 1,
      date: [],
      books: [],
      aphorism: ""
    };
  },
  methods: {
    handleToHome() {
      wx.switchTab({ url: `/pages/Home/index` });
    },
    handleTaggleAction(bookID, bookName, bookCover) {
      wx.showActionSheet({
        itemList: ["打开", "删除"],
        success: res => {
          switch (res.tapIndex) {
            case 0:
              this.handleBookRackItem(bookID, bookName, bookCover);
              break;
            case 1:
              wx.showModal({
                title: "提示",
                content: "确认删除",
                confirmColor: "#ed3f14",
                success: res => {
                  if (res.confirm) {
                    this.$api.deleteBookRack(bookID).then(res => {
                      this.page = 1;
                      this.loadMore();
                    });
                  }
                }
              });
          }
        }
      });
    },
    ...mapMutations(["setBookInfo"]),
    handleBookRackItem(bookID, bookName, bookCover) {
      let url = `/pages/BookDetail/index?bookID=${bookID}&bookName=${bookName}`;
      this.setBookInfo({
        bookID,
        bookName,
        bookCover
      });
      if (this.production) url = `/pages/ReadView/index`;
      wx.navigateTo({
        url
      });
    },
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.load = true;
        return;
      } else this.load = false;
      this.$api
        .getBookRack({
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { books, per_page, total } = res;
          if (this.page >= total) this.load = true;
          if (reachBottom) this.books = [...this.books, ...books];
          else this.books = books;
          this.total = total || 1;
          this.per_page = per_page;
          this.page += 1;
          wx.stopPullDownRefresh();
        })
        .catch(() => {
          wx.stopPullDownRefresh();
        });
    },
    getAphorism() {
      this.$api.getAphorism().then(res => {
        this.aphorism = res.aphorism;
      });
    },
    getDate() {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day =
        date.getDate().length === 1 ? "0" + date.getDate() : date.getDate();
      this.date = [year, month, day];
    }
  },
  onPullDownRefresh() {
    this.getAphorism();
    this.loadMore();
  },
  computed: {
    ...mapState(["production"])
  },
  onLoad() {
    this.getDate();
    this.getAphorism();
  },
  onShow() {
    this.page = 1;
    this.loadMore();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.rack-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .rack-header {
    @include flex(space-between, center);
    height: 150rpx;
    margin-bottom: 100rpx;
    padding: 0 20rpx;
    background-color: #f7f8fa;
    .header-date {
      @include flex(start, center);
      .date {
        font-size: 28rpx;
        text {
          font-size: 52rpx;
          font-weight: 700;
        }
      }
      .year-month {
        @include flex(space-between, start, column);
        margin-left: 20rpx;
        padding-left: 20rpx;
        border-left: 4rpx solid #000;
        font-size: 28rpx;
        color: $Title;
        &:first-child {
          font-size: 30rpx;
        }
      }
    }
    .header-content {
      flex: 1;
      padding: 0 20rpx;
      line-height: 1.3em;
      font-size: 28rpx;
      @include ellipsis(3);
    }
    .header-share {
      font-size: 48rpx;
    }
  }
  /* flex 瀑布流完美方案  */
  .rack-main {
    @include flex(space-between, start, row, wrap);
    padding: 0 40rpx;
    .book-item {
      @include flex(start, center, column);
      flex: 0 0 auto;
      width: 170rpx;
      height: 340rpx;
      margin-bottom: 40rpx;
      .book-cover {
        width: 170rpx;
        height: calc(170rpx / 0.65);
        box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.1);
      }
      .book-name {
        margin-top: 20rpx;
        @include ellipsis(2);
        font-size: 28rpx;
        font-weight: 500;
        color: $Title;
      }
    }
    &::after {
      content: "";
      width: 170rpx;
    }
  }
  .tip {
    @include flex(center);
    width: 100%;
    margin-bottom: 50rpx;
    color: $Grey;
  }
}
</style>