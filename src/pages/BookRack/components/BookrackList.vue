<template>
  <view class="rack-main">
    <view
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
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    books: Array
  },
  methods: {
    ...mapMutations(["setBookInfo"]),
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
                      this.$emit("handleLoadMore", null);
                    });
                  }
                }
              });
          }
        }
      });
    },

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
    }
  },
  computed: {
    ...mapState(["production"])
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";

/* flex 瀑布流完美方案  */
.rack-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 40rpx;
  .book-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 auto;
    width: 170rpx;
    height: 340rpx;
    margin-bottom: 40rpx;
    .book-cover {
      width: 170rpx;
      height: calc(170rpx / 0.65);
      @include boxShaow;
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
</style>