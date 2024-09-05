import "./importEnvs";

const PORT = process.env.PORT;
const ENV = process.env.ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
// const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
// const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
let DB;

if (ENV === "production") {
  DB = process.env.DB_PROD;
} else {
  DB = process.env.DB_DEV;
}

let EMAIL_ADDRESS;
let EMAIL_USER;
let EMAIL_PASSWORD;
let EMAIL_HOST;
let EMAIL_PORT;

if (ENV === "production") {
  EMAIL_ADDRESS = process.env.EMAIL_ADDRESS_PROD
  EMAIL_USER = process.env.EMAIL_USER_PROD;
  EMAIL_PASSWORD = process.env.EMAIL_PASSWORD_PROD;
  EMAIL_HOST = process.env.EMAIL_HOST_PROD;
  EMAIL_PORT = process.env.EMAIL_PORT_PROD;
} else {
  EMAIL_ADDRESS = process.env.DEV_EMAIL_ADDRESS;
  EMAIL_USER = process.env.DEV_EMAIL_USER;
  EMAIL_PASSWORD = process.env.DEV_EMAIL_PASSWORD;
  EMAIL_HOST = process.env.DEV_EMAIL_HOST;
  EMAIL_PORT = process.env.DEV_EMAIL_PORT;
}


export {
  PORT,
  ENV,
  DB,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  EMAIL_ADDRESS,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
};
