<template>
  <view class="header-container">
    <img class="img-avatar" :src="avatar" @click="handelEnterSetting" mode="aspectFill" />
    <view v-if="token" class="info">
      <view class="info-nickname">{{ nickName }}</view>
      <view class="info-detail">
        <view class="detail-sex">
          <label v-if="gender === '男'" class="iconfont">&#xe632;</label>
          <label v-if="gender === '女'" class="iconfont">&#xe642;</label>
          {{ gender }}
        </view>
        <view class="detail-location">{{ province }} {{city }}</view>
      </view>
    </view>
    <view v-else class="login">登录</view>
    <view class="bg-img" :style="{backgroundImage: 'url(' + avatar + ')'}"></view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PerHeader",
  methods: {
    handelEnterSetting() {
      wx.navigateTo({
        url: "/pages/Setting/index"
      });
    }
  },
  computed: {
    ...mapState([
      "nickName",
      "avatarUrl",
      "birthday",
      "gender",
      "city",
      "province",
      "token"
    ]),

    avatar() {
      return this.avatarUrl + "?x-oss-process=style/l";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.header-container {
  display: flex;
  align-items: center;
  position: relative;
  padding: 40rpx 35rpx 0;
  height: 400rpx;
  background-image: linear-gradient(
    rgba(53, 92, 125, 0.6),
    rgba(53, 92, 125, 0.6)
  );
  color: #f5f5f5;
  .login {
    margin-left: 20rpx;
    font-size: 50rpx;
    letter-spacing: 0.5em;
    font-weight: 600;
  }
  .bg-img {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: -99;
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(8rpx);
  }
  .img-avatar {
    width: 150rpx;
    height: 150rpx;
    border: 10rpx solid #2e506d {
      radius: 50%;
    }
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 25rpx;
    overflow: hidden;
    .info-nickname {
      margin-bottom: 20rpx;
      font-size: 40rpx;
      @include ellipsis;
    }
    .info-detail {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      .detail-sex {
        height: 40rpx;
        padding: 0 10rpx;
        margin-right: 10rpx;
        border-radius: 4rpx;
        background-color: rgba(246, 114, 128, 0.5);
        text-align: center;
        line-height: 40rpx;
        color: #fff;
      }
      .detail-location {
        @extend .detail-sex;
      }
      text {
        margin-right: 50rpx;
      }
    }
  }
}
</style>
