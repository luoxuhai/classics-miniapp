export const showShareMenu = {
  onShareAppMessage() {
    return {
      title: '古典名著苑-免费看海量古典小说',
      path: `/pages/Home/index`,
      imageUrl:
        'https://classics.oss-cn-beijing.aliyuncs.com/app/shareCover.jpg'
    }
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true
    })
    // #endif
  }
}

export const onUnload = {
  onUnload() {
    Object.assign(this.$data, this.$options.data())
  }
}

export const pagingLoadMixin = {
  onPullDownRefresh() {
    this.page = 1
    this.loadMore()
  },
  onReachBottom() {
    this.loadMore(true)
  },
  onLoad() {
    this.loadMore()
  }
}

export const deleteComment = {
  methods: {
    handleDelComment({ commentID, bookID }) {
      wx.showModal({
        title: '提示',
        content: '确认删除',
        confirmColor: '#ed3f14',
        success: res => {
          if (res.confirm) {
            this.$api
              .deleteComment(commentID, {
                bookID
              })
              .then(res => {
                this.comments = []
                this.page = 1
                this.loadMore()
              })
          }
        }
      })
    }
  }
}
