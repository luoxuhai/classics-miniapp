<template>
  <view class="rack-header">
    <view class="header-date">
      <view class="date">
        No.
        <text>{{ date[2] }}</text>
      </view>
      <view class="year-month">
        <text>{{ date[1] }}月</text>
        <text>{{ date[0] }}</text>
      </view>
    </view>
    <text space="nbsp" decode class="header-content">{{ aphorism }}</text>
    <label class="header-share iconfont">&#xe6f4;</label>
  </view>
</template>

<script>
export default {
  props: {
    aphorism: String,
    date: Array
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";

.rack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150rpx;
  margin-bottom: 100rpx;
  padding: 0 20rpx;
  background-color: #f7f8fa;
  .header-date {
    display: flex;
    align-items: center;
    .date {
      font-size: 28rpx;
      text {
        font-size: 52rpx;
        font-weight: 700;
      }
    }
    .year-month {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
</style>