type User = {
  username: string;
  nickname: string;
  password: string;
};

type SuccessResponse = {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

type ErrorResponse = {
  message: string;
};
