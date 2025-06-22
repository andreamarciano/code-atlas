export type Language = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate: string;
  newsletter: boolean;
};

export type Note = {
  id: number;
  content: string;
  language: {
    id: number;
    name: string;
  };
};
