<template>
  <view class="search-container">
    <BookSearch
      @handleClickSearch="handleClickSearch"
      @changeInputValue="changeInputValue"
      ref="search"
      :homeSearch="false"
      :searched="searched"
    />
    <view class="search-history">
      <view class="header">
        <text class="title">{{ !searched ? '搜索历史' : '搜索结果' }}</text>
        <text v-if="!searched" class="button-clear" @click="handleClearAll">清空</text>
      </view>
      <BookList v-if="searched" :booksList="books" :loading="false" :tip="tip" pageHome />
      <scroll-view v-if="!searched" class="main" scroll-y>
        <view class="history-item" v-for="(item, index) of searchHistoryArr" :key="index">
          <label class="iconfont">&#xe631;</label>
          <view class="content" @click="handleHistoryItem(index)">{{ item }}</view>
          <label class="iconfont" @click="handleClearItem(index)">&#xe625;</label>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <ad unit-id="adunit-e1a27ccddca8d7e7" ad-type="video" ad-theme="white" />
        <!-- #endif -->
      </scroll-view>
    </view>
  </view>
</template>

<script>
import BookSearch from "@/components/BookSearch";
import BookList from "@/components/BookList";
import { mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";
export default {
  components: {
    BookSearch,
    BookList
  },
  data() {
    return {
      tip: "",
      searched: false,
      books: []
    };
  },
  methods: {
    ...mapMutations(["setSearchHistory", "delSearchHistory"]),
    handleHistoryItem(index) {
      const value = this.searchHistoryArr[index];
      this.$refs.search.handleInputValue(value);
      this.handleClickSearch(value);
    },
    searchSucc(inputValue, res) {
      wx.hideLoading();
      this.books = res.books;
      const len = res.books.length;
      this.searched = true;
      this.tip = `共${len}条搜索结果`;
      this.setSearchHistory(inputValue);
      this.$store.commit("setSearchResult", {});
    },
    handleClickSearch(inputValue) {
      if (this.searched) {
        this.searched = false;
        return;
      }
      wx.showLoading({
        title: "搜索中",
        mask: true
      });

      this.$api
        .search({ inputValue })
        .then(this.searchSucc.bind(this, inputValue))
        .catch(err => {});
    },
    changeInputValue(inputValue) {
      if (inputValue.length === 0) {
        this.searched = false;
        this.bookList = [];
      }
    },
    handleClearItem(index) {
      this.delSearchHistory({
        index
      });
    },
    handleClearAll() {
      this.delSearchHistory({
        all: true
      });
    }
  },
  computed: {
    ...mapState(["searchHistoryArr", "searchResult"])
  },
  onLoad(options) {
    const { code, name } = options;
    if (code === "1") {
      if (name)
        setTimeout(() => {
          this.$refs.search.handleInputValue(name);
        }, 100);
      this.searchSucc(name, this.searchResult);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
ad {
  margin-top: 20px;
}
.search-container {
  .search-history {
    padding: 0 40rpx;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      border-top: 2rpx solid #ededee;
      font-size: 32rpx;
      .button-clear {
        color: $Theme;
      }
    }
    .main {
      color: #6f7782;
      height: calc(100vh - 260rpx);
      .history-item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        line-height: 2em;
        .content {
          flex: 1;
          @include ellipsis;
        }
        .iconfont {
          font-size: 34rpx;
        }
      }
      .iconfont {
        margin: 0 15rpx;
      }
    }
  }
}
</style>
