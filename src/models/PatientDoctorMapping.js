const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PatientDoctorMapping = sequelize.define(
  'PatientDoctorMapping',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    tableName: 'patient_doctor_mappings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['patientId', 'doctorId'],
        name: 'unique_patient_doctor_mapping',
      },
    ],
  }
);

module.exports = PatientDoctorMapping;
