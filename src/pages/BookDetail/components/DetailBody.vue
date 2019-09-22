<template>
  <div class="body">
    <div class="body-tab" :class="[fixedTab ? 'fixed-tab' : '']">
      <div
        class="tab-item"
        :class="{select: index === selectIndex}"
        @click="handleTabItem(index)"
        v-for="(item, index) of tabList"
        :key="index"
      >{{ item }}</div>
      <p :style="{transform: 'translateX(' + (selectIndex === 0 ? '0' : '380') + 'rpx)'}"></p>
    </div>
    <div :class="[fixedTab ? 'place' : '']"></div>
    <div class="body-content">
      <swiper duration="240" :current="selectIndex" @change="changeTab">
        <swiper-item>
          <scroll-view :scroll-y="scrollY" style="height: 100vh; -webkit-overflow-scrolling: touch">
            <div class="content-detail">
              <div
                class="detail-syn"
                :class="[descUnfold ? 'syn-shrink' : 'syn-unfold']"
                @click.stop="handleUnfold"
              >
                {{ detailBody.bookDesc || '' }}
                <p class="unfold" @click.stop="handleUnfold">
                  <span class="iconfont" :class="[descUnfold ? 'shrink' : 'unfold']">&#xe63f;</span>
                </p>
              </div>
              <div class="detail-grade">
                <div class="grade-header">
                  <p class="grade-title">评论</p>
                  <div
                    class="button-more"
                    @click="handleGradeClick"
                  >{{comments[0] ? '查看更多' : '我要点评'}}</div>
                </div>
                <CommentList
                  :comments="comments"
                  :detailPage="detailPage"
                  @handleDelComment="handleDelComment"
                  :tip="comments[0] ? '共有' + detailBody.commentSum + '条点评' : tip"
                />
              </div>
              <div class="author-syn">
                <div class="syn-title">
                  <p>作者简介</p>
                </div>
                <div class="syn-content">
                  <img
                    v-if="author.avatar"
                    :src="author.avatar"
                    mode="aspectFill"
                    class="content-img"
                  />
                  <text selectable class="content-text">{{ author.intro }}</text>
                </div>
              </div>
            </div>
          </scroll-view>
        </swiper-item>
        <swiper-item>
          <scroll-view :scroll-y="scrollY" style="height: 100vh">
            <div class="catalog">
              <div class="catalog-title">
                <p class="catalog-sum">共{{ detailBody.catalogueSum }}回</p>
                <div class="catalog-order" hover-class="hover-button" @click="handleOrderClick">
                  <span class="iconfont">&#xe67a;</span>
                  {{ inverted ? '倒序' : '正序' }}
                </div>
              </div>
              <div
                v-for="(item, index) of detailBody.catalogueList"
                :key="index"
                class="catalog-item"
                @click="handleReadClick(inverted
          ? detailBody.catalogueList.length - index - 1
          : index)"
                :hover-class="production ? 'hover-button' : ''"
              >{{ item }}</div>
            </div>
          </scroll-view>
        </swiper-item>
      </swiper>
    </div>
    <div class="navbar">
      <div class="navbar-share" hover-class="hover-button">
        分享此书
        <button open-type="share" @touchstart="handleShareClick"></button>
      </div>
      <div
        :class="[production ? 'navbar-join' : 'navbar-read']"
        :style="{color: detailBody.isStar ? '#888': ''}"
        :hover-class="detailBody.isStar ? '' : 'hover-button'"
        @click="handleAddBookRack"
      >{{ detailBody.isStar ? '已在书单' : '加入书单' }}</div>
      <div
        v-if="production"
        class="navbar-read"
        hover-class="hover-button"
        @click="handleReadClick"
      >阅读</div>
    </div>
  </div>
</template>

<script>
import CommentList from "@/components/CommentList";
import { mapState, mapMutations } from "vuex";
import { developModal } from "@/libs/utils";
export default {
  components: {
    CommentList
  },
  props: {
    detailBody: Object,
    bookID: String,
    author: Object,
    comments: Array,
    fixedTab: Boolean,
    scrollY: Boolean
  },
  data() {
    return {
      inverted: false,
      tip: "还没有点评,赶快点评",
      descUnfold: false,
      selectIndex: 0,
      screenWidth: 0,
      tabList: ["详情", "目录"],
      scrollTop: 0,
      detailPage: true
    };
  },
  methods: {
    handleShareClick() {
      // #ifdef APP-PLUS
      uni.share({
        provider: "weixin",
        type: 5,
        imageUrl:
          "https://classics.oss-cn-beijing.aliyuncs.com/app/%E6%89%B9%E6%B3%A8%202019-08-29%2021584.jpg",
        title: "古典名著苑-免费看海量中国古典小说",
        miniProgram: {
          id: "wx53d943b45c17326f",
          path: "pages/Home/index",
          type: 0
        },
        success: ret => {
          console.log(JSON.stringify(ret));
        }
      });
      // #endif
    },
    ...mapMutations(["setBookInfo"]),
    handleOrderClick() {
      this.inverted = !this.inverted;
      this.$emit("handleOrderClick");
    },
    handleUnfold() {
      this.descUnfold = !this.descUnfold;
    },
    handleDelComment({ commentID, bookID }) {
      this.$emit("handleDelComment", { commentID, bookID });
    },
    handleAddBookRack() {
      if (this.detailBody.isStar) return;
      this.$emit("handleAddBookRack");
    },

    handleReadClick(fileIndex) {
      if (this.production) {
        wx.navigateTo({
          url: `/pages/ReadView/index?fileIndex=${fileIndex}`
        });
      }
    },
    handleGradeClick() {
      this.$emit("handleGradeClick");
    },
    handleTabItem(index) {
      this.selectIndex = index;
    },
    changeTab(e) {
      this.selectIndex = e.detail.current;
    }
  },

  computed: {
    ...mapState(["production"])
  }
  // onShow() {
  //   wx.createSelectorQuery()
  //     .selectAll('.tab-item')
  //     .boundingClientRect(rect => {
  //       console.log(rect);
  //       rect.left
  //       rect.right
  //       rect.width
  //       console.log(rect.left + rect.width / 2 - 60);
  //     }).exec()
  // },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.unfold {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60rpx;
  height: 1.2em;
  background-color: #fff;
  font-size: 1.1em;
  line-height: 1.2em;
  text-align: center;
  color: #355c7d;
  .iconfont {
    width: 100%;
    height: 100%;
    transition: transform 0.1s linear;
    &.shrink {
      transform: rotate(180deg);
    }
    &.unfold {
      transform: rotate(0);
    }
  }
}
.body {
  .button-more {
    font-size: 32rpx;
    color: $Theme;
  }
  .body-tab {
    display: flex;
    justify-content: space-around;
    position: relative;
    width: 100%;
    height: 90rpx;
    border-bottom: 1rpx solid #f6f6f6;
    background-color: #fff;
    .tab-item {
      width: 280rpx;
      height: 100%;
      text-align: center;
      font-size: 40rpx;
      line-height: 90rpx;
      transition: color 0.2s;
      font: {
        size: 40rpx;
      }
      color: #b6b6b6;
      &.select {
        font-weight: 600;
        color: #355c7d;
      }
    }
    p {
      position: absolute;
      bottom: 0;
      left: 135rpx;
      width: 3em;
      height: 6rpx;
      background-color: #355c7d;
      border-radius: 5rpx;
      transition: all 0.2s linear;
    }
  }
  .fixed-tab {
    position: fixed;
    top: 0;
    z-index: 2;
  }
  .place {
    position: relative;
    top: 0;
    z-index: 1;
    width: 100vw;
    height: 90rpx;
  }
  .body-content {
    swiper {
      width: 100%;
      height: 100vh;
      swiper-item {
        width: 750rpx !important;
      }
    }
    .content-detail {
      padding: 40rpx;
      min-height: 80rpx;
      .detail-syn {
        position: relative;
        will-change: max-height;
        line-height: 1.2em;
        font-size: 36rpx;
        color: $Content;
        overflow: hidden;
        transition: max-height 0.3s ease-in-out;
        &.syn-shrink {
          max-height: calc(1.2em * 100);
        }
        &.syn-unfold {
          max-height: calc(1.2em * 4);
        }
      }
      .detail-grade {
        position: relative;
        margin-top: 70rpx;
        .grade-header {
          display: flex;
          justify-content: space-between;
          .grade-title {
            position: relative;
            font: {
              size: 40rpx;
              weight: 600;
            }
            &::before {
              content: "";
              position: absolute;
              width: 5px;
              height: 90%;
              top: 50%;
              transform: translate3d(-10px, -50%, 0);
              background-color: #355c7d;
            }
          }
        }
        &::before {
          content: "";
          position: absolute;
          top: -40rpx;
          left: -40rpx;
          z-index: 99;
          width: 100vw;
          height: 5rpx;
          background-color: $Divider;
        }
      }
      .author-syn {
        margin: 70rpx 0 96rpx 0;
        .syn-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          p {
            position: relative;
            margin: 20rpx 0;
            font: {
              size: 40rpx;
              weight: 600;
            }
            &::before {
              content: "";
              position: absolute;
              width: 10rpx;
              height: 90%;
              top: 50%;
              transform: translate3d(-20rpx, -50%, 0);
              background-color: #355c7d;
            }
          }
        }
        .syn-content {
          .content-img {
            float: left;
            width: 200rpx;
            height: 300rpx;
            margin-right: 20rpx;
          }
          .content-text {
            flex: 1;
            font-size: 32rpx;
            color: $Content;
          }
        }
      }
    }
    .catalog {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: space-between;
      padding: 40rpx 20rpx 150rpx;
      .catalog-title {
        display: flex;
        justify-content: space-between;
        height: 100rpx;
        padding-top: 40rpx;
        font-size: 34rpx;
        line-height: 60rpx;
        color: $Semi;
        .catalog-sum {
          position: relative;
          padding: 0 40rpx;
          &::before {
            content: "";
            position: absolute;
            width: 8rpx;
            height: 60%;
            top: 50%;
            transform: translate3d(-16rpx, -50%, 0);
            background-color: #355c7d;
          }
        }

        .catalog-order {
          padding: 5rpx 10rpx;
          color: #ea5a49;
          .iconfont {
            margin-right: 5rpx;
            font-size: 30rpx;
          }
        }
      }
      .catalog-item {
        @include ellipsis;
        height: 100rpx;
        padding: 0 20rpx;
        border-bottom: 1rpx solid $Divider;
        font-size: 32rpx;
        line-height: 100rpx;
      }
    }
  }
  .navbar {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 2rpx solid $Divider;
    .navbar-share,
    .navbar-join,
    .navbar-read {
      flex: 1;
      @include center;
      background-color: #fff;
      font-size: 20px;
    }
    .navbar-share {
      position: relative;
      button {
        position: absolute;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
    .navbar-join {
      border-left: 1rpx solid $Divider;
    }
    .navbar-read {
      background: $Theme;
      color: #fff;
    }
  }
}
</style>