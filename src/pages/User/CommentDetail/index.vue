<template>
  <view class="container">
    <view class="header-container">
      <view class="header-content">
        <text class="book-name">{{ bookInfo.bookName }}</text>
        <text class="book-author">{{ bookInfo.bookAuthor }}</text>
        <text class="book-comment-count">{{ bookInfo.commentCount }}条点评</text>
      </view>
      <img mode="aspectFill" :src="bookInfo.bookCover + '?x-oss-process=style/m'" />
    </view>
    <CommentList :comments="comments" :pageComment="true" @handleDelComment="handleDelComment" />
  </view>
</template>

<script>
import CommentList from "@/components/CommentList";
import { deleteComment } from "@/lib/mixin";
export default {
  mixins: [deleteComment],
  components: {
    CommentList
  },
  data() {
    return {
      bookInfo: {},
      page: 1,
      total: 1,
      per_page: 10,
      loading: true,
      comments: []
    };
  },
  methods: {
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;

      this.$api
        .getUserCommentDetail(this.bookInfo.bookID, {
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { comments, per_page, total } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) this.comments = [...this.comments, ...comments];
          else this.comments = [...comments];
          this.bookList = comments;
          this.page += 1;
          this.commentCount = commentCount;
          this.per_page = per_page;
          this.total = total || 1;
          this.loading = false;
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          this.loading = false;
          wx.stopPullDownRefresh();
        });
    }
  },
  onLoad(options) {
    this.bookInfo = options;
    this.loadMore();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.loadMore();
  },
  onReachBottom() {
    this.loadMore(true);
  }
};
</script>
<style lang="scss" scoped>
@import "@/lib/scss/common.scss";
.container {
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 50rpx;
    border-bottom: 5px solid $Divider;
    .header-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: calc(140rpx / 0.65);
      .book-name {
        @include ellipsis;
        font: {
          size: 40rpx;
          weight: 700;
        }
        color: $Title;
      }
      .book-author {
        font: {
          size: 32rpx;
        }
        color: $Content;
      }
      .book-comment-count {
        font: {
          size: 28rpx;
        }
        color: $Light;
      }
    }
    img {
      width: 140rpx;
      height: calc(140rpx / 0.65);
    }
  }
}
</style>
