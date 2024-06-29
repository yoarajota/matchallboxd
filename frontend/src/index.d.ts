type User = {
  id: string;
  username: string;
  nickname: string;
  password: string;
  __v: number;
};

type SuccessResponse = {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

type ErrorResponse = {
  message: string;
};
