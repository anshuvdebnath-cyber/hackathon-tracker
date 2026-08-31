/**
 * ============================================================================
 * SECTION 34 – Input Validation with express-validator
 * ============================================================================
 * This file defines the validation rules using the `express-validator` library.
 * As taught in Section 34:
 * 1. Sanitizing and validating user inputs before controller execution protects
 *    the application from invalid states and malformed data.
 * 2. Custom validators (e.g., ensuring `endTime` occurs after `startTime`)
 *    provide domain-specific business rule checks.
 * ============================================================================
 */

import { body, param, query } from 'express-validator';

/**
 * Rules for creating a new Hackathon (POST /api/hackathons)
 */
export const createHackathonValidator = [
  // Section 34 – Name validation (required, string, trimmed, min 2 chars)
  body('name')
    .trim()
    .notEmpty().withMessage('Hackathon name is required')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),

  // Section 34 – Mode validation (enum check: 'online' or 'in-person')
  body('mode')
    .optional()
    .isIn(['online', 'in-person']).withMessage("Mode must be either 'online' or 'in-person'"),

  // Section 34 – Venue validation (optional string)
  body('venue')
    .optional()
    .trim(),

  // Section 34 – Link URL validation (optional, must be valid URL if provided)
  body('link')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Link must be a valid URL (e.g., https://hackathon.com)'),

  // Section 34 – Registration Deadline validation (ISO Date string or valid date)
  body('registrationDeadline')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Registration deadline must be a valid date/time');
      }
      return true;
    }),

  // Section 34 – Start Time validation (required valid date)
  body('startTime')
    .notEmpty().withMessage('Start time is required')
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Start time must be a valid date/time');
      }
      return true;
    }),

  // Section 34 – End Time validation (required, must be after startTime)
  body('endTime')
    .notEmpty().withMessage('End time is required')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      if (isNaN(endDate.getTime())) {
        throw new Error('End time must be a valid date/time');
      }
      if (req.body.startTime) {
        const startDate = new Date(req.body.startTime);
        if (!isNaN(startDate.getTime()) && endDate.getTime() < startDate.getTime()) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),

  // Section 34 – Outcome validation (optional enum)
  body('outcome')
    .optional()
    .isIn(['pending', 'won', 'finalist', 'participant'])
    .withMessage("Outcome must be 'pending', 'won', 'finalist', or 'participant'"),

  // Section 34 – Notes validation
  body('notes')
    .optional()
    .trim()
];

/**
 * Rules for updating an existing Hackathon (PUT /api/hackathons/:id)
 */
export const updateHackathonValidator = [
  // Section 34 – Validate route parameter ID
  param('id')
    .notEmpty().withMessage('Hackathon ID parameter is required'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Hackathon name cannot be empty')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),

  body('mode')
    .optional()
    .isIn(['online', 'in-person']).withMessage("Mode must be either 'online' or 'in-person'"),

  body('venue')
    .optional()
    .trim(),

  body('link')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Link must be a valid URL'),

  body('registrationDeadline')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Registration deadline must be a valid date/time');
      }
      return true;
    }),

  body('startTime')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Start time must be a valid date/time');
      }
      return true;
    }),

  body('endTime')
    .optional()
    .custom((value, { req }) => {
      if (!value) return true;
      const endDate = new Date(value);
      if (isNaN(endDate.getTime())) {
        throw new Error('End time must be a valid date/time');
      }
      if (req.body.startTime) {
        const startDate = new Date(req.body.startTime);
        if (!isNaN(startDate.getTime()) && endDate.getTime() < startDate.getTime()) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),

  body('outcome')
    .optional()
    .isIn(['pending', 'won', 'finalist', 'participant'])
    .withMessage("Outcome must be 'pending', 'won', 'finalist', or 'participant'")
];

/**
 * Rules for single ID lookup & deletion
 */
export const idParamValidator = [
  param('id')
    .notEmpty().withMessage('Hackathon ID is required')
];
