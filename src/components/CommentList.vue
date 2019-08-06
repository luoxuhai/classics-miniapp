<template>
  <action class="container">
    <ul
      class="grade-list"
      :class="{'p-40 ': pageComment}"
      v-for="(item, index) of commentList"
      :key="item._id"
    >
      <img
        v-if="!pageComment"
        :src="item.user.avatarUrl + '?x-oss-process=style/s'"
        class="grade-face"
        mode="aspectFill"
      />
      <li class="grade-body">
        <h1 v-if="!pageComment" class="grade-top">{{item.user.nickName}}</h1>
        <div class="grade-stars">
          <div class="grade-star">
            <StarComment :score="item.score" />
          </div>
          <p @click="handleLikeClick(index, item._id, item.isLike)">
            <span v-if="!item.isLike" class="iconfont">&#xe704;</span>
            <span v-if="item.isLike" class="iconfont active">&#xe703;</span>
            {{item.likeSum}}
          </p>
        </div>
        <p class="grade-content">{{item.content}}</p>
        <footer class="footer">
          <p class="grade-date">{{relativeTime(item.createdAt)}}</p>
          <div
            v-if="item.user._id === userID"
            class="button-delete"
            @click="handleDelComment(item._id, item.bookID)"
          >删除</div>
        </footer>
      </li>
    </ul>
    <LoadingMore :loading="loading" />
  </action>
</template>

<script>
import moment from 'moment';
import { mapState } from "vuex";
import StarComment from "@/components/StarComment";
import LoadingMore from "@/components/LoadingMore";

moment.locale('zh-cn');
export default {
  name: "CommentList",
  components: {
    StarComment,
    LoadingMore
  },
  props: {
    loading: Boolean,
    pageComment: {
      type: Boolean,
      default: false
    },
    commentList: Array
  },
  data() {
    return {
      commentList: this.commentList
    };
  },
  methods: {
    handleDelComment(commentID, bookID) {
      this.$emit("handleDelComment", { commentID, bookID });
    },
    handleLikeClick(index, commentID, isLike) {
      this.commentList[index].isLike = !this.commentList[index].isLike;
      if (isLike) {
        this.commentList[index].likeSum -= 1;
        this.$api.deleteLike(commentID).catch(() => {
          this.commentList[index].likeSum += 1;
        });
      } else {
        this.commentList[index].likeSum += 1;
        this.$api
          .addLike({
            commentID
          })
          .catch(() => {
            this.commentList[index].likeSum -= 1;
          });
      }
    },
    relativeTime(createdAt) {
      return moment.utc(createdAt, 'YYYYMMDDHHmmss').fromNow();
    }
  },
  computed: {
    ...mapState(["bookID", "userID"])
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.container {
  .grade-list {
    @include flex(space-between);
    padding: 25rpx;
    & + ul {
      border-top: 10rpx solid $Divider;
    }
    .grade-face {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    .grade-top {
      @include flex(space-between, center);
      width: 100%;
      font-size: 32rpx;
      p {
        color: $Theme;
      }
      .button-more {
        color: #ea5a49;
      }
    }
    .grade-body {
      flex: 1;
      @include flex(space-between, start, column);
      .grade-stars {
        @include flex(space-between, center);
        width: 100%;
        height: 50rpx;
        font-size: 28rpx;
        color: $Grey;
        .iconfont {
          margin-right: 5rpx;
          &.active {
            color: #f67280;
          }
        }
      }
      .grade-content {
        padding: 10rpx 0 30rpx 0;
        line-height: 46rpx;
        word-break: break-all;
        font-size: 32rpx;
        color: $Content;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .grade-date {
          font-size: 26rpx;
          color: $Minor;
        }
        .button-delete {
          width: 80rpx;
          height: 40rpx;
          line-height: 40rpx;
          background-color: #f67280;
          border-radius: 2rpx;
          text-align: center;
          font: {
            size: 26rpx;
            weight: 300;
          }
          color: #f5f5f5;
        }
      }
    }
    &.p-40 {
      padding: 40rpx;
    }
  }
}
</style>