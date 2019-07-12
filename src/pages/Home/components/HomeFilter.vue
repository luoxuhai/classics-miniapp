<template>
  <div class="filter-container">
    <div class="nav-filter">
      <scroll-view
        scroll-x
        class="filter-item-scroll"
        :scroll-left="scrollLeft"
        @scroll="changeScroll"
      >
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
          name: "世情",
          active: false
        },
        {
          name: "志怪",
          active: false
        },
        {
          name: "言情",
          active: false
        },
        {
          name: "公案",
          active: false
        },
        {
          name: "狭邪",
          active: false
        },
        {
          name: "才子佳人",
          active: false
        },
        {
          name: "历史",
          active: false
        },
        {
          name: "神魔",
          active: false
        }
      ],
      sortActiveIndex: 0,
      typeSelectArr: {},
      typeSelectIndex: null,
      sortList: ["默认", "评分", "阅读量", "浏览量"],
      optionIndex: null,
      scrollLeft: 0,
      old: {
        scrollLeft: 0
      }
    };
  },
  methods: {
    handleSelectSort(index) {
      this.optionIndex = null;
      this.sortActiveIndex = index;
      this.$emit("handleSelectSort", index);
    },
    getTypes() {
      this.$api.getTypes().then(res => {
        this.types = res.types;
      });
    },
    handleSelectType(index) {
      this.optionIndex = null;
      //TODO '全部'选项特殊处理
      if (index === 0) {
        if (this.types[0].active) return;
        else {
          this.types = this.types.map((e, i) => {
            if (i === 0) e.active = true;
            else e.active = false;
            return e;
          });
          this.$emit("handleSelectType", []);
          return;
        }
      } else this.types[0].active = false;
      this.types[index].active = !this.types[index].active;
      const currentTypeArr = [];

      for (const value of this.types)
        if (value.active) currentTypeArr.push(value.name);

      if (currentTypeArr.length === 0) {
        this.types[0].active = true;
        this.scrollLeft = this.old.scrollLeft;
        this.$nextTick(() => {
          this.scrollLeft = 0;
        });
      }
      this.$emit("handleSelectType", currentTypeArr);
    },
    changeScroll(e) {
      this.old.scrollLeft = e.detail.scrollLeft;
    },
    handleOptionItem(index) {
      index === this.optionIndex
        ? (this.optionIndex = null)
        : (this.optionIndex = index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.filter-container {
  @include flex(start, center);
  position: relative;
  height: 100rpx;
  widows: 100%;
  background-color: #fff;
  .nav-filter {
    position: relative;
    z-index: 99;
    width: 100%;
    height: 100%;
    padding: 0 30rpx;
    @include flex(space-between, center);
    background-color: #fff;
    color: #434a52;
    .filter-item-sort {
      @include flex(space-around, center);
      width: 10%;
      font-size: 40rpx;
      padding: 10rpx;
    }
    .filter-item-scroll {
      @include flex(start, center);
      width: 90%;
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
      @include flex(start, start, row, wrap);
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
    height: 320rpx;
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
