export default {
  bookRack: [],
  bookID: '',
  bookFile: '',
  bookName: '...',
  fileIndex: 0,
  join: false,
  oldScrollTop: 0,
  progress: [0,0],
  isStar: false,
  bookMarkIndex: [],
  catalogueList: [],
  catalogueSum: null,
  bookFileSavePath: [],
  bookRackList: [],
  isBold: wx.getStorageSync("isBold") || false,
  readTheme: {
    fontSize: 18,
    viewColor: {
      index: 0,
      backgroundColor: '#f9f9f9',
      fontColor: '#000000'
    }
  },
  
};
