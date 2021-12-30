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
}

module.exports = Audit;
