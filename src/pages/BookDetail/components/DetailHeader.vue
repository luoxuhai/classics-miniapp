<template>
  <header class="header">
    <img
      mode="aspectFill"
      class="book-cover"
      :src="detailHeader.bookCover && detailHeader.bookCover + '?x-oss-process=style/m'"
      @load="changeImgLoad"
    />
    <view class="book-syn">
      <view class="syn-name">{{ detailHeader.bookName }}</view>
      <view class="syn-author">{{ detailHeader.bookAuthor }}</view>
      <view class="syn-count">
        {{ detailHeader.readSum || '' }}人在读
        <label class="iconfont">&#xe72e;</label>
      </view>
      <view class="syn-word">字数: {{ detailHeader.wordSum || '' }}</view>
      <view class="sundry-tag">
        <text class="title">类型:</text>
        <text class="tag-item">{{detailHeader.bookType || '未知'}}</text>
      </view>
    </view>
  </header>
</template>

<script>
export default {
  props: {
    detailHeader: {
      type: Object,
      default: {}
    }
  },
  methods: {
    changeImgLoad() {
      this.$emit("changeImgLoad");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.header {
  display: flex;
  justify-content: space-between;
  width: 670rpx;
  height: 450rpx;
  margin: 50rpx auto 0;
  background-color: #fff;
  .book-cover {
    width: 240rpx;
    height: calc(240rpx / 0.65);
    @include boxShaow;
  }

  .book-syn {
    display: flex;
    flex-direction: column;
    width: 380rpx;
    .syn-name {
      font: {
        size: 40rpx;
        weight: 600;
      }
      color: $Title;
    }
    .syn-author,
    .syn-count,
    .syn-word,
    .sundry-tag {
      margin-top: 30rpx;
      font-size: 32rpx;
      .iconfont {
        margin-left: 5rpx;
      }
    }
    .syn-author {
      font-weight: 600;
      color: $Theme;
    }
    .syn-count,
    .syn-word {
      color: $Grey;
    }
    .sundry-tag {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      color: $Grey;
      .title {
        margin-right: 10rpx;
      }
      .tag-item {
        margin-right: 10rpx;
        font: {
          size: 28rpx;
        }
        color: #f8b195;
      }
    }
  }
}
</style>