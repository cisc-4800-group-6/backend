const SqlString = require("sqlstring");

/** Escapes a string for use with sqlite and removes the '' at the ends
 * @param {string} sqlString The string to escape.
 * @returns {string} An escaped string.
 */
const escapeSqlString = (sqlString) => {
  return SqlString.escape(sqlString).replace("'", "").replace("'", "");
};

module.exports = { escapeSqlString };
