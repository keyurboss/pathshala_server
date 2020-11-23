import { urlencoded } from "body-parser";
import * as express from "express";
import * as cors from "cors";
import { Pool } from "query-builder-mysql";
import { GlobalVar, ISDEV } from "./varable";
import { readFileSync } from "fs";
import { join } from "path";
import { createServer as http } from 'http';
import { createServer as https } from 'https';

const app = express();
const consoleDev = process.argv.includes("--console");

app.use(urlencoded({ extended: true }));
app.use(cors());
let test: Pool;
if (ISDEV) {
  test = new Pool(GlobalVar.db_congif_dev);
  GlobalVar.token = GlobalVar.dev_token;
} else {
  test = new Pool(GlobalVar.db_congif_dev);
  // test = new Pool(GlobalVar.db_congif);
}




if (ISDEV === false && consoleDev === false) {
  console.log = () => {};
}

const PORT = process.env.PORT || 80;

if (ISDEV === false) {
  const privateKey = readFileSync(
    join(__dirname, ISDEV ? "../keys/private.key" : "./keys.booz/private.key"),
    "utf8"
  );
  const certificate = readFileSync(
    join(
      __dirname,
      ISDEV ? "../keys/certificate.crt" : "./keys.booz/certificate.crt"
    ),
    "utf8"
  );

  const credentials = { key: privateKey, cert: certificate };

  https(credentials, app).listen(3001, "0.0.0.0");
  http(app).listen(3000);
} else {
  app.listen(3000, () => {
    console.log(join(__dirname, "keys"));
    console.log(`Server is running in http://localhost:${PORT}`);
  });
}
