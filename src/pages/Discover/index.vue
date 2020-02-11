<template>
  <view class="wrapper">
    <img
      class="wrapper__image"
      v-for="(item, index) of articles"
      :key="index"
      :src="item.cover + '?x-oss-process=style/fade'"
      @click="handleEnterClick(item._id)"
      mode="aspectFill"
      lazy-load
    />
    <LoadingMore :loading="loading" :tip="tip" />
    <!-- #ifdef MP-WEIXIN -->
    <ad unit-id="adunit-72c18b317917e60b" ad-type="video" ad-theme="white" />
    <!-- #endif -->
  </view>
</template>

<script>
import LoadingMore from "@/components/LoadingMore";
import { showShareMenu, pagingLoadMixin } from "@/lib/mixin";
import { mapState } from "vuex";

export default {
  mixins: [showShareMenu, pagingLoadMixin],
  components: {
    LoadingMore
  },
  data() {
    return {
      loading: false,
      tip: "",
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

      this.$api
        .getArticles({
          page: this.page,
          per_page: this.per_page
        })
        .then(res => {
          const { articles, per_page, total } = res;
          if (this.page >= total) {
            this.loading = false;
            this.tip = articles.length < 4 ? "" : "你踩到我的底线了!";
          }

          if (reachBottom) this.articles = [...this.articles, ...articles];
          else {
            this.articles = articles;
          }
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
    handleEnterClick(id) {
      if (!this.token) {
        wx.showModal({
          title: "提示",
          content: "登录后查看更多内容",
          showCancel: true,
          confirmText: "登录",
          cancelText: "暂不登录",
          confirmColor: "#f67280",
          success: res => {
            if (res.confirm) wx.navigateTo({ url: "/pages/Login/index" });
          }
        });
        return;
      }

      if (this.production)
        wx.navigateTo({
          url: `/pages/RichContent/index?id=${id}&type=article`
        });
      else wx.navigateTo({ url: `/pages/HomeBlock/index?page=classify` });
    }
  },
  computed: {
    ...mapState(["token", "production"])
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
@import "@/lib/scss/common.scss";
.wrapper__image {
  display: block;
  width: 650rpx;
  height: 650 / 2.34987 + rpx;
  margin: 60rpx auto;
  border-radius: 10rpx;
  @include boxShaow;
}
</style>