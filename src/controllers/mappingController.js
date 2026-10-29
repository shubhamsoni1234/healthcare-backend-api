const { Patient, Doctor, PatientDoctorMapping } = require('../models');

/**
 * Assign a doctor to a patient
 */
async function createMapping(req, res, next) {
  try {
    const { patientId, doctorId } = req.body;

    const patient = await Patient.findOne({
      where: { id: patientId, userId: req.user.id },
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const doctor = await Doctor.findOne({
      where: { id: doctorId, userId: req.user.id },
    });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const existingMapping = await PatientDoctorMapping.findOne({
      where: { patientId, doctorId },
    });
    if (existingMapping) {
      return res.status(409).json({ message: 'Doctor is already assigned to this patient' });
    }

    const mapping = await PatientDoctorMapping.create({
      patientId,
      doctorId,
      userId: req.user.id,
    });

    const populatedMapping = await PatientDoctorMapping.findByPk(mapping.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
      ],
    });

    return res.status(201).json(populatedMapping || mapping);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Doctor is already assigned to this patient' });
    }
    return next(error);
  }
}

/**
 * Retrieve all patient-doctor mappings for the current user
 */
async function getMappings(req, res, next) {
  try {
    const mappings = await PatientDoctorMapping.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Patient, as: 'patient', where: { userId: req.user.id } },
        { model: Doctor, as: 'doctor', where: { userId: req.user.id } },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(mappings);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get all doctors assigned to a specific patient
 */
async function getPatientMappings(req, res, next) {
  try {
    const patientId = req.params.patient_id;

    const patient = await Patient.findOne({
      where: { id: patientId, userId: req.user.id },
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const mappings = await PatientDoctorMapping.findAll({
      where: { patientId: patient.id, userId: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          where: { userId: req.user.id },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(mappings);
  } catch (error) {
    return next(error);
  }
}

/**
 * Remove a doctor from a patient (delete mapping)
 */
async function deleteMapping(req, res, next) {
  try {
    const mapping = await PatientDoctorMapping.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    await mapping.destroy();
    return res.status(200).json({ message: 'Mapping deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createMapping,
  getMappings,
  getPatientMappings,
  deleteMapping,
};
