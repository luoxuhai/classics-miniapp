import Taro, { Component, Config } from '@tarojs/taro';
import { Provider } from '@tarojs/mobx';

import { refreshToken } from '@/services/user';
import Index from './pages/bookstore';
import store from './store';
import './app.less';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/bookstore/index',
      'pages/user/login/index',
      'pages/book_detail/index',
      'pages/bookrack/index',
      'pages/user/index',
      'pages/read_history/index',
      'pages/bookstore/search/index',
      'pages/book_list_view/index',
      'pages/book_preview/index',
      'pages/catalogue/index',
      'pages/booklists/index',
      'pages/user/nickname/index',
      'pages/user/settings/index',
      'pages/rich_content/index',
      'pages/user/admin/index'
    ],
    window: {
      backgroundTextStyle: 'dark',
      backgroundColor: '@bgColor',
      navigationBarTextStyle: '@navTxtStyle',
      navigationBarBackgroundColor: '@navBgColor',
      onReachBottomDistance: 65
    },
    style: 'v2',
    darkmode: true,
    themeLocation: 'theme.json',
    tabBar: {
      color: '#6f7782',
      selectedColor: '#f67280',
      backgroundColor: '@tabBgColor',
      list: [
        {
          pagePath: 'pages/bookstore/index',
          text: '首页',
          iconPath: './assets/tabs/bookstore.png',
          selectedIconPath: './assets/tabs/bookstore-active.png'
        },
        {
          pagePath: 'pages/bookrack/index',
          text: '书架',
          iconPath: './assets/tabs/bookrack.png',
          selectedIconPath: './assets/tabs/bookrack-active.png'
        },
        {
          pagePath: 'pages/booklists/index',
          text: '书单',
          iconPath: './assets/tabs/booklists.png',
          selectedIconPath: './assets/tabs/booklists-active.png'
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
          iconPath: './assets/tabs/user.png',
          selectedIconPath: './assets/tabs/user-active.png'
        }
      ]
    },
    navigateToMiniProgramAppIdList: ['wx8abaf00ee8c3202e']
  };

  interval: any;

  componentWillMount() {
    try {
      this.getBackgroundFetchData();
    } catch (error) {}
    try {
      store.userStore.setToken(Taro.getStorageSync('token'));
    } catch (error) {}
    global.systemInfo = Taro.getSystemInfoSync();
    this.setUser();
    this.initTheme();
    this.refreshToken();
    this.updateApp();
    if (wx.onThemeChange)
      wx.onThemeChange(({ theme }) => {
        store.bookPreviewStore.setTheme(theme === 'dark' ? global.themes[3] : global.themes[0]);
      });
  }

  componentDidShow() {
    this.queryFreeAD();
  }

  componentDidHide() {
    clearInterval(this.interval);
  }

  queryFreeAD() {
    try {
      const freeAD = Taro.getStorageSync('freeAD');
      if (freeAD) store.globalStore.setFreeAD(freeAD);
    } catch (error) {}

    if (global.$token) store.globalStore.queryFreeAD();
    this.interval = setInterval(() => {
      if (global.$token) store.globalStore.queryFreeAD();
    }, 1000 * 60 * 5);
  }

  updateApp() {
    const updateManager = Taro.getUpdateManager();

    function downLoadAndUpdate() {
      Taro.showLoading({ title: '正在升级中', mask: true });
      updateManager.onUpdateReady(() => {
        Taro.hideLoading();
        updateManager.applyUpdate();
      });
    }

    function warn() {
      Taro.showModal({
        title: '温馨提示',
        content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
        showCancel: false,
        confirmText: '确定更新',
        confirmColor: '#f67280'
      }).then(res => {
        if (res.confirm) {
          downLoadAndUpdate();
        } else warn();
      });
    }

    updateManager.onCheckForUpdate(({ hasUpdate }) => {
      if (hasUpdate) {
        Taro.showModal({
          title: '更新提示',
          content: '检测到新版本，是否下载新版本并重启小程序？',
          showCancel: false,
          confirmText: '更新',
          confirmColor: '#f67280'
        }).then(res => {
          if (res.confirm) {
            downLoadAndUpdate();
          } else warn();
        });
      }
    });
  }

  refreshToken() {
    if (global.$token)
      refreshToken().then(res => {
        if (res.token) {
          store.userStore.setToken(res.token);
        }
      });
  }

  initTheme() {
    global.themes = [
      {
        name: '默认',
        backgroundColor: '#fff',
        color: '#353535'
      },
      {
        name: '护眼',
        backgroundColor: '#F1E5C9',
        color: '#353535'
      },
      {
        name: '清新',
        backgroundColor: '#C7EDCC',
        color: '#353535'
      },
      {
        name: '暗黑',
        backgroundColor: '#000',
        color: '#b2b2b2'
      }
    ];
    try {
      const theme = global.systemInfo.theme === 'dark' ? global.themes[3] : Taro.getStorageSync('theme');
      console.log(theme);
      if (theme) store.bookPreviewStore.setTheme(theme);
      const font = Taro.getStorageSync('font');
      if (font) store.bookPreviewStore.setFont(font);
    } catch (error) {}
  }

  getBackgroundFetchData = () => {
    wx.setBackgroundFetchToken({
      token: 'previous-v1'
    });

    wx.getBackgroundFetchData({
      fetchType: 'periodic',
      success: ({ fetchedData }: any) => {
        store.bookstoreStore.saveData(JSON.parse(fetchedData));
      }
    });

    wx.getBackgroundFetchData({
      fetchType: 'pre',
      success: ({ fetchedData }: any) => {
        store.bookstoreStore.saveData(JSON.parse(fetchedData));
      }
    });
  };

  setUser() {
    try {
      const user = Taro.getStorageSync('user');
      const token = Taro.getStorageSync('token');
      const check = Taro.getStorageSync('check');
      store.userStore.setUser(user);
      store.userStore.setToken(token);
      store.userStore.setCheck(check);
    } catch (error) {}
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
