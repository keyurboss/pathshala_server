import { Router } from 'express';
import { verify } from 'jsonwebtoken';
import { Pool } from 'query-builder-mysql';
import { GlobalVar, ServerData } from '../varable';
import { APIsModel } from './api.model';
export function APIsRouter(pool: Pool): Router {
  const route = Router();
  const ApiModelObject = new APIsModel(pool);
  route.use(authenticateToken);
  route.get('/islogin', (req, res) => {
    res.send({
      success: 1,
    });
  });
  route.get('/basicdetails', (req, res) => {
    res.send(ServerData.basicsiteDetails);
  });
  route.get('/points_details', (req, res) => {
    res.send(ServerData.BasicPointDetailsArray);
  });
  route.get('/mydetails', (req, res) => {
    res.send({ success: 1, data: res.locals.user });
  });
  route.post('/submit', async (req, res) => {
    const data = req.body;
    if (
      data.year &&
      data.month &&
      data.day &&
      data.point_type &&
      data.details &&
      data.timestamp
    ) {
      const db = await pool.get_connection();
      try {
        if (data.point_type === 3) {
          if (new Date(data.timestamp * 1000).getDay() !== 6) {
            new Error('Date');
          }
        }
        const time = Math.floor(Date.now() / 1000);
        const preApproved =
          ServerData.BasicPointDetails[data.point_type].details.pre_approved;
        const insert_data = {
          user_id: res.locals.user.user_id,
          day: data.day,
          month: data.month,
          year: data.year,
          point_type: data.point_type,
          status: preApproved ? 4 : 2,
          points: preApproved
            ? ApiModelObject.calculateData(data.details, data.point_type)
            : 0,
          timestamp: data.timestamp,
          details: data.details,
          created_on: time,
          edited_on: time,
        };
        let result;
        if (data.update && data.update === true && data.id) {
          delete insert_data.created_on;
          delete insert_data.month;
          delete insert_data.day;
          delete insert_data.year;
          delete insert_data.timestamp;
          result = await db.update('points_main', insert_data, {
            user_id: res.locals.user.user_id,
            status: 2,
            id: data.id,
          });
        } else {
          result = await db.insert('points_main', insert_data, true);
        }
        db.release();
        if (result.affectedRows && result.affectedRows > 0) {
          res.send({
            success: 1,
          });
        } else {
          res.send({
            success: 0,
          });
        }
      } catch (e) {
        db.release();
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  });
  route.get('/mypoints', async (req, res) => {
    try {
      let data = req.query;
      if (!data.nolimit && (!data.stream || !data.limit)) {
        throw new Error('Please send limit and stream');
      }
      if (data.group_by && typeof data.group_by === 'string') {
        data.group_by = JSON.parse(data.group_by);
      }
      data.user_id = res.locals.user.user_id;
      const result = await ApiModelObject.FetchPoints(data);
      res.send({
        success: 1,
        data: result,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

  return route;
}
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token1 = authHeader && authHeader.split(' ')[1];
  if (token1 == null) return res.sendStatus(401);

  verify(token1, GlobalVar.token.accessToken, (err, user) => {
    if (err) return res.sendStatus(403);
    res.locals = { user: user };
    next();
  });
}
