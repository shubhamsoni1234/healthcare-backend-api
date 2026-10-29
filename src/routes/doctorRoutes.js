const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const controller = require('../controllers/doctorController');

const router = express.Router();

const doctorBodyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
];

const doctorUpdateValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
];

const idParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),
];

// All doctor endpoints require JWT authentication
router.use(authMiddleware);

// Collection endpoints: POST /api/doctors/ and GET /api/doctors/
router.route('/')
  .post(doctorBodyValidation, validateRequest, controller.createDoctor)
  .get(controller.getDoctors);

// Detail endpoints: /:id and /:id/
router.route('/:id')
  .get(idParamValidation, validateRequest, controller.getDoctor)
  .put(doctorUpdateValidation, validateRequest, controller.updateDoctor)
  .delete(idParamValidation, validateRequest, controller.deleteDoctor);

router.route('/:id/')
  .get(idParamValidation, validateRequest, controller.getDoctor)
  .put(doctorUpdateValidation, validateRequest, controller.updateDoctor)
  .delete(idParamValidation, validateRequest, controller.deleteDoctor);

module.exports = router;
