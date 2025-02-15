import './importEnvs';

const PORT = process.env.PORT;
const ENV = process.env.ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
// const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
// const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
let DB;

if (ENV === 'production') {
  DB = process.env.DB_PROD;
} else {
  DB = process.env.DB_DEV;
}

export {
  PORT,
  ENV,
  DB,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  // EMAIL_ADDRESS,
  // EMAIL_PASSWORD,
};
