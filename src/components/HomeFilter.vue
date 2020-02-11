<template>
  <div class="filter-container">
    <div class="nav-filter">
      <scroll-view scroll-x class="filter-item-scroll">
        <text
          class="title"
          v-for="(item, index) of types"
          :key="index"
          :class="{active: item.active}"
          @click="handleSelectType(index)"
        >{{ item.name }}</text>
      </scroll-view>
      <div class="filter-item-sort" @click="handleOptionItem(1)">
        <span class="iconfont">&#xe648;</span>
      </div>
    </div>
    <div class="option-sort" :class="{show: optionIndex === 1}">
      <div
        class="sort-item"
        v-for="(item, index) of sortList"
        :key="index"
        :style="{color: (index === sortActiveIndex) ? '#ea5a49' : ''}"
        @click="handleSelectSort(index)"
      >{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeFilter",

  data() {
    return {
      types: [
        {
          name: "全部",
          active: true
        },
        {
          name: "鬼怪神魔",
          active: false
        },
        {
          name: "历史演义",
          active: false
        },
        {
          name: "英雄传奇",
          active: false
        },
        {
          name: "世态人情",
          active: false
        },
        {
          name: "谴责公案",
          active: false
        },
        {
          name: "才子佳人",
          active: false
        }
      ],
      sortActiveIndex: 0,
      typeSelectIndex: null,
      sortList: ["默认", "评分", "阅读量", "浏览量"],
      optionIndex: null
    };
  },
  methods: {
    handleSelectSort(index) {
      this.optionIndex = null;
      this.sortActiveIndex = index;
      this.$emit("handleSelectSort", index);
    },
    handleSelectType(index) {
      this.optionIndex = null;
      let currentType = "";
      for (const [i, value] of this.types.entries()) {
        if (i === index) this.types[i].active = true;
        else this.types[i].active = false;
        if (this.types[i].active) currentType = i !== 0 ? value.name : "";
      }

      this.$emit("handleSelectType", currentType);
    },
    handleOptionItem(index) {
      index === this.optionIndex
        ? (this.optionIndex = null)
        : (this.optionIndex = index);
    }
  },
  onReady() {
    this.$api.getTypes().then(res => {
      this.types = res.types;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";

.filter-container {
  display: flex;
  align-items: center;
  height: 100rpx;
  width: 100vw;
  background-color: #fff;
  transition: box-shadow 0.3s;
  .nav-filter {
    position: relative;
    z-index: 99;
    width: 100%;
    height: 100%;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    color: #434a52;
    .filter-item-sort {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 10%;
      font-size: 40rpx;
      padding: 10rpx;
    }
    .filter-item-scroll {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      .title {
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translateY(-60%);
        margin-right: 20rpx;
        padding: 0rpx 10rpx;
        font-size: 30rpx;
        line-height: 1.4em;
        border: 2rpx solid $Place;
        border-radius: 2rpx;
        white-space: nowrap;
        &.active {
          color: #f5f5f5;
          background-color: #f67280;
          border-color: none;
        }
      }
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0.02rpx;
        height: 50%;
        box-shadow: 0 0 4rpx 2rpx rgba(105, 63, 63, 0.1);
      }
    }
  }
  .option-dynasty {
    position: absolute;
    bottom: 0;
    transform: translateY(0);
    opacity: 0.8;
    width: 100%;
    height: 240rpx;
    padding: 0 25rpx;
    transition: all 0.2s ease-out;
    background-color: #fff;
    .dynasty-item {
      height: 80rpx;
      font-size: 36rpx;
      line-height: 80rpx;
    }
    &.show {
      transform: translateY(260rpx);
      opacity: 1;
      z-index: 9;
    }
  }
  .option-type {
    position: absolute;
    bottom: 0;
    opacity: 0.8;
    width: 100%;
    background-color: #fff;
    transition: all 0.2s ease-out;
    .scroll-view {
      display: flex;
      flex-wrap: wrap;
      height: 260rpx;
    }
    .type-item {
      display: inline-block;
      height: 80rpx;
      margin: 15rpx;
      padding: 0 15rpx;
      font-size: 32rpx;
      line-height: 80rpx;
      border: 2rpx solid $Place;
      border-radius: 20rpx;
    }
    &.show {
      transform: translateY(260rpx);
      opacity: 1;
      z-index: 9;
    }
  }
  .option-sort {
    @extend .option-dynasty;
    transform: translateY(-16rpx);
    height: 320rpx;
    @include boxShaow;
    .sort-item {
      @extend .dynasty-item;
    }
    &.show {
      transform: translateY(320rpx);
      opacity: 1;
      z-index: 9;
    }
  }
}
</style>
