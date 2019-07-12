<template>
  <header class="header">
    <img mode="aspectFill"
         class="book-cover"
         :src="detailHeader.bookCover + '?x-oss-process=style/m'"
         @load="changeImgLoad">
    <div class="book-syn">
      <h1 class="syn-name">{{ detailHeader.bookName }}</h1>
      <h2 class="syn-author">{{ detailHeader.bookAuthor }}</h2>
      <p class="syn-count">{{ detailHeader.readSum || '' }}人在读<span class="iconfont">&#xe72e;</span></p>
      <p class="syn-word">字数: {{ detailHeader.wordSum || '' }}</p>
      <div class="sundry-tag">
        <span class="title">类型: </span>
        <span class="tag-item"
              v-for="(_item, _index) of detailHeader.bookTypeList"
              :key="_index">
          {{_item}}</span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    detailHeader: Object
  },
  methods: {
    changeImgLoad() {
      this.$emit('changeImgLoad')
    }
  },
    computed: {
    ...mapState(['production'])
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.header {
  @include flex(space-between);
  width: 670rpx;
  height: 450rpx;
  margin: 50rpx auto 0;
  background-color: #fff;
  .book-cover {
    width: 240rpx;
    height: calc(240rpx / 0.65);
    @include boxShaow;
  }

  .book-syn {
    @include flex(space-between, start, column);
    width: 380rpx;
    .syn-name {
      font: {
        size: 40rpx;
        weight: 600;
      }
      color: $Title;
    }
    .syn-author,
    .syn-count,
    .syn-word,
    .sundry-tag {
      margin-top: 15rpx;
      font-size: 32rpx;
      .iconfont {
        margin-left: 5rpx;
      }
    }
    .syn-author {
      font-weight: 600;
      color: $Theme;
    }
    .syn-count,
    .syn-word {
      color: $Grey;
    }
    .sundry-tag {
      @include flex(start, center, row, wrap);
      width: 100%;
      color: $Grey;
      .title {
        margin-right: 10rpx;
      }
      .tag-item {
        margin-right: 10rpx;
        font: {
          size: 28rpx;
        }
        color: #f8b195;
      }
    }
  }
}
</style>