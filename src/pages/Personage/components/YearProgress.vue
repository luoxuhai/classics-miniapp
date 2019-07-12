<template>
  <div class="progress-bar">
    <progress :percent="percent"
              stroke-width="8"
              activeColor="#ea5a49"
              border-radius="10rpx" />
    <p>今年过去了<span>{{day}}</span>天, 还剩下<span>{{remain}}</span>天</p>
  </div>
</template>

<script>
export default {
  methods: {
    isLeepYear() {
      const year = new Date().getFullYear();
      if (year % 400 === 0) {
        return true;
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    getDayYear() {
      return this.isLeepYear() ? 366 : 365;
    }
  },

  computed: {
    year() {
      return new Date().getFullYear();
    },
    day() {
      let start = new Date();
      start.setMonth(0);
      start.setDate(1);
      let offset = new Date().getTime() - start.getTime();
      return parseInt(offset / 1000 / 60 / 60 / 24) + 1;
    },
    remain() {
      return this.getDayYear() - this.day;
    },
    percent() {
      return (this.day * 100 / this.getDayYear()).toFixed(1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin: {
    top: 50rpx;
    bottom: 50rpx;
  }
  width: 90%;
  height: 80rpx;
  span {
    color: $Theme;
    font-size: 14px;
  }
}
</style>