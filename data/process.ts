import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { join } from 'path';
import { Pool } from 'query-builder-mysql';
import * as md5Convert from 'md5';

const W = /(\w)(\w*)/g;
const R = /\s{2,}/gm;
const results = [];
const sanghnames = [];
const pool = new Pool({
  host: 'server.rpsoftech.xyz',
  user: 'pathshala_server',
  password: 'JtYd#e$r%10PgRr',
  database: 'pathshala',
  connectionLimit: 5,
  idleTimeout: 10,
});
createReadStream(join(__dirname, 'dd.csv'))
  .pipe(csvParser())
  .on('data', (a) => {
      a.sangh = a.sangh.trim().replace(R, ' ').replace(W, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),

    results.push(a);
    sanghnames.push(a.sangh || '');
  })
  .on('end', () => {
    console.log(Object.keys(results[0]));
    init();
  });
async function init() {
  const db = await pool.get_connection();
  try {
    db.startTransaction();
    const tempSangh = sanghnames.map((a) => a.toUpperCase());
    let id = 2;
    const sanghs = sanghnames
      .filter((v, i, a) => tempSangh.indexOf(v.toUpperCase()) === i)
      .map((a) => {
        return {
          sangh_id: id++,
          sangh_name: a,
          other: '{}',
        };
      });
    // sangh_details
    const res = await db.insert_batch('sangh_details', sanghs, true);

    const SanghFromServer = {};
    sanghs.forEach((a) => {
      SanghFromServer[a.sangh_name.toUpperCase()] = a.sangh_id;
    });

    id = 2;
    const user_basic = [];
    const users = [];
    for (const a of results) {
      const UserA = {
        user_id: id++,
        unique_id: a.user_id,
        password: toMD5(a.password),
      };
      a.sangh = a.sangh;
      const UserDetails = {
        user_id: UserA.user_id,
        name: a.student_name,
        gender: a.gender,
        mobile_no: a.contact_no,
        dob: a.dob,
        city: a.native,
        sangh: SanghFromServer[a.sangh.toUpperCase()],
        other: JSON.stringify({
          //   email: 'keyurshah3939@gmail,com',
          alternate_no: a.whatsapp_no,
          whatsapp_no: a.whatsapp_no,
          basic_points: a.basic_points || 0,
          teacher_name: a.teacher_name,
          age: a.age || 0,
          address: a.address.replace('//n', '/n'),
          family_head_name: a.family_head_name,
          sutra_study: a.sutra_study,
          kavya_study: a.kavya_study,
          pratikraman_aavade: a.pratikraman_aavade,
          hobby: a.hobby,
          sutra_points: a.sutra_points,
          kavya_points: a.kavya_points,
        }),
      };
      user_basic.push(UserA);
    //   await db.insert('users', UserA);
      users.push(UserDetails);
    //   await db.insert('user_basic', UserDetails);
    }
    await db.insert_batch('users', user_basic);
    await db.insert_batch('user_basic', users);
    console.log('assad');
    db.commitTransaction();    
    db.release();
  } catch (e) {
    db.rollupTransaction();
    console.log(e);
  } finally {
    db.release();
    pool.disconnect();
  }
}
function toMD5(d: string): string {
  return md5Convert(d);
}
