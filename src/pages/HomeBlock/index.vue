<template>
  <div class="container" :style="{paddingTop: title !== 'ranking' ? '100rpx' : 0}">
    <view class="filter" v-if="title !== 'ranking'">
      <HomeFilter
        ref="filter"
        :pageNewBook="title === 'newbook' ? true : false"
        @handleSelectType="handleSelectType"
        @handleSelectSort="handleSelectSort"
      />
    </view>
    <BookList
      :booksList="books"
      :loading="loading"
      :pageHome="title === 'ranking' ? false : true"
      :pageRanking="title === 'ranking' ? true : false"
      ref="list"
    />
  </div>
</template>

<script>
import HomeFilter from "@/components/HomeFilter";
import BookList from "@/components/BookList";
import { showShareMenu } from "@/libs/mixin";
import { mapState, mapMutations } from "vuex";
export default {
  mixins: [showShareMenu],
  components: {
    HomeFilter,
    BookList
  },
  data() {
    return {
      title: "",
      loading: true,
      page: 1,
      total: 1,
      per_page: 10,
      books: [],
      currentType: "",
      sortMethod: 0
    };
  },
  methods: {
    ...mapMutations(["setBookInfo", "setProduction", "setUserInfo"]),
    handleSelectSort(sortMethod) {
      this.sortMethod = sortMethod;
      this.changeRefresh();
    },
    handleSelectType(currentType) {
      this.currentType = currentType;
      this.changeRefresh();
    },
    changeRefresh() {
      this.page = 1;
      this.books = [];
      this["loadMore_" + this.title]();
    },
    loadMore_newbook(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
 
      this.$api
        .getNewbook({
          page: this.page,
          per_page: this.per_page,
          type: this.currentType
        })
        .then(res => {
          const { books, total, per_page } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) {
            this.books = [...this.books, ...books];
          } else this.books = books;
          this.page += 1;
          this.per_page = per_page;
          this.total = total || 1;
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          this.loading = false;
          wx.stopPullDownRefresh();
        });
    },
    loadMore_ranking(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
      this.$api
        .getRanking({
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { books, total, per_page } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) {
            this.books = [...this.books, ...books];
          } else this.books = books;
          this.page += 1;
          this.per_page = per_page;
          this.total = total || 1;
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          this.loading = false;
          wx.stopPullDownRefresh();
        });
    },
    loadMore_classify(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
      let data = {
        page: this.page,
        per_page: this.per_page,
        type: this.currentType,
        sortMethod: this.sortMethod
      };
      this.$api
        .getBook(data)
        .then(res => {
          const { books, total, per_page } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) {
            this.books = [...this.books, ...books];
          } else this.books = books;
          this.page += 1;
          this.per_page = per_page;
          this.total = total || 1;
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          this.loading = false;
          wx.stopPullDownRefresh();
        });
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this["loadMore_" + this.title]();
  },
  onReachBottom() {
    this["loadMore_" + this.title](true);
  },
  onLoad(options) {
    let title = "分类";
    switch (options.page) {
      case "newbook":
        title = "新书";
        break;
      case "ranking":
        title = "榜单";
    }
    this.title = options.page;
    wx.setNavigationBarTitle({ title });
    this["loadMore_" + this.title]();
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>
<style lang="scss" scoped>
.container {
  overflow: hidden;
  .filter {
    position: fixed;
    top: 0;
  }
}
</style>
