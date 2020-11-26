import { Pool } from 'query-builder-mysql';
import { GetUserDetailsParams } from '../GeneralInterFace';

export class LoginModel {
  constructor(private pool: Pool) {}
  async gerUserDetails(params: GetUserDetailsParams) {
    const db = await this.pool.get_connection();
    db.select([
      'us.user_id',
      'us.unique_id',
      'ub.name',
      'ub.gender',
      'ub.mobile_no',
      'ub.dob',
      'ub.city',
      'ub.other as user_data',
      'sd.sangh_name',
    ]);
    db.join('user_basic as ub', 'ub.user_id = us.user_id', 'left');
    if (params) {
      if (params.user_id) {
        if (Array.isArray(params.user_id)) {
          db.where_in('us.user_id', params.user_id);
        } else {
          db.where('us.user_id', params.user_id);
        }
      }
      if (params.unique_id) {
        if (Array.isArray(params.unique_id)) {
          db.where_in('us.unique_id', params.unique_id);
        } else {
          db.where('us.unique_id', params.unique_id);
        }
      }
      if (params.password) {
        if (Array.isArray(params.password)) {
          db.where_in('us.password', params.password);
        } else {
          db.where('us.password', params.password);
        }
      }
      if (params.id) {
        if (Array.isArray(params.id)) {
          db.where_in('us.user_id', params.id);
        } else {
          db.where('us.user_id', params.id);
        }
      }
    }
    db.join('sangh_details as sd', 'sd.sangh_id = ub.sangh', 'left');
    return await db.get('users as us').finally(() => {
      db.release();
    });
  }
  addRefreshTokenandMakeEntry(user: any, token: string) {
    this.pool.get_connection().then((qb) => {
      qb.insert('jwt_tokens', {
        user_id: user.user_id,
        token: token,
        created_at: Math.floor(Date.now() / 1000),
      }).then(() => {
        qb.release();
      });
    });
  }
}
