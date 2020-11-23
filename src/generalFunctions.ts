import { sign } from 'jsonwebtoken';
import { Pool } from 'query-builder-mysql';
import { GlobalVar, ServerData } from './varable';

export async function getSiteBAsicDetails(pool: Pool) {
  ServerData.basicsiteDetails = {};
  const db = await pool.get_connection();
  const res = await db.get('basic_details').finally(() => {
    db.release();
  });
  res.forEach((c) => {
    ServerData.basicsiteDetails[c.colum] = c.value;
  });
}

export async function get_points_details(pool: Pool) {
  const db = await pool.get_connection();
  ServerData.BasicPointDetailsArray = await db
    .order_by('id')
    .get('points_types')
    .finally(() => {
      db.release();
    });
  ServerData.BasicPointDetails = {};
  ServerData.BasicPointDetailsArray.forEach((c) => {
    ServerData.BasicPointDetails[c.id] = c;
  });
}

export function generateAccessToken(user: any) {
  return sign(user, GlobalVar.token.accessToken, { expiresIn: '1d' });
}
export function generateRefreshToken(user: any) {
  return sign(user, GlobalVar.token.refreshToken);
}
