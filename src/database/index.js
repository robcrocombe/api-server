import Sequelize from 'sequelize';
import log from '../log';

function logSQLStatements(sqlStatement) {
  log.info({ sqlStatement }, 'SQL Statement Executed');
}

export default new Sequelize(process.env.CSBLOGS_DATABASE_NAME,
                             process.env.CSBLOGS_DATABASE_USERNAME,
                             process.env.CSBLOGS_DATABASE_PASSWORD, {
                               host: process.env.CSBLOGS_DATABASE_HOST,
                               port: process.env.CSBLOGS_DATABASE_PORT,
                               logging: process.env.CSBLOGS_DATABASE_LOG_SQL_STATEMENTS ? logSQLStatements : false,
                               dialect: 'postgres'
                             });
