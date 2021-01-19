import { Pool } from 'query-builder-mysql';
import { ServerData } from '../variable';
import { CalculateDataint, FetchPointsInterFace } from '../GeneralInterFace';

export class APIsModel {
  constructor(private pool: Pool) {}z
  calculateData = (
    data: CalculateDataint | CalculateDataint[],
    type: number
  ) => {
    try {
      const details = ServerData.BasicPointDetails[type].details;
      let points = 0;
      if (type === 1 || type === 2) {
        if (!Array.isArray(data)) {
          throw new Error('s');
        }
        const multi = details.points;
        data.forEach((i) => (points += i.no_gatha * multi));
      }
      data = data as CalculateDataint;
      if (type === 4) {
        if (data.done) {
          points = details.points;
        }
      }
      if (type === 3) {
        if (data.done && data.day) {
          if (details.min_days) {
            if (details.perday && data.day >= details.min_days) {
              points = details.points * data.day;
            } else if (!details.perday) {
              points = details.points;
            }
          } else {
            points = details.points;
          }
        }
      }
      return points;
    } catch (e) {
      console.log(e);
      return 0;
    }
  };
  async FetchPoints(data: FetchPointsInterFace) {
    const db = await this.pool.get_connection();
    try {
      db.select(['user_id']);
      if (data.group_by) {
        db.select('SUM(points) as point', false);
        db.group_by('user_id');
        if (data.group_by.type) {
          db.select(
            'SUM(IF(point_type = 1,points*1,points*0)) as sutra',
            false
          );
          db.select(
            'SUM(IF(point_type = 2,points*1,points*0)) as kavya',
            false
          );
          db.select('SUM(IF(point_type = 3,points*1,points*0)) as week', false);
          db.select(
            'SUM(IF(point_type = 4,points*1,points*0)) as daily',
            false
          );
        }
        if (data.group_by.day) {
          db.group_by('day');
          db.select('day');
        }
        if (data.group_by.month) {
          db.group_by('month');
          db.select('month');
        }
        if (data.group_by.year) {
          db.group_by('year');
          db.select('year');
        }
        if (data.group_by.status) {
          db.group_by('status');
          db.select('status');
        }
        if (data.fetch_to_display) {
          db.select('SUM(IF(status = 3,points*1,points*0)) as rejected', false);
          db.select('SUM(IF(status = 4,points*1,points*0)) as approved', false);
        }
        // db.where('','')
      } else {
        db.select([
          'day',
          'month',
          'year',
          'point_type',
          'status',
          'pm.details',
          'points',
        ]);
      }
      if (data.order_by) {
        if (data.order_by === 'desc') {
          db.order_by('timestamp', 'desc');
        } else {
          db.order_by('timestamp');
        }
        if (data.group_by) {
          db.select('MAX(timestamp) as timestamp', false);
        }
      }
      if (typeof data.nolimit === 'undefined') {
        db.limit(data.limit, data.limit * (data.stream - 1));
      }
      if (data.status) {
        if (Array.isArray(data.status)) {
          db.where_in('pm.status', data.status);
        } else {
          db.where('pm.status', data.status);
        }
      }
      if (data.user_id) {
        if (Array.isArray(data.user_id)) {
          db.where_in('pm.user_id', data.user_id);
        } else {
          db.where('pm.user_id', data.user_id);
        }
      }
      if (data.month) {
        if (Array.isArray(data.month)) {
          db.where_in('pm.month', data.month);
        } else {
          db.where('pm.month', data.month);
        }
      }
      if (data.day) {
        if (Array.isArray(data.day)) {
          db.where_in('pm.day', data.day);
        } else {
          db.where('pm.day', data.day);
        }
      }
      if (data.year) {
        if (Array.isArray(data.year)) {
          db.where_in('pm.year', data.year);
        } else {
          db.where('pm.year', data.year);
        }
      }
      if (data.point_type) {
        if (Array.isArray(data.point_type)) {
          db.where_in('pm.point_type', data.point_type);
        } else {
          db.where('pm.point_type', data.point_type);
        }
      }
      return db.get('points_main as pm').finally(() => {
        db.release();
      });
    } catch (e) {
      console.log(e);
      db.release();
      throw e;
    }
  }
}
