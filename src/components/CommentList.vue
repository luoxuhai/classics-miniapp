<template>
  <view class="container">
    <view
      class="grade-list"
      :class="{'p-40 ': pageComment}"
      v-for="(item, index) of comments"
      :key="item._id"
    >
      <image
        v-if="!pageComment"
        :src="item.user.avatarUrl + '?x-oss-process=style/s'"
        class="grade-face"
        mode="aspectFill"
      />
      <view class="grade-body">
        <text v-if="!pageComment" class="grade-top">{{item.user.nickName}}</text>
        <view class="grade-stars">
          <view class="grade-star">
            <StarComment :score="item.score" />
          </view>
          <view @click="handleLikeClick(index, item._id, item.isLike)">
            <label v-if="!item.isLike" class="iconfont">&#xe704;</label>
            <label v-if="item.isLike" class="iconfont active">&#xe703;</label>
            {{item.likeSum}}
          </view>
        </view>
        <text class="grade-content">{{item.content}}</text>
        <view class="footer">
          <text class="grade-date">{{relativeTime(item.createdAt)}}</text>
          <view
            v-if="item.user._id === userID"
            class="button-delete"
            @click="handleDelComment(item._id, item.bookID)"
          >删除</view>
        </view>
      </view>
    </view>
    <LoadingMore :loading="loading" />
  </view>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import StarComment from "@/components/StarComment";
import LoadingMore from "@/components/LoadingMore";

moment.locale("zh-cn");
export default {
  name: "comments",
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
    comments: Array
  },
  data() {
    return {
      comments: this.comments
    };
  },
  methods: {
    handleDelComment(commentID, bookID) {
      this.$emit("handleDelComment", { commentID, bookID });
    },
    handleLikeClick(index, commentID, isLike) {
      this.comments[index].isLike = !this.comments[index].isLike;
      if (isLike) {
        this.comments[index].likeSum -= 1;
        this.$api.deleteLike(commentID).catch(() => {
          this.comments[index].likeSum += 1;
        });
      } else {
        this.comments[index].likeSum += 1;
        this.$api
          .addLike({
            commentID
          })
          .catch(() => {
            this.comments[index].likeSum -= 1;
          });
      }
    },
    relativeTime(createdAt) {
      return moment.utc(createdAt, "YYYYMMDDHHmmss").fromNow();
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
    display: flex;
    justify-content: space-between;
    padding: 25rpx;
    & + view {
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-size: 32rpx;
      color: $Theme;
      .button-more {
        color: #ea5a49;
      }
    }
    .grade-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .grade-stars {
        display: flex;
        justify-content: space-between;
        align-items: center;
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