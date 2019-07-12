<template>
  <div class="container">
    <textarea
      auto-focus
      placeholder="输入要修改的姓名"
      :maxlength="20"
      :show-confirm-bar="false"
      v-model="inputValue"
      class="input"
      type="text"
    />
    <div hover-class="hover-button" class="button-submit" @click="handleSubmitClick">保存</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      inputValue: ""
    };
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    handleSubmitClick() {
      this.validateInputValue(this.submitInputValue);
    },

    validateInputValue(next) {
      if (this.inputValue.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
        wx.showModal({
          title: "提示",
          content: "昵称不能为空",
          showCancel: false
        });
        return;
      } else next();
    },

    submitInputValue() {
      wx.showLoading({
        title: "提交中"
      });
      this.$api
        .updateUserInfo(this.userID, {
          nickName: this.inputValue
        })
        .then(res => {
          this.$store.commit("setUserInfo", { nickName: this.inputValue });
          wx.navigateBack({
            delta: 1
          })
            .catch(() => {})
            .finally(() => {
              wx.hideLoading();
            });
        });
    }
  },
  computed: {
    ...mapState(["userID", "nickName"])
  },
  onLoad() {
    this.inputValue = this.nickName;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.container {
  height: 100vh;
  padding-top: 10px;
  background-color: #f8f8f8;
  .input {
    width: auto;
    height: 100px;
    margin: 0 10px 40px 10px;
    padding: 10px;
    background-color: #fff;
  }
  .button-submit {
    @extend .button;
    top: 80px;
  }
}
</style>
