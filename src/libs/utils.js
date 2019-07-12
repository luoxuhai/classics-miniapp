export const ShowErrorModal = ({ netError }) => {
  wx.showModal({
    title: '警告',
    content: netError ? '网络连接错误' : '未知错误',
    showCancel: false,
    confirmText: netError ? '重启' : '提交反馈',
    success: res => {
      if (res.confirm) {
        if (netError) wx.reLaunch({ url: '/pages/Home/main' });
        else wx.switchTab({ url: `/pages/Personage/main` });
      }
    }
  });
};

export const showToast = ({ title, type = 'success' }) => {
  let icon = Object;
  if (type === 'error') icon.image = '/static/icons/error.png';
  else icon.icon = 'success';
  wx.showToast({
    title,
    ...icon,
    duration: 2000
  });
};
export const developModal = () => {
  wx.showModal({
    title: '提示',
    content: '该功能暂未开放',
    showCancel: false
  });
};
