let ISDEV1: boolean;
if (process.env.dev && process.env.dev === 'true') {
  ISDEV1 = true;
} else {
  ISDEV1 = process.argv.includes('--dev');
}
export const IOTtest = process.argv.includes('--Iiot')
export const ISDEV = ISDEV1;
export const GlobalVar = {
  db_congif: {
    host: 'server.rpsoftech.xyz',
    user: 'boozserver',
    password: 'j0L9LES$#QQmqjaw',
    connectionLimit: 3,
    database: 'booz_dev_server',
  },
  db_congif_dev: {
    host: "server.rpsoftech.xyz",
    user: "pathshala_server",
    password: "JtYd#e$r%10PgRr",
    database: "pathshala",
    connectionLimit: 5,
    idleTimeout: 10
  },
  firebase_jwt_key:
    'e0c8d61914d2e87e675ffa1479f7c1f21b3652ed6e0ee46f75cde9fb290a804e48f98e835e724c2d05ea7e8bb1d4069161c27100002813674011915c',
  token: {
    accessToken:
      '151c095c45243a9303453f73fb70e0f6dc0fbe8efbc2770ebe1f21e8ce94fba037fbbc060151262012c1e5f58dcb881c00aec7d82ddf1f7fd81ccd904e331682',
    refreshToken:
      '2a442f557658ce7cd403c6bfd3ee68b4ec3a9d16898d78d7dd9a54b7af9178ce97e502b0dc343882bb744b3379a2e75965ab469cb6e21a76387ee35e13ffb299',
  },
  dev_token: {
    accessToken:
      '6b061f5c7e7450e1585283ca4ea680076b17b981e0c81f63427c58866d24ef7852046031b7f610f21d72814f6dda8317ea4c8072e63c70f8110f01d466e67db7',
    refreshToken:
      '6ab66677d871ee993d8e11b48b2cdbd281ba8ff2a74bd7e9b3a160c58714e41a15027beeb4042db1d741bfaa20d1fb8b445db073df3680290523bd615915e851',
  },
};
