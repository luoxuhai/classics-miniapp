<template>
  <main class="search-container">
    <section class="search-frame">
      <span class="iconfont">&#xe631;</span>
      <p v-if="homeSearch" class="hot-search" @click="handleSearch">{{hotSearch}}</p>
      <input
        v-if="!homeSearch"
        type="text"
        class="input-search"
        :maxlength="20"
        v-model="inputValue"
        confirm-type="search"
        @confirm="handleClickSearch"
        aria-label="search"
        placeholder="输入书名"
      />
      <span v-if="homeSearch" class="iconfont code" @click="handleScanCode">&#xe600;</span>
      <footer
        v-if="!homeSearch"
        class="search-button"
        @click.stop="handleClickSearch"
      >{{ searched ? '取消' : '搜索' }}</footer>
    </section>
  </main>
</template>

<script>
import { showToast } from "@/lib/utils";
export default {
  name: "HomeSearch",
  props: {
    searched: {
      type: Boolean,
      default: false
    },
    homeSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputValue: "",
      hotSearch: "红楼梦"
    };
  },
  methods: {
    handleInputValue(value) {
      this.inputValue = value;
    },
    handleClickSearch() {
      if (this.inputValue.length > 0)
        this.$emit("handleClickSearch", this.inputValue);
    },
    handleSearch() {
      wx.navigateTo({
        url: `/pages/Search/index`
      });
    },
    handleScanCode() {
      wx.showLoading({
        title: "加载中"
      });
      wx.scanCode({
        success: res => {
          wx.hideLoading();
          // 条形码不正确
          if (res.result.length !== 13) {
            showToast({
              title: "条形码格式错误",
              type: "error"
            });
            return;
          }
          wx.showLoading({
            title: "查询中"
          });
          this.$api.searchByIsbn({ isbn: res.result }).then(res => {
            wx.hideLoading();
            wx.navigateTo({
              url: `/pages/Search/index?code=1&name=${res.name}`
            });
            this.$store.commit("setSearchResult", res);
          });
        },
        fail: () => {
          wx.hideLoading();
        }
      });
    }
  },
  watch: {
    inputValue(val) {
      this.$emit("changeInputValue", val);
    }
  },
  onReady() {
    this.$api.getHotSearch().then(res => {
      this.hotSearch = res.hotSearch;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";
.search-container {
  height: 80rpx;
  margin: 25rpx 0 50rpx 0;
  padding: 0 30rpx;
  .search-frame {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 30rpx;
    border-radius: 60rpx;
    background-color: #f7f8fa;
    font-size: 36rpx;
    color: #b9bec7;
    .hot-search,
    .input-search {
      flex: 1;
      padding: 0 30rpx;
      font-size: 34rpx;
    }
    .search-button {
      line-height: 80rpx;
    }
    .iconfont {
      color: #6f7782;
      &.code {
        padding: 20rpx;
      }
    }
  }
}
</style>