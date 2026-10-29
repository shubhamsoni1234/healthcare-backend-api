const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const controller = require('../controllers/patientController');

const router = express.Router();

const patientBodyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be a valid non-negative number between 0 and 150'),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required'),
];

const patientUpdateValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Gender cannot be empty'),
];

const idParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer'),
];

// All routes require authentication
router.use(authMiddleware);

// Collection endpoints
router.route('/')
  .post(patientBodyValidation, validateRequest, controller.createPatient)
  .get(controller.getPatients);

// Item endpoints (supports /:id and /:id/)
router.route('/:id')
  .get(idParamValidation, validateRequest, controller.getPatient)
  .put(patientUpdateValidation, validateRequest, controller.updatePatient)
  .delete(idParamValidation, validateRequest, controller.deletePatient);

router.route('/:id/')
  .get(idParamValidation, validateRequest, controller.getPatient)
  .put(patientUpdateValidation, validateRequest, controller.updatePatient)
  .delete(idParamValidation, validateRequest, controller.deletePatient);

module.exports = router;
