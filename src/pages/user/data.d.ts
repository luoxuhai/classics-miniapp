interface UserData {
  _id: string;
  nickname: string;
  avatar: string;
  gender: string;
}

export interface Props {
  userStore: {
    user: UserData;
    token: string;
    check: boolean;
    fetchUser: Function;
    setUser: Function;
    login: Function;
    logout: Function;
    setCheck: Function;
  };
  globalStore: {
    freeAD: number;
  };
}

export interface SettingsState {
  currentSize: number;
}

export interface NicknameState {
  nickname: string;
}
