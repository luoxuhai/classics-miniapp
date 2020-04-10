export interface QueryReadHistoryParams {
  current: number;
  pageSize: number;
}

export type State = {
  books: any[];
  loading: boolean;
};

export type Props = {
  userStore: {
    check: boolean;
  };
};
