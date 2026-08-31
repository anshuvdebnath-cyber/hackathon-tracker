/**
 * ============================================================================
 * SECTION 30 & 33 – Express Router & RESTful API Endpoints
 * ============================================================================
 * Express Router allows us to modularize our route definitions into clean,
 * maintainable routing sub-modules as taught in Section 30.
 * ============================================================================
 */

import { Router } from 'express';
import hackathonController from '../controllers/hackathonController.js';
import {
  createHackathonValidator,
  updateHackathonValidator,
  idParamValidator
} from '../validators/hackathonValidator.js';
import validate from '../middlewares/validate.js';

const router = Router();

// Section 33 – GET /api/hackathons (List with filters/sorting)
router.get('/', hackathonController.getAllHackathons);

// Reset route to restore demo state
router.post('/reset', hackathonController.resetHackathons);

// Bulk import route
router.post('/import', hackathonController.importHackathons);

// Section 33 – GET /api/hackathons/:id (Get single item)
router.get('/:id', idParamValidator, validate, hackathonController.getHackathonById);

// Section 33 & 34 – POST /api/hackathons (Create new with validation)
router.post('/', createHackathonValidator, validate, hackathonController.createHackathon);

// Section 33 & 34 – PUT /api/hackathons/:id (Update with validation)
router.put('/:id', updateHackathonValidator, validate, hackathonController.updateHackathon);

// Section 33 – DELETE /api/hackathons/:id (Delete item)
router.delete('/:id', idParamValidator, validate, hackathonController.deleteHackathon);

export default router;
