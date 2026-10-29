const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Handles both /register and /register/
router.post('/register', registerRules, validateRequest, register);
router.post('/register/', registerRules, validateRequest, register);

// Handles both /login and /login/
router.post('/login', loginRules, validateRequest, login);
router.post('/login/', loginRules, validateRequest, login);

module.exports = router;
