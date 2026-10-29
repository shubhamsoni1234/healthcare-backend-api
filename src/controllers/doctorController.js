const { Doctor, Patient } = require('../models');

/**
 * Register a new doctor record under the current authenticated user
 */
async function createDoctor(req, res, next) {
  try {
    const { name, specialization, email } = req.body;
    const doctor = await Doctor.create({
      name: name.trim(),
      specialization: specialization.trim(),
      email: email.trim().toLowerCase(),
      userId: req.user.id,
    });

    return res.status(201).json(doctor);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retrieve doctors created by the authenticated user
 */
async function getDoctors(req, res, next) {
  try {
    const doctors = await Doctor.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(doctors);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retrieve a specific doctor by ID
 */
async function getDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: Patient,
          as: 'assignedPatients',
          attributes: ['id', 'name', 'age', 'gender'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update doctor details
 */
async function updateDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { name, specialization, email } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (specialization !== undefined) updates.specialization = specialization.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();

    await doctor.update(updates);

    return res.status(200).json(doctor);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete a doctor record
 */
async function deleteDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.destroy();
    return res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
