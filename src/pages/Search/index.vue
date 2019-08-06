<template>
  <div class="search-container">
    <BookSearch
      @handleClickSearch="handleClickSearch"
      @changeInputValue="changeInputValue"
      ref="search"
      :homeSearch="false"
      :searched="searched"
    />
    <section class="search-history">
      <header class="header">
        <text class="title">{{ !searched ? '搜索历史' : '搜索结果' }}</text>
        <text v-if="!searched" class="button-clear" @click="handleClearAll">清空</text>
      </header>
      <BookList v-if="searched" :booksList="books" :loading="false" :tip="tip" pageHome />
      <scroll-view v-if="!searched" class="main" scroll-y>
        <main class="history-item" v-for="(item, index) of searchHistoryArr" :key="index">
          <span class="iconfont">&#xe631;</span>
          <p class="content" @click="handleHistoryItem(index)">{{ item }}</p>
          <span class="iconfont" @click="handleClearItem(index)">&#xe625;</span>
        </main>
      </scroll-view>
    </section>
  </div>
</template>

<script>
import BookSearch from "@/components/BookSearch";
import BookList from "@/components/BookList";
import { mapState, mapMutations } from "vuex";
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
      if (name) this.$refs.search.handleInputValue(name);
      this.searchSucc(name, this.searchResult);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.search-container {
  .search-history {
    padding: 0 40rpx;
    .header {
      @include flex(space-between, center);
      height: 80rpx;
      border-top: 1px solid #ededee;
      font-size: 16px;
      .button-clear {
        color: $Theme;
      }
    }
    .main {
      color: #6f7782;
      height: calc(100vh - 260rpx);
      .history-item {
        @include flex(space-around, center);
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
