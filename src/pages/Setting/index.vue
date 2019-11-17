<template>
  <view class="setting-container">
    <view class="setting-list">
      <!-- #ifndef MP-TOUTIAO -->
      <view class="list-item" hover-class="hover-button" @click="handleEnterClick(0)">
        <text>头像</text>
        <view class="footer">
          <img mode="aspectFill" :src="avatarUrl" />
          <label class="iconfont">&#xe667;</label>
        </view>
      </view>
      <!-- #endif -->
      <view class="list-item" hover-class="hover-button" @click="handleEnterClick(1)">
        <text>昵称</text>
        <view class="footer">
          <text class="title">{{ nickName }}</text>
          <label class="iconfont">&#xe667;</label>
        </view>
      </view>
      <view class="list-item">
        <text>性别</text>
        <view class="footer">
          <picker @change="bindPickerGenderChange" :value="sexIndex" :range="sexArr">
            <text class="title">{{sexArr[sexIndex]}}</text>
          </picker>
          <label class="iconfont">&#xe667;</label>
        </view>
      </view>
      <view class="list-item">
        <text>生日</text>
        <view class="footer">
          <picker
            mode="date"
            :value="date"
            start="1949-09-01"
            end="2500-09-01"
            @change="bindBirthdayChange"
          >
            <text class="title">{{ date }}</text>
          </picker>
          <label class="iconfont">&#xe667;</label>
        </view>
      </view>
      <view class="list-item">
        <text>地区</text>
        <view class="footer">
          <picker mode="region" @change="bindRegionChange" :value="region">
            <text class="title">{{region[0]}}，{{region[1]}}</text>
          </picker>
          <label class="iconfont">&#xe667;</label>
        </view>
      </view>
      <view class="list-item" @click="handleClear">
        清除缓存
        <text class="storage">{{currentSize + 'KB'}}</text>
      </view>
    </view>
    <view hover-class="hover-button" class="button-logout" @click="handleLogoutClick">退出登录</view>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      sexArr: ["男", "女"],
      sexIndex: 0,
      date: "2019-05-01",
      region: ["广东省", "广州市", "海珠区"],
      currentSize: null
    };
  },
  methods: {
    bindRegionChange(e) {
      this.region = e.mp.detail.value;
      const [province, city, district] = this.region;
      this.submitInputValue({
        province: province.slice(0, -1),
        city: city.slice(0, -1),
        district: district.slice(0, -1)
      });
    },
    bindBirthdayChange(e) {
      this.date = e.mp.detail.value;
      this.submitInputValue({ birthday: this.date });
    },
    bindPickerGenderChange(e) {
      this.sexIndex = e.mp.detail.value;
      this.submitInputValue({ gender: this.sexArr[this.sexIndex] });
    },
    submitInputValue(val = {}) {
      wx.showLoading({
        title: "提交中"
      });
      this.$api
        .updateUserInfo(this.userID, val)
        .then(res => {
          this.$store.commit("setUserInfo", val);
          wx.hideLoading();
        })
        .catch(() => {
          wx.hideLoading();
        });
    },
    handleEnterClick(index) {
      switch (index) {
        case 0:
          this.selectImage();
          break;
        case 1:
          wx.navigateTo({
            url: `/pages/Setting/SettingName/index`
          });
      }
    },
    selectImage() {
       // #ifdef MP-WEIXIN
      wx.showLoading({
        title: "加载中"
      });
      // #endif
      wx.chooseImage({
        count: 1,
        sizeType: ["original"],
        success: res => {
          wx.navigateTo({
            url: `/pages/Setting/ImageCropper/index?imagePath=${res.tempFilePaths[0]}`
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    ...mapMutations(["setUserInfo", "logout"]),
    handleLogoutClick() {
      wx.showModal({
        title: "提示",
        content: "确认退出登录",
        confirmColor: "#ed3f14",
        success: res => {
          if (res.confirm) this.logout();
        }
      });
    },
    handleClear() {
      wx.clearStorageSync();
      this.setUserInfo({
        token: this.$store.state.token,
        userID: this.userID
      });
      wx.setStorageSync("production", this.production);
      wx.showToast({
        title: "清除完成",
        icon: "success",
        duration: 2000
      });
      this.getStorageSize();
    },
    getStorageSize() {
      wx.getStorageInfo({
        success: res => {
          this.currentSize = res.currentSize;
        }
      });
    }
  },
  computed: {
    ...mapState([
      "userID",
      "nickName",
      "avatarUrl",
      "city",
      "province",
      "district",
      "birthday",
      "gender",
      "production"
    ])
  },
  onLoad() {
    this.date = this.birthday;
    this.region = [this.province + "省", this.city + "市"];
    this.getStorageSize();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.setting-container {
  .setting-list {
    margin-top: 50rpx;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 110rpx;
      padding: 0 35rpx;
      background-color: #fff;
      border-bottom: 1px solid#eee;
      &:first-child {
        height: 130rpx;
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        height: 100%;
        picker {
          flex: 1;
          display: flex;
          align-items: inherit;
          justify-content: inherit;
          margin-right: 10rpx;
          font-size: 28rpx;
          color: $Grey;
        }
        img {
          width: 100rpx;
          height: 100rpx;
          margin-right: 10rpx;
          border-radius: 50%;
          background-color: $Place;
        }
        .title {
          width: 70vw;
          height: 110rpx;
          margin-right: 10rpx;
          text-align: right;
          line-height: 110rpx;
          font-size: 28rpx;
          color: $Grey;
        }
        .iconfont {
          color: #888888;
        }
      }
      .storage {
        color: #19be6b;
      }
    }
  }
  .button-logout {
    @extend .button;
    position: fixed;
    bottom: 90px;
  }
}
</style>
