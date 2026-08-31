/**
 * ============================================================================
 * SECTION 31 & 33 – Express Controllers (MVC Architecture)
 * ============================================================================
 * Controllers handle request processing, invoke Model logic, and construct
 * clean HTTP JSON responses with appropriate status codes (200, 201, 404, etc.)
 * as taught in Section 31 (MVC Controllers) and Section 33 (RESTful API Design).
 * ============================================================================
 */

import HackathonModel from '../models/hackathon.js';

export const hackathonController = {
  /**
   * Section 33 – GET /api/hackathons
   * Fetch all hackathons with optional query params (?status=upcoming, ?search=..., ?sort=...)
   */
  async getAllHackathons(req, res, next) {
    try {
      const { status, search, sort } = req.query;
      const hackathons = HackathonModel.findAll({ status, search, sort });

      res.status(200).json({
        success: true,
        count: hackathons.length,
        data: hackathons
      });
    } catch (err) {
      next(err); // Section 34 – Pass error to global error handling middleware
    }
  },

  /**
   * Section 33 – GET /api/hackathons/:id
   * Fetch a single hackathon by its unique ID
   */
  async getHackathonById(req, res, next) {
    try {
      const { id } = req.params;
      const hackathon = HackathonModel.findById(id);

      if (!hackathon) {
        return res.status(404).json({
          success: false,
          message: `Hackathon with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        data: hackathon
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Section 33 – POST /api/hackathons
   * Create a new hackathon entry
   */
  async createHackathon(req, res, next) {
    try {
      const created = HackathonModel.create(req.body);

      // Section 33 – Return HTTP 201 Created status for resource creation
      res.status(201).json({
        success: true,
        message: 'Hackathon created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Section 33 – PUT /api/hackathons/:id
   * Update an existing hackathon by ID
   */
  async updateHackathon(req, res, next) {
    try {
      const { id } = req.params;
      const updated = HackathonModel.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Hackathon with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hackathon updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Section 33 – DELETE /api/hackathons/:id
   * Delete a hackathon by ID
   */
  async deleteHackathon(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = HackathonModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Hackathon with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hackathon deleted successfully',
        data: deleted
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/hackathons/reset
   * Reset in-memory database to initial seed data
   */
  async resetHackathons(req, res, next) {
    try {
      const resetList = HackathonModel.reset();
      res.status(200).json({
        success: true,
        message: 'Hackathons reset to initial seed data',
        count: resetList.length,
        data: resetList
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/hackathons/import
   * Bulk import hackathons from uploaded JSON array
   */
  async importHackathons(req, res, next) {
    try {
      const imported = HackathonModel.importData(req.body);
      res.status(200).json({
        success: true,
        message: `Successfully imported ${imported.length} hackathons`,
        data: imported
      });
    } catch (err) {
      next(err);
    }
  }
};

export default hackathonController;
