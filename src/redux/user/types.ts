export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;

  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    phone: string;
  };

  stats: {
    balance: number;
    level: number;
    experience: number;
    nextLevelExp: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
  };

  dates: {
    joinedDate: string;
    lastLogin: string;
  };
};

export type RegisterUserData = {
  name: string;
  email: string;
  password: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type successAuthResponse = {
  token: string;
  data: {
    id: number;
    fullName: string;
    email: string;
  };
};

export type UserState = {
  userData: User | null;
  loading: boolean;
  error: string | null;
};