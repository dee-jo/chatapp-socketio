

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    port: '5432',
    user : 'postgres',
    password : 'postgres',
    database : 'chat_app_new1'
  }
});

const checkIfConnected = (userName) => {
  knex('users')
  .where({name: userName}).select('userid', 'connected')
  .then(rows => {
    return rows.length ? rows[0].connected : false;
  })
  .catch(err => {
    console.error('knex returned error: ', err);
    return false
  })
}

const signupNewUser = ({username, password}) => {
  return new Promise((resolve, reject) => {
    knex('users')
    .where({name: username})
    .then(rows => {
      return rows.length 
        ? reject(new Error('User already exists!, db res: ', rows))
        : rows
    })
    .then(rows => {
      console.log('User doesn\'t exist, inserting into db');
      const userid = v4();
      knex('users')
      .insert({
        userid: userid,
        name: username,
        connected: false
      })
      .returning('userid')
      .then(rows, err => {
        return rows.length 
          ? rows[0].userid 
          : reject(new Error('DB error while inserting new user, error: ', err))
      })
      .then(userid => {
        console.log('userid returned from db after inserting user: userid', userid);
        const saltRounds = 10;
        return new Promise((resolveHash, rejectHash) => {
          bcrypt.hash(password, saltRounds, 
            (err, hash) => {
              return err 
                ? rejectHash(new Error(`[DBqueries@44]: couldn't hash user's password, error: ${err}`))
                : resolveHash({userid, hash});
          });
        })
        .then({userid, hash}, error => {
          const query = `INSERT INTO auth (userid, userhash) VALUES ('${userid}', '${hash}') RETURNING userid;`;
          return error 
            ? reject(new Error(error))
            : knex('auth')
              .insert({
                userid: userid,
                userhash: hash
              })
              .returning('userid')
              .then(rows, error => {
                return error 
                  ? reject(new Error(error))
                  : resolve(rows[0].userid);
              })
        })
      })
    })

  })
}



