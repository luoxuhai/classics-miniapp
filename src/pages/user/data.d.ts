interface UserData {
  _id: string;
  nickName: string;
  avatarUrl: string;
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
}

export interface SettingsState {
  currentSize: number;
}

export interface NicknameState {
  nickname: string;
}
