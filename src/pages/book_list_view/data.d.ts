export interface Props {
  bookrackStore: {
    bookrack: any[];
    loading: boolean;
    fetchBookRack: Function;
    setBookrack: Function;
  };
  userStore: {
    token: string;
    check: boolean;
  };
}

export interface QueryBooksParams {
  current: number;
  pageSize: number;
  type?: string;
  sortMethod?: string;
}

export interface State {
  loading: boolean;
  books: any[];
  sort: string;
  order: number;
}

interface Bookrack {
  progress: any[];
  book: { _id: string; bookName: string; bookCover: string };
}

export interface BookViewProps {
  book: Bookrack[];
  isEdit: boolean;
  onClick: (id: string, e: any) => void;
  onLongPress: (id: string) => void;
}
