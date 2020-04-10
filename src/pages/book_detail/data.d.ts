export type Book = {
  _id?: string;
  bookName?: string;
  bookCover?: string;
  bookScore?: number;
  author?: { name: string };
  isStar?: boolean;
};

export type Recommend = {
  _id: string;
  bookName: string;
  bookCover: string;
};

export type State = {
  book: Book;
  recommend: Recommend[];
  loading: boolean;
};

export type Props = {
  userStore: {
    check: boolean;
  };
};

export type FetchBookRecommendParams = {
  bookName: string;
  pageSize?: number;
};
