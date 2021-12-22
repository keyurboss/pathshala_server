let ISDEV1: boolean;
if (process.env.dev && process.env.dev === 'true') {
  ISDEV1 = true;
} else {
  ISDEV1 = process.argv.includes('--dev');
}
export const IOTtest = process.argv.includes('--Iiot');
export const ISDEV = ISDEV1;
export const GlobalVar = {
  db_congif: {
    host: 'database-1.c1iu6jck1gjr.ap-south-1.rds.amazonaws.com',
    user: 'server',
    password: 'GyAnSanskar.com1122',
    database: 'pathshala',
    connectionLimit: 5,
    idleTimeout: 10,
  },
  db_congif_dev: {
    host: 'database-1.c1iu6jck1gjr.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Keyur393939',
    database: 'pathshala',
    connectionLimit: 5,
    idleTimeout: 10,
  },
  firebase_jwt_key:
    'e0c8d61914d2e87e675ffa1479f7c1f21b3652ed6e0ee46f75cde9fb290a804e48f98e835e724c2d05ea7e8bb1d4069161c2713674011915c',
  token: {
    accessToken:
      '891fb58cf7245ccc3f2f8418414729ec3f38a6321f027a92b75b67334b2b4f7b275b696f1d9fc61060a51c3e02b8f9d813d3c21c9156daff92942936adfb',
    refreshToken:
      '7c426018e66376bf3c5fa2fdf31caddca4d14bc17e8f74129abee028bb5e2c668904b96192dd70a1ea009fab7f6d91aa5d109e0f1b6e2421e3ecf863bf4',
  },
  dev_token: {
    accessToken:
      '22b6df14411d0d93dae5b97bb36b72b106decb348b60a06595836247f964fa5c7809f8da2b6ad498724f43b6c2aad3e3354c3ea3491887c0dcbb5c58a7d45',
    refreshToken:
      '1311b07cc261896400a532ea04cc2b4b8bf72cb65e09aa24fc2c890a8a648b83afb2e8e6a0acc36152831ca41b85a6f55157e5b04c8935c081a941ab4799',
  },
};
export const ServerData = {
  basicsiteDetails: {},
  BasicPointDetailsArray: [],
  BasicPointDetails: {},
};
