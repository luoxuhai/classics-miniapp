import Taro from '@tarojs/taro';
/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  return url;
};

export const getDecimals = (num: string | number): number => Number(String(num).replace(/^\d+\./, '0.'));

export const pageToLogin = () => {
  const path = getCurrentPageUrl();
  if (!path.includes('login')) {
    Taro.navigateTo({
      url: '/pages/login/login'
    });
  }
};

export const shareMixin = (Comp): any => {
  return class extends Comp {
    onShareAppMessage() {
      const {
        title = '古典文学名著阅读-免费看海量中国古典小说',
        path = '/pages/bookstore/index',
        imageUrl
      } = this.shareConfig;
      return {
        title,
        path,
        imageUrl
      };
    }
  };
};

/**
 *
 * @param {String} adUnitId 广告id
 * @param {Function} success 广告看完后触发的函数
 */
export function rewardedVideoAd(adUnitId, success) {
  Taro.showLoading({
    title: '加载广告中',
    mask: true
  });
  const videoAd = Taro.createRewardedVideoAd({
    adUnitId
  });

  videoAd.onError(() => {
    Taro.hideLoading();
    Taro.showToast({
      title: '广告调用失败,请稍后再试',
      icon: 'none'
    });
  });

  videoAd
    .load()
    .then(() => {
      Taro.hideLoading();
      videoAd.show();
      videoAd.onClose(({ isEnded }) => {
        if (isEnded) success();
        videoAd.offClose();
      });
    })
    .catch(error => {
      Taro.hideLoading();
      console.log(error);
    });
}
