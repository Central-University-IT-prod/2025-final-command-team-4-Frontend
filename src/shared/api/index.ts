import { AccountApi, BookApi, Configuration, CoworkingApi } from './generated';

const auth = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
};

const conf = new Configuration({
  accessToken: localStorage.getItem('token') || '',
  basePath: 'https://prod-team-4-1u3kkm05.REDACTED'
});

const accountService = new AccountApi(conf);
const bookService = new BookApi(conf);
const coworkingApi = new CoworkingApi(conf);

export { auth, conf, accountService, bookService, coworkingApi };
