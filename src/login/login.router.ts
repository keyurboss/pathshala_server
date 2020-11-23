import { Router } from 'express';
import { verify } from 'jsonwebtoken';
import { Pool } from 'query-builder-mysql';
import { GlobalVar } from '../varable';
import { generateAccessToken, generateRefreshToken } from '../generalFunctions';
import { LoginModel } from './login.model';
export function LoginRouter(pool: Pool): Router {
  const route = Router();
  const LoginModelObject = new LoginModel(pool);
  route.post('/login', (req, res) => {
    let data = req.body;
    if (data.id && data.password) {
      LoginModelObject.gerUserDetails(data)
        .then((result) => {
          if (result.length > 0) {
            res.locals = {
              success: 1,
              data: result[0],
            };
            let user = result[0];
            const token = generateAccessToken(user);
            res.locals.data.accessToken = token;
            res.locals.data.refreshToken = generateRefreshToken(user);
            LoginModelObject.addRefreshTokenandMakeEntry(
              user,
              res.locals.data.refreshToken
            );
            res.send(res.locals);
          } else {
            res.send({ success: 0 });
          }
        })
        .catch((err) => res.send({ success: 0, error: err }));
    } else {
      res.send({
        success: 0,
      });
    }
  });
  route.post('/refreshaceesstoken', (req, res) => {
    let data = req.body;
    if (data.token && typeof data.token !== 'undefined') {
      verify(data.token, GlobalVar.token.refreshToken, (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);
        LoginModelObject.gerUserDetails(user)
          .then((result) => {
            if (result.length > 0) {
              res.locals = {
                success: 1,
                data: result[0],
              };
              let user = JSON.parse(JSON.stringify(result[0]));
              res.locals.data.accessToken = generateAccessToken(user);
              res.send(res.locals);
            } else {
              res.send({ success: 0 });
            }
          })
          .catch(() => {
            res.sendStatus(403);
          });
      });
    } else {
      res.sendStatus(401);
    }
  });

  return route;
}
