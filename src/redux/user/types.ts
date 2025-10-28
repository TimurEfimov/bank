export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;

  profile: {
    avatar: string;
    phone: string;
  };

  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
  };

  card: {
    points: number;
    number: string;
    code: string;
    date: string;
  };

  joinedDate: string;
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
