<template>
  <div class="setting-container">
    <div class="setting-list">
      <div class="list-item" hover-class="hover-button" @click="handleEnterClick(0)">
        <h1>头像</h1>
        <div class="footer">
          <img mode="aspectFill" :src="avatarUrl" />
          <span class="iconfont">&#xe667;</span>
        </div>
      </div>
      <div class="list-item" hover-class="hover-button" @click="handleEnterClick(1)">
        <h1>昵称</h1>
        <div class="footer">
          <p>{{ nickName }}</p>
          <span class="iconfont">&#xe667;</span>
        </div>
      </div>
      <div class="list-item">
        <h1>性别</h1>
        <div class="footer">
          <picker @change="bindPickerGenderChange" :value="sexIndex" :range="sexArr">
            <p>{{sexArr[sexIndex]}}</p>
          </picker>
          <span class="iconfont">&#xe667;</span>
        </div>
      </div>
      <div class="list-item">
        <h1>生日</h1>
        <div class="footer">
          <picker
            mode="date"
            :value="date"
            start="1949-09-01"
            end="2500-09-01"
            @change="bindBirthdayChange"
          >
            <p>{{ date }}</p>
          </picker>
          <span class="iconfont">&#xe667;</span>
        </div>
      </div>
      <div class="list-item">
        <h1>地区</h1>
        <div class="footer">
          <picker mode="region" @change="bindRegionChange" :value="region">
            <p>{{region[0]}}，{{region[1]}}</p>
          </picker>
          <span class="iconfont">&#xe667;</span>
        </div>
      </div>
      <div class="list-item" @click="handleClear">
        清除缓存
        <p class="storage">{{currentSize + 'KB'}}</p>
      </div>
    </div>
    <div hover-class="hover-button" class="button-logout" @click="handleLogoutClick">退出登录</div>
  </div>
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
            url: `/pages/SettingName/index`
          });
      }
    },
    selectImage() {
      wx.showLoading({
        title: "加载中"
      });
      wx.chooseImage({
        count: 1,
        sizeType: ["original"],
        success: res => {
          wx.navigateTo({
            url: `/pages/SettingCropper/index?imagePath=${res.tempFilePaths[0]}`
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    ...mapMutations(["setUserInfo"]),
    handleLogoutClick() {
      wx.showModal({
        title: "提示",
        content: "确认退出登录",
        confirmColor: "#ed3f14",
        success: res => {
          if (res.confirm) {
            wx.clearStorageSync();
            wx.reLaunch({ url: `/pages/Login/index` });
          }
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
      @include flex(space-between, center);
      height: 110rpx;
      padding: 0 35rpx;
      background-color: #fff;
      border-bottom: 1px solid#eee;
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
          font-size: 14px;
          color: $Grey;
        }
        img {
          width: 50px;
          height: 50px;
          margin-right: 10rpx;
          border-radius: 50%;
          background-color: $Place;
        }
        p {
          width: 70vw;
          height: 110rpx;
          margin-right: 10rpx;
          text-align: right;
          line-height: 110rpx;
          font-size: 14px;
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
