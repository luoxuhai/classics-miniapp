interface Booklists {
  _id: string;
  title: string;
  cover: string;
  content: string;
}

export interface QueryBooklistsParams {
  current: number;
  pageSize: number;
}

export interface State {
  booklists: Booklists[];
  loading: boolean;
}

export interface Props {
  userStore: {
    check: boolean;
  };
}
