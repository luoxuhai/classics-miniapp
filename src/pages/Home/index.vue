<template>
  <view class="container">
    <StarTip />
    <BookSearch :homeSearch="homeSearch" />
    <HomeSwiper :banners="banners" />
    <HomeBlock />
    <view class="recommend">热门推荐</view>
    <BookList :booksList="books" :loading="loading" :pageHome="true" ref="list" />
  </view>
</template>

<script>
import BookSearch from "@/components/BookSearch";
import HomeSwiper from "./components/HomeSwiper";
import HomeFilter from "@/components/HomeFilter";
import HomeBlock from "./components/HomeBlock";
import BookList from "@/components/BookList";
import StarTip from "@/components/StarTip";
import { showShareMenu } from "@/libs/mixin";
import { mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";
export default {
  mixins: [showShareMenu],
  components: {
    BookSearch,
    HomeSwiper,
    HomeFilter,
    HomeBlock,
    BookList,
    StarTip
  },
  data() {
    return {
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
    ...mapMutations(["setBookInfo", "setProduction", "setUserInfo"]),
    formSubmit(e) {
      this.formId = e.detail.formId;
      console.log(e.detail.formId);
      console.log("e.detail.formId");
    },
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
        per_page: this.per_page
      };
      this.$api
        .getRecommend(data)
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
    this.loadMore();
    this.getBanner();
  },
  onReachBottom() {
    this.loadMore(true);
  },
  computed: {
    ...mapState(["production"])
  },
  onShareAppMessage() {
    return {
      title: "古典名著苑-免费看海量中国古典小说",
      path: `/pages/Home/index`,
      imageUrl:
        "https://classics.oss-cn-beijing.aliyuncs.com/app/%E6%89%B9%E6%B3%A8%202019-08-29%2021584.jpg"
    };
  },
  onLoad() {
    const token = wx.getStorageSync("token");
    if (wx.getStorageSync("isFirst") !== false)
      wx.setStorageSync("isFirst", true);
    this.getBanner();
    this.loadMore();
    if (token)
      this.$api.getUserInfo(this.$store.state.userID).then(res => {
        this.setUserInfo(res.userInfo);
      });
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      const interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-83c7d09dcd1bd671"
      });
      interstitialAd.onLoad(() => {});
      interstitialAd.onError(err => {});
      interstitialAd.onClose(() => {});
      interstitialAd.show().catch(err => {
        console.error(err);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common.scss";

.container {
  overflow: hidden;
  .recommend {
    padding: 40rpx 0 20rpx 20rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #355c7d;
  }
}
</style>
