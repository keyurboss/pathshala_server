import { json, urlencoded } from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import { Pool } from 'query-builder-mysql';
import { GlobalVar, ISDEV, ServerData } from './variable';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createServer as http } from 'http';
import { createServer as https } from 'https';
import { getSiteBAsicDetails, get_points_details } from './generalFunctions';
import { APIsRouter } from './apis/api.router';
import { LoginRouter } from './login/login.router';

const app = express();
const consoleDev = process.argv.includes('--console');

let test: Pool;
if (ISDEV) {
  test = new Pool(GlobalVar.db_congif_dev);
  GlobalVar.token = GlobalVar.dev_token;
} else {
  test = new Pool(GlobalVar.db_congif);
  // test = new Pool(GlobalVar.db_congif);
}
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
getSiteBAsicDetails(test);
get_points_details(test);
setInterval(() => {
  getSiteBAsicDetails(test);
  get_points_details(test);
}, 10800000);

app.use('/api', APIsRouter(test));

app.post('/restart', (req, res) => {
  if (req.body.pass && req.body.pass === 'KeyurRocks') {
    setTimeout(() => {
      process.exit(1);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.use('/loginserver', LoginRouter(test));
app.use('/test', (req, res) => {
  res.send({ data: 'success' });
});
app.use('**/*', (req, res) => {
  res.sendStatus(404);
});


// if (ISDEV === false && consoleDev === false) {
//   console.log = () => {};
// }

const PORT = process.env.PORT || 80;

if (ISDEV === false) {
  const privateKey = readFileSync(
    join(__dirname, ISDEV ? '../keys/private.key' : './keys/private.key'),
    'utf8'
  );
  const certificate = readFileSync(
    join(
      __dirname,
      ISDEV ? '../keys/certificate.crt' : './keys/certificate.crt'
    ),
    'utf8'
  );

  const credentials = { key: privateKey, cert: certificate };

  https(credentials, app).listen(3001, '0.0.0.0');
  http(app).listen(3000);
} else {
  app.listen(3000, () => {
    console.log(join(__dirname, 'keys'));
    console.log(`Server is running in http://localhost:${PORT}`);
  });
}
