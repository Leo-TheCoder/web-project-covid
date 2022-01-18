const db = require("../db/connectDB");

class Audit {
  static async audit(userid, userAction, actionMethod) {
    const time = new Date();
    db.query(
      `insert into audit(userid, user_action, action_method, action_time)
            values($1, $2, $3, $4)`,
      [userid, userAction, actionMethod, time],
      function (error, res) {
        if (error) {
          console.error(
            `Audit error ${userid}, action ${userAction}, method ${actionMethod}: `,
            error
          );
        }
      }
    );
  }

  static async GetAudit(accountid) {
    const result = await db.query(
      `select user_action, action_method, action_time from audit 
      where userid = $1 and action_method <> 'GET'
      order by action_time desc`,
      [accountid]
    )

    return result.rows;
  }
}

module.exports = Audit;
