const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const controller = require('../controllers/mappingController');

const router = express.Router();

// Require JWT for all mapping routes
router.use(authMiddleware);

const createMappingRules = [
  body('patientId')
    .isInt({ min: 1 })
    .withMessage('A valid positive patientId is required'),
  body('doctorId')
    .isInt({ min: 1 })
    .withMessage('A valid positive doctorId is required'),
];

const patientIdParamRules = [
  param('patient_id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer'),
];

const mappingIdParamRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Mapping ID must be a positive integer'),
];

// /api/mappings/
router.route('/')
  .post(createMappingRules, validateRequest, controller.createMapping)
  .get(controller.getMappings);

// /api/mappings/:patient_id and /api/mappings/:patient_id/
router.get('/:patient_id', patientIdParamRules, validateRequest, controller.getPatientMappings);
router.get('/:patient_id/', patientIdParamRules, validateRequest, controller.getPatientMappings);

// /api/mappings/:id and /api/mappings/:id/
router.delete('/:id', mappingIdParamRules, validateRequest, controller.deleteMapping);
router.delete('/:id/', mappingIdParamRules, validateRequest, controller.deleteMapping);

module.exports = router;
