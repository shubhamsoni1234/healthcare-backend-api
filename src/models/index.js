const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const PatientDoctorMapping = require('./PatientDoctorMapping');

// User <-> Patient (1:N)
User.hasMany(Patient, { foreignKey: 'userId', as: 'patients', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Doctor (1:N)
User.hasMany(Doctor, { foreignKey: 'userId', as: 'doctors', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> PatientDoctorMapping (1:N)
User.hasMany(PatientDoctorMapping, { foreignKey: 'userId', as: 'mappings', onDelete: 'CASCADE' });
PatientDoctorMapping.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Patient <-> PatientDoctorMapping (1:N)
Patient.hasMany(PatientDoctorMapping, { foreignKey: 'patientId', as: 'assignments', onDelete: 'CASCADE' });
PatientDoctorMapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// Doctor <-> PatientDoctorMapping (1:N)
Doctor.hasMany(PatientDoctorMapping, { foreignKey: 'doctorId', as: 'assignments', onDelete: 'CASCADE' });
PatientDoctorMapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// Patient <-> Doctor (N:M through PatientDoctorMapping)
Patient.belongsToMany(Doctor, {
  through: PatientDoctorMapping,
  foreignKey: 'patientId',
  otherKey: 'doctorId',
  as: 'assignedDoctors',
});

Doctor.belongsToMany(Patient, {
  through: PatientDoctorMapping,
  foreignKey: 'doctorId',
  otherKey: 'patientId',
  as: 'assignedPatients',
});

module.exports = {
  User,
  Patient,
  Doctor,
  PatientDoctorMapping,
};
