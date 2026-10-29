const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define(
  'Doctor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Doctor name is required' },
      },
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Specialization is required' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        this.setDataValue('email', val ? val.toLowerCase().trim() : val);
      },
      validate: {
        isEmail: { msg: 'Must be a valid email' },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'doctors',
    timestamps: true,
  }
);

module.exports = Doctor;
