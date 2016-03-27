import Sequelize from 'sequelize';
import database from '../';
import User from './user';

const blogPostDatabaseDefinition = database.define('blog_post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    field: 'title',
    allowNull: false
  },
  link: {
    type: Sequelize.STRING,
    field: 'link',
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    field: 'description',
    allowNull: false
  },
  dateUpdated: {
    type: Sequelize.DATE,
    field: 'date_updated',
    allowNull: false
  },
  datePublished: {
    type: Sequelize.DATE,
    field: 'date_published',
    allowNull: false
  }
});

blogPostDatabaseDefinition.belongsTo(User, { as: 'author' });

export default blogPostDatabaseDefinition;
