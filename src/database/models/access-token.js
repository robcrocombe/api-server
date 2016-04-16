import Sequelize from 'sequelize';
import database from '../';
import User from './user';

const accessTokenDatabaseDefinition = database.define('access_token', {
  token: {
    type: Sequelize.STRING,
    field: 'token',
    primaryKey: true,
    allowNull: false
  },
  dateExpires: {
    type: Sequelize.DATE,
    field: 'date_expires',
    allowNull: false
  }
});

accessTokenDatabaseDefinition.belongsTo(User, { as: 'user' });

export default accessTokenDatabaseDefinition;
