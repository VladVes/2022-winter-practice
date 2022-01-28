export const isTestEnv = process.env.NODE_ENV === 'test';

export default {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  secret: isTestEnv ? 'TEST' : process.env.SECRET,
};
