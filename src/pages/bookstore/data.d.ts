interface Booklists {
  _id: string;
  title: string;
  cover: string;
  url: string;
}

export interface FetchRecommendParams {
  current: number;
  pageSize: number;
}

export interface SearchParams {
  inputValue: string;
}

export interface State {
  showNavigation: boolean;
  books: any[];
  loading: boolean;
}

export interface Props {
  bookstoreStore: {
    data: {
      books: any[];
      banners: any[];
    };
    loading: boolean;
    saveData: Function;
  };
  userStore: any;
}
