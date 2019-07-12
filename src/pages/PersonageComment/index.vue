<template>
  <div>
    <BookList :booksList="books" :pageComment="true" :loading="loading" />
  </div>
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
<style lang="scss" scoped>
</style>
