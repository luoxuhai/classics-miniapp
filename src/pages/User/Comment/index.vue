<template>
  <view>
    <BookList :booksList="books" :pageComment="true" :loading="loading" />
    <ad v-if="page > total" unit-id="adunit-0a1335b664532ee6" ad-type="video" ad-theme="white" />
  </view>
</template>

<script>
import BookList from "@/components/BookList";
import { mapState, mapMutations } from "vuex";
import { pagingLoadMixin } from "@/libs/mixin";
export default {
  mixins: [pagingLoadMixin],
  components: {
    BookList
  },
  data() {
    return {
      page: 1,
      per_page: 10,
      total: 1,
      loading: true,
      books: []
    };
  },
  methods: {
    loadMore(reachBottom = false) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;

      this.$api
        .getUserComment({ page: this.page, per_page: this.per_page })
        .then(res => {
          const { books, per_page, total } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) this.books = [...this.books, ...books];
          else this.books = books;
          this.page += 1;
          this.per_page = per_page;
          this.total = total || 1;
          this.loading = false;
          wx.stopPullDownRefresh();
        })
        .catch(err => {
          this.loading = false;
          wx.stopPullDownRefresh();
        });
    }
  }
};
</script>
