<template>
  <div class="container">
    <HomeSearch hotSearch="红楼梦" :homeSearch="homeSearch" />
    <HomeSwiper :banners="banners" />
    <HomeFilter
      :types="types"
      ref="filter"
      @handleSelectType="handleSelectType"
      @handleSelectSort="handleSelectSort"
    />
    <BookList :booksList="books" :loading="loading" :pageHome="true" />
  </div>
</template>

<script>
import HomeSearch from "@/components/HomeSearch";
import HomeSwiper from "./components/HomeSwiper";
import HomeFilter from "./components/HomeFilter";
import BookList from "@/components/BookList";
import { showShareMenu } from "@/libs/mixin";
import { mapState, mapMutations } from "vuex";
export default {
  mixins: [showShareMenu],
  components: {
    HomeSearch,
    HomeSwiper,
    HomeFilter,
    BookList
  },
  data() {
    return {
      types: [],
      loading: true,
      homeSearch: true,
      page: 1,
      total: 1,
      per_page: 10,
      books: [],
      banners: [],
      currentTypeArr: [],
      sortMethod: 0
    };
  },
  methods: {
    ...mapMutations(["setBookInfo", "setProduction", "getUserInfo"]),
    handleSelectSort(sortMethod) {
      this.sortMethod = sortMethod;
      this.changeRefresh();
    },
    handleSelectType(typeArr) {
      this.currentTypeArr = [...typeArr];
      this.changeRefresh();
    },
    changeRefresh() {
      this.page = 1;
      this.loadMore();
    },
    getBanner() {
      this.$api.getBanner({}).then(res => {
        const { types, banners } = res;
        this.banners = banners;
      });
    },
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
      let data = {
        page: this.page,
        per_page: this.per_page,
        type: this.currentTypeArr.join(","),
        sortMethod: this.sortMethod
      };
      this.$api
        .getBook(data)
        .then(res => {
          const { books, total, per_page } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) this.books = [...this.books, ...books];
          else this.books = books;
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
    this.loadMore();
    this.getBanner();
  },
  onReachBottom() {
    this.loadMore(true);
  },
  onLoad() {
    // wx.redirectTo({ url: "/pages/Guide/index" });
    // returnxxx
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.redirectTo({ url: "/pages/Login/index" });
      return;
		}
		console.log();
    this.$refs.filter.getTypes();
    this.getBanner();
    this.loadMore();
    this.$api.getUserInfo(this.$store.state.userID).then(res => {
      // this.setUserInfo(res.userInfo);
    });
  }
};
</script>