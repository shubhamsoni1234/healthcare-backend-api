const { Patient, Doctor } = require('../models');

/**
 * Create a new patient record scoped to the logged-in user
 */
async function createPatient(req, res, next) {
  try {
    const { name, age, gender } = req.body;
    const patient = await Patient.create({
      name: name.trim(),
      age: parseInt(age, 10),
      gender: gender.trim(),
      userId: req.user.id,
    });

    return res.status(201).json(patient);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retrieve all patients created by the authenticated user
 */
async function getPatients(req, res, next) {
  try {
    const patients = await Patient.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get details of a single patient by ID
 */
async function getPatient(req, res, next) {
  try {
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: Doctor,
          as: 'assignedDoctors',
          attributes: ['id', 'name', 'specialization', 'email'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update patient information
 */
async function updatePatient(req, res, next) {
  try {
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { name, age, gender } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (age !== undefined) updates.age = parseInt(age, 10);
    if (gender !== undefined) updates.gender = gender.trim();

    await patient.update(updates);

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete a patient record
 */
async function deletePatient(req, res, next) {
  try {
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.destroy();
    return res.status(200).json({ message: 'Patient deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
