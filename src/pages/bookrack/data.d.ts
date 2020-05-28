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
  globalStore: {
    freeAD: number;
  };
}

interface Booklists {
  _id: string;
  title: string;
  cover: string;
  url: string;
}

export interface QueryBooklistsParams {
  current: number;
  pageSize: number;
}

export interface State {
  isEdit: boolean;
}

interface Bookrack {
  progress: any[];
  book: { _id: string; bookName: string; bookCover: string };
}

export interface BookViewProps {
  book: Bookrack[];
  isEdit: boolean;
  onClick: (id: any, e: any) => void;
  onLongPress: (id: string) => void;
}
