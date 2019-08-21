<template>
  <view class="wrapper">
    <img
      class="wrapper__image"
      v-for="(item, index) of articles"
      :key="index"
      :src="item.cover"
      @click="handleEnterClick(item._id)"
      mode="aspectFill"
      lazy-load
    />
    <LoadingMore :loading="loading" :tip="tip" />
  </view>
</template>

<script>
import LoadingMore from "@/components/LoadingMore";
import { showShareMenu, pagingLoadMixin } from "@/libs/mixin";
export default {
  mixins: [showShareMenu, pagingLoadMixin],
  components: {
    LoadingMore
  },
  data() {
    return {
      loading: false,
      tip: "暂无数据",
      page: 1,
      total: 1,
      per_page: 10,
      articles: []
    };
  },
  methods: {
    loadMore(reachBottom) {
      if (this.page > this.total) {
        this.loading = false;
        return;
      } else this.loading = true;
      let data = {
        page: this.page,
        per_page: this.per_page
      };

      this.$api
        .getArticles({
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { articles, per_page, total } = res;
          if (this.page >= total) this.loading = false;
          if (reachBottom) this.articles = [...this.articles, ...articles];
          else this.articles = articles;
          this.total = total || 1;
          this.per_page = per_page;
          this.page += 1;
          wx.stopPullDownRefresh();
        })
        .catch(() => {
          wx.stopPullDownRefresh();
        });
    },
    handleEnterClick(id) {
      wx.navigateTo({ url: `/pages/RichContent/index?id=${id}&type=article` });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  // width: 100vw;
  .wrapper__image {
    display: block;
    width: 650rpx;
    height: 650 / 2.34987 + rpx;
    margin: 60rpx auto;
    border-radius: 10rpx;
  }
}
</style>