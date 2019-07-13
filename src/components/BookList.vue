<template>
  <action class="list-container">
    <ul
      class="books-list"
      :class="'book-' + index"
      v-for="(item, index) of booksList"
      :key="index"
      @click="handleEnterClick(item._id, item.bookName, item.author.name, item.bookCover, item.total)"
      hover-class="hover-button"
    >
      <li class="books-img">
        <img mode="aspectFill" lazy-load :src="item.bookCover + '?x-oss-process=style/m'" />
      </li>
      <li class="books-syn">
        <h1 class="syn-title">{{item.bookName}}</h1>
        <h2 class="syn-author">{{ '[' + item.author.dynasty + '] ' + item.author.name}}</h2>
        <p v-if="pageHome" class="syn-detail">{{item.bookDesc}}</p>
      </li>
      <li v-if="!pageComment" class="books-sundry">
        <div class="sundry-grade">
          <StarComment :score="item.bookScore || 1.5" />
        </div>
        <p class="sundry-count">
          <span class="iconfont">&#xe603;</span>
          {{item.browseSum}}
        </p>
        <p v-if="pageHome" class="sundry-tag">
          <span
            class="tag-item"
            v-for="(_item, _index) of item.bookTypeList"
            :key="_index"
          >{{_item}}</span>
        </p>
      </li>
      <li v-if="pageComment" class="comment-count">{{ item.total }}</li>
    </ul>
    <LoadingMore :loading="loading" :tip="tip" />
  </action>
</template>

<script>
import { mapMutations } from "vuex";
import StarComment from "@/components/StarComment";
import LoadingMore from "@/components/LoadingMore";
var intersectionObserver;
export default {
  name: "BookList",
  components: {
    StarComment,
    LoadingMore
  },
  props: {
    pageComment: {
      type: Boolean,
      default: false
    },
    pageHome: {
      type: Boolean,
      default: false
    },
    loading: Boolean,
    booksList: Array,
    tip: {
      type: String,
      default: "你踩到我的底线了!"
    }
  },
  methods: {
    ...mapMutations(["setBookInfo"]),
    handleEnterClick(bookID, bookName, bookAuthor, bookCover, commentCount) {
      if (this.pageComment) {
        this.enterUserCommentDetail(
          bookID,
          bookName,
          bookAuthor,
          bookCover,
          commentCount
        );
        return;
      }
      wx.navigateTo({
        url: `/pages/HomeDetail/index?bookID=${bookID}&bookName=${bookName}`
      });
    },
    enterUserCommentDetail(
      bookID,
      bookName,
      bookAuthor,
      bookCover,
      commentCount
    ) {
      wx.navigateTo({
        url: `/pages/PersonageCommentDetail/index?bookID=${bookID}&bookName=${bookName}&bookAuthor=${bookAuthor}&bookCover=${bookCover}&commentCount=${commentCount}`
      });
    },
    viewPort() {
      intersectionObserver
        .relativeToViewport({ bottom: 10 })
        .observe(".book-" + 5, res => {
          console.log("125584846162626");
          if (res.boundingClientRect.top > 0) {
            console.log("125584846162626");
          }
        });
    }
  },
  onReady() {
    // intersectionObserver = wx.createIntersectionObserver()
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.books-list {
  display: flex;
  height: 260rpx;
  margin: 10rpx 0;
  padding: 20rpx 20rpx 0;
  img {
    width: 150rpx;
    height: calc(150rpx / 0.65);
  }

  .books-syn {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 360rpx;
    height: calc(150rpx / 0.65);
    padding: 0 20rpx;
    .syn-title {
      @include ellipsis;
      font-size: 36rpx;
      font-weight: 600;
      color: $Title;
    }
    .syn-author {
      font-size: 28rpx;
      color: $Semi;
    }
    .syn-detail {
      font-size: 25rpx;
      @include ellipsis(3);
      color: $Grey;
    }
  }
  .books-sundry {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 160rpx;
    height: 200rpx;
    .sundry-grade {
      width: 100%;
      height: 50rpx;
    }
    .sundry-count {
      width: 100%;
      height: 50rpx;
      font-size: 28rpx;
      color: $Grey;
    }

    .sundry-tag {
      flex: 1;
      width: 100%;
      .tag-item {
        height: 30rpx;
        padding: 0 8rpx;
        margin-right: 10rpx;
        border-radius: 2rpx;
        text-align: center;
        font-size: 22rpx;
        line-height: 30rpx;
        color: #fff;
        background-color: #f8b195;
      }
    }
  }
  .comment-count {
    @extend .books-sundry;
    align-items: center;
    font: {
      size: 40rpx;
      weight: 600;
    }
    color: #f67280;
  }
}
</style>