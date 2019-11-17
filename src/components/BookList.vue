<template>
  <view class="list-wrapper">
    <form
      v-for="(item, index) of booksList"
      :key="index"
      hover-class="hover-button"
      :report-submit="true"
      @submit="handleEnterClick($event, item._id, item.bookName, item.author.name, item.bookCover, item.total)"
    >
      <view class="list-item">
        <img
          mode="aspectFill"
          lazy-load
          :src="item.bookCover && item.bookCover + '?x-oss-process=style/s'"
        />
        <view class="books-syn" :style="{width: pageRanking ? '245rpx' : ''}">
          <text class="syn-title">{{item.bookName}}</text>
          <text class="syn-author">{{ '[' + item.author.dynasty + '] ' + item.author.name}}</text>
          <text v-if="pageHome" class="syn-detail">{{item.bookDesc}}</text>
        </view>
        <view v-if="!pageComment" class="books-sundry">
          <view class="sundry-grade">
            <StarComment :score="item.bookScore || 1.5" />
          </view>
          <view v-if="!pageRanking" class="sundry-count">
            <label class="iconfont">&#xe603;</label>
            {{item.browseSum}}
          </view>
          <view v-if="pageRanking" class="sundry-count">
            <label class="iconfont">&#xe72e;</label>
            {{item.readSum}}
          </view>
          <text v-if="pageHome" class="sundry-tag">{{item.bookType || '未知'}}</text>
        </view>
        <text v-if="pageComment" class="comment-count">{{ item.total }}</text>
        <text
          v-if="pageRanking"
          class="ranking-count"
          :style="{color: index < 3 ? '#f67280' : ''}"
        >{{ index + 1 }}</text>
        <button form-type="submit" />
      </view>
    </form>
    <LoadingMore :loading="loading" :tip="tip" />
  </view>
</template>

<script>
import { mapMutations } from "vuex";
import StarComment from "@/components/StarComment";
import LoadingMore from "@/components/LoadingMore";
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
    pageRanking: {
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
    ...mapMutations(["setBookInfo", "setProduction"]),
    handleEnterClick(e, bookID, bookName, bookAuthor, bookCover, commentCount) {
      if (e.detail.formId === "the formId is a mock one")
        this.setProduction(false);
      else
        this.$api.updateUserInfo(this.$store.state.userID, {
          formId: e.detail.formId
        });

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
        url: `/pages/BookDetail/index?bookID=${bookID}&bookName=${bookName}`
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
        url: `/pages/User/CommentDetail/index?bookID=${bookID}&bookName=${bookName}&bookAuthor=${bookAuthor}&bookCover=${bookCover}&commentCount=${commentCount}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
form {
  position: relative;
  button {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
  }
}
.list-item {
  position: relative;
  display: flex;
  justify-content: space-between;
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
    padding: 0 10rpx;
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
    height: calc(150rpx / 0.65);
    .sundry-grade {
      width: 100%;
      height: 50rpx;
    }
    .sundry-count {
      width: 100%;
      height: 50rpx;
      font-size: 28rpx;
      color: $Grey;
      .iconfont {
        margin-right: 10rpx;
      }
    }

    .sundry-tag {
      width: max-content;
      height: 35rpx;
      padding: 0 10rpx;
      border-radius: 2rpx;
      text-align: center;
      font-size: 22rpx;
      line-height: 35rpx;
      color: #fff;
      background-color: #f8b195;
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
  .ranking-count {
    @extend .comment-count;
    width: 140rpx;
    align-items: center;
    font: {
      size: 40rpx;
      weight: 600;
    }
    color: $Grey;
  }
}
</style>