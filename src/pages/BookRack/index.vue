<template>
  <view class="rack-container">
    <BookrackDate :date="date" :aphorism="aphorism" />
    <BookrackList :books="books" @handleLoadMore="handleLoadMore" />
    <view style="height: 50px">
      <LoadingMore :loading="loading" />
    </view>
    <ad
      v-if="!books[0]"
      class="ad-continer"
      unit-id="adunit-e1a27ccddca8d7e7"
      ad-type="video"
      ad-theme="white"
      :ad-intervals="30"
    />
  </view>
</template>

<script>
import BookrackDate from "./components/BookrackDate";
import BookrackList from "./components/BookrackList";
import LoadingMore from "@/components/LoadingMore";
import { mapState } from "vuex";
import { showShareMenu, pagingLoadMixin } from "@/libs/mixin";
export default {
  mixins: [showShareMenu, pagingLoadMixin],
  components: {
    LoadingMore,
    BookrackDate,
    BookrackList
  },
  data() {
    return {
      loading: true,
      per_page: 10,
      total: 1,
      page: 1,
      date: [],
      books: [],
      aphorism: ""
    };
  },
  methods: {
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
      if (this.token)
        this.$api
          .getBookRack({
            page: this.page,
            per_page: this.per_page
          })
          .then(res => {
            const { books, per_page, total } = res;
            if (this.page >= total) this.loading = false;
            if (reachBottom) this.books = [...this.books, ...books];
            else this.books = books;
            this.total = total || 1;
            this.per_page = per_page;
            this.page += 1;
            this.loading = false;
            wx.stopPullDownRefresh();
          })
          .catch(() => {
            wx.stopPullDownRefresh();
          });
    },
    handleLoadMore() {
      this.page = 1;
      this.loadMore();
    },
    getAphorism() {
      this.$api.getAphorism().then(res => {
        this.aphorism = res.aphorism;
      });
    },
    getDate() {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day =
        date.getDate().length === 1 ? "0" + date.getDate() : date.getDate();
      this.date = [year, month, day];
    }
  },
  computed: {
    ...mapState(["token"])
  },
  onPullDownRefresh() {
    this.getAphorism();
    this.loadMore();
  },
  onLoad() {
    this.getDate();
    this.getAphorism();
  },
  onShow() {
    this.page = 1;
    this.loadMore();
  },
  onShareAppMessage() {
    return {
      title: "古典名著苑-免费看海量中国古典小说",
      path: `/pages/Home/index`,
      imageUrl:
        "https://classics.oss-cn-beijing.aliyuncs.com/app/%E6%89%B9%E6%B3%A8%202019-08-29%2021584.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.rack-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .tip {
    @include center;
    width: 100%;
    margin-bottom: 50rpx;
    color: $Grey;
  }
  .ad-continer {
    width: 100vw;
    padding: 0 5vw;
    position: fixed;
    bottom: 0;
  }
}
</style>