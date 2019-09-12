<template>
  <div>
    <header class="header">
      <img class="book-cover" :src="bookCover + '?x-oss-process=style/m'" mode="aspectFill" />
      <div class="syn">
        <h1 class="title">{{bookName}}</h1>
        <h2 class="author">{{bookAuthor}}</h2>
        <p class="author">{{count}}条书评</p>
      </div>
    </header>
    <main class="body">
      <CommentList
        :commentList="comments"
        :userID="userID"
        :loading="loading"
        @handleDelComment="handleDelComment"
      />
      <ad v-if="page > total" unit-id="adunit-0a1335b664532ee6" ad-type="video" ad-theme="white" />
    </main>
    <footer class="publish-grade" @click="handleShow" hover-class="hover-more">
      <img :src="avatarUrl" mode="aspectFill" />
      <p>{{loading ? '' : '我来评论'}}</p>
    </footer>
    <PublishGrade ref="publishGrade" @handlePublishClick="handlePublishClick" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { showToast } from "@/libs/utils";
import { deleteComment, pagingLoadMixin } from "@/libs/mixin";
import StarComment from "@/components/StarComment";
import PublishGrade from "@/components/PublishGrade";
import CommentList from "@/components/CommentList";
export default {
  mixins: [deleteComment, pagingLoadMixin],
  components: {
    StarComment,
    PublishGrade,
    CommentList
  },
  data() {
    return {
      isLoading: true,
      count: 0,
      loading: true,
      page: 1,
      per_page: 10,
      total: 1,
      comments: []
    };
  },
  methods: {
    handlePublishClick({ score, content }) {
      let rg = /\S{1,}/g;
      const data = {
        userID: this.userID,
        bookID: this.bookID,
        score,
        content
      };
      if (rg.test(content)) {
        wx.showNavigationBarLoading();
        this.$api
          .addComment(data)
          .then(res => {
            wx.hideNavigationBarLoading();
            this.$refs.publishGrade.handleExit();
            this.comments.unshift({
              ...res.comment,
              user: {
                nickName: this.nickName,
                avatarUrl: this.avatarUrl,
                _id: this.userID
              }
            });
          })
          .catch(err => {
            wx.hideNavigationBarLoading();
            if (err.response.data.errcode === 87014) {
              wx.showModal({
                title: "提示",
                content: "评论含有违法违规内容",
                showCancel: false,
                confirmText: "重写",
                success: res => {
                  if (res.confirm) {
                    this.$refs.publishGrade.inputValue = "";
                  }
                }
              });
              return;
            }
            showToast({
              title: "评论失败",
              type: "error"
            });
          });
      } else {
        wx.showModal({
          title: "提示",
          content: "请输入评论内容",
          showCancel: false
        });
      }
    },
    addComment() {
      this.loadingMore();
    },
    handleShow() {
      this.$refs.publishGrade.handleShow();
    },
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else {
        this.loading = true;
      }
      this.$api
        .getComments({
          bookID: this.bookID,
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { total, per_page, comments, count } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) this.comments = [...this.comments, ...comments];
          else this.comments = comments;
          this.count = count;
          this.page += 1;
          this.per_page = per_page;
          this.total = total || 1;
          setTimeout(() => {
            this.isLoading = false;
          }, 16);
          this.loading = false;
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        });
    }
  },
  computed: {
    ...mapState([
      "bookID",
      "userID",
      "nickName",
      "avatarUrl",
      "bookCover",
      "bookName",
      "bookAuthor"
    ])
  },
  onLoad() {
    wx.showNavigationBarLoading();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
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
.header {
  display: flex;
  height: 340rpx;
  padding: 45rpx 50rpx 0;
  border-bottom: 10rpx solid $Divider;
  .book-cover {
    width: 180rpx;
    height: calc(180rpx / 0.65);
  }
  .syn {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 70%;
    margin-left: 50rpx;
    .title {
      font: {
        size: 36rpx;
        weight: 600;
      }
    }
    .author {
      font-size: 32rpx;
      color: $Grey;
    }
  }
}
.publish-grade {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 120rpx;
  padding-left: 25rpx;
  background-color: #f5f5f5;
  img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: #eee;
  }
  p {
    margin-left: 40rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: $Grey;
  }
}
.body {
  padding-bottom: 120rpx;
}
</style>