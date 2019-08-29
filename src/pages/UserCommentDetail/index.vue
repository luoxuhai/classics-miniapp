<template>
  <main class="container">
    <header>
      <div class="header-content">
        <h1 class="book-name">{{ bookInfo.bookName }}</h1>
        <h2 class="book-author">{{ bookInfo.bookAuthor }}</h2>
        <p class="book-comment-count">{{ bookInfo.commentCount }}条点评</p>
      </div>
      <img mode="aspectFill" :src="bookInfo.bookCover + '?x-oss-process=style/m'" />
    </header>
    <CommentList :commentList="comments" :pageComment="true" @handleDelComment="handleDelComment" />
  </main>
</template>

<script>
import CommentList from "@/components/CommentList";
import { deleteComment } from "@/libs/mixin";
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
@import "@/assets/styles/common.scss";
.container {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    padding: 20px 50rpx;
    border-bottom: 5px solid $Divider;
    .header-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      .book-name {
        @include ellipsis;
        /* #ifdef MP-TOUTIAO */
        overflow: visible;
        /* #endif */
        font: {
          size: 20px;
          weight: 700;
        }
        color: $Title;
      }
      .book-author {
        font: {
          size: 16px;
        }
        color: $Content;
      }
      .book-comment-count {
        font: {
          size: 14px;
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
