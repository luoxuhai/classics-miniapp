import app from './app';
import user from './user';
import book from './book';
import article from './article';

export default {
  ...app,
  ...user,
  ...book,
  ...article
}