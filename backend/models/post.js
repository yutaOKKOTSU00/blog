import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: { len: [3, 120] },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, Infinity]
    }
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  // Use created_at and updated_at instead of createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  // Use posts as the table name
  tableName: 'posts',
  hooks: {
    beforeValidate: (post) => {
      if (post.title) {
        post.slug = post.title
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 120);
        if (!post.slug) post.slug = `post-${Date.now()}`;
      }
    },
    beforeUpdate: (post) => {
      if (post.changed('title')) {
        post.slug = post.title
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 120);
        if (!post.slug) post.slug = `post-${Date.now()}`;
      }
    },
  },
});

export default Post;
