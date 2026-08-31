/**
 * ============================================================================
 * SECTION 31 & 32 – Node.js & Express Data Model (In-Memory Storage)
 * ============================================================================
 * This file serves as the data layer for our Hackathon Tracker application.
 * In accordance with Section 31 (MVC Architecture) and Section 32 (Data Persistence),
 * we encapsulate all data manipulation logic inside a dedicated Model.
 *
 * NOTE on Storage:
 * - Primary storage: In-memory JavaScript Array (`hackathons`)
 * - Secondary/Optional: Local JSON file persistence via Node's `fs` module
 *   so that data can survive dev server restarts while remaining lightweight.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

// Define the file path for optional local JSON file persistence
const DATA_FILE = path.join(process.cwd(), 'data', 'hackathons.json');

// Helper to compute realistic dynamic dates relative to today
const now = new Date();
const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const subtractDays = (d, days) => new Date(d.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

// Section 32 – Initial Seed Data (matching the Neo-Brutalist design themes)
const initialSeedHackathons = [
  {
    id: 'hk-01',
    name: 'AI Innovation Hack 2026',
    mode: 'online',
    venue: 'Discord & Virtual Portal',
    link: 'https://ai-innovation.devpost.com',
    registrationDeadline: addDays(now, 3), // closes in 3 days
    startTime: addDays(now, 5),
    endTime: addDays(now, 7),
    tags: ['AI', 'Python', 'Gemini', 'Vite'],
    resultsReceived: false,
    outcome: 'pending',
    notes: 'Building an autonomous agent for intelligent developer productivity. Team of 3.',
    createdAt: subtractDays(now, 4),
    updatedAt: subtractDays(now, 1)
  },
  {
    id: 'hk-02',
    name: 'Web3 Innovators Summit',
    mode: 'online',
    venue: 'San Francisco & Worldwide Discord',
    link: 'https://web3innovators.io',
    registrationDeadline: subtractDays(now, 1),
    startTime: subtractDays(now, 0.5), // Ongoing right now!
    endTime: addDays(now, 1.5),
    tags: ['Solidity', 'React', 'Ethereum', 'DeFi'],
    resultsReceived: false,
    outcome: 'pending',
    notes: 'Build next-gen decentralized applications focusing on Layer 2 scalability.',
    createdAt: subtractDays(now, 10),
    updatedAt: subtractDays(now, 0.5)
  },
  {
    id: 'hk-03',
    name: 'FinTech Disruption Jam',
    mode: 'in-person',
    venue: 'Metropolitan Tech Center, NYC',
    link: 'https://fintechjam.org',
    registrationDeadline: subtractDays(now, 20),
    startTime: subtractDays(now, 15),
    endTime: subtractDays(now, 13),
    tags: ['FinTech', 'Node.js', 'PostgreSQL', 'Stripe'],
    resultsReceived: true,
    outcome: 'finalist',
    notes: 'Redesigning micro-transactions for emerging markets. Selected for demo day pitch!',
    createdAt: subtractDays(now, 25),
    updatedAt: subtractDays(now, 12)
  },
  {
    id: 'hk-04',
    name: 'Global DefHack 2026',
    mode: 'online',
    venue: 'Global Discord',
    link: 'https://defhack.io',
    registrationDeadline: addDays(now, 8),
    startTime: addDays(now, 12),
    endTime: addDays(now, 14),
    tags: ['Security', 'Rust', 'Cloud', 'Zero-Trust'],
    resultsReceived: false,
    outcome: 'pending',
    notes: 'Zero-trust architecture challenge with $50k prize pool.',
    createdAt: subtractDays(now, 2),
    updatedAt: subtractDays(now, 2)
  },
  {
    id: 'hk-05',
    name: 'Climate Tech Sprint',
    mode: 'in-person',
    venue: 'Austin Convention Center',
    link: 'https://climatetech.green',
    registrationDeadline: subtractDays(now, 40),
    startTime: subtractDays(now, 35),
    endTime: subtractDays(now, 33),
    tags: ['IoT', 'Python', 'Sensors', 'GreenTech'],
    resultsReceived: true,
    outcome: 'won',
    notes: 'Won 1st Place ($10,000) for carbon emission sensor network visualization.',
    createdAt: subtractDays(now, 45),
    updatedAt: subtractDays(now, 32)
  }
];

// Section 31 – In-Memory Array initialization
let hackathons = [...initialSeedHackathons];

// Section 32 – Helper to persist data to local JSON file
function saveToDisk() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(hackathons, null, 2), 'utf-8');
  } catch (err) {
    // In serverless / read-only environments like Vercel, ignore filesystem write errors
    console.warn('Notice: Local JSON file write skipped (in-memory storage active).');
  }
}

// Section 32 – Helper to load data from local JSON file if present
function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        hackathons = parsed;
      }
    }
  } catch (err) {
    console.warn('Notice: Could not load data from disk, using seed memory array.');
  }
}

// Initialize on module load
loadFromDisk();

/**
 * Helper to dynamically determine the status of a hackathon:
 * - 'ongoing': Current time is between startTime and endTime
 * - 'upcoming': Current time is before startTime
 * - 'completed': Current time is after endTime
 */
export function calculateStatus(hackathon) {
  const currentTime = new Date().getTime();
  const start = new Date(hackathon.startTime).getTime();
  const end = new Date(hackathon.endTime).getTime();

  if (currentTime >= start && currentTime <= end) {
    return 'ongoing';
  } else if (currentTime < start) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

/**
 * ============================================================================
 * Section 31 – Model Methods (CRUD Operations)
 * ============================================================================
 */

export const HackathonModel = {
  /**
   * GET ALL Hackathons with optional status filter, search keyword, and sorting
   */
  findAll({ status, search, sort = 'startTime' } = {}) {
    let result = hackathons.map(h => ({
      ...h,
      status: calculateStatus(h)
    }));

    // Filter by status tab (upcoming, ongoing, completed)
    if (status && status !== 'all') {
      result = result.filter(h => h.status === status.toLowerCase());
    }

    // Filter by search query (name, venue, notes, tags)
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      result = result.filter(h =>
        h.name.toLowerCase().includes(query) ||
        (h.venue && h.venue.toLowerCase().includes(query)) ||
        (h.notes && h.notes.toLowerCase().includes(query)) ||
        (h.tags && h.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Sort hackathons (default: by startTime ascending)
    result.sort((a, b) => {
      if (sort === 'startTime') {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      } else if (sort === 'registrationDeadline') {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      } else if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  },

  /**
   * GET Single Hackathon by ID
   */
  findById(id) {
    const item = hackathons.find(h => h.id === id);
    if (!item) return null;
    return {
      ...item,
      status: calculateStatus(item)
    };
  },

  /**
   * CREATE New Hackathon
   */
  create(data) {
    const newId = `hk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newHackathon = {
      id: newId,
      name: data.name.trim(),
      mode: data.mode === 'in-person' ? 'in-person' : 'online',
      venue: data.venue ? data.venue.trim() : '',
      link: data.link ? data.link.trim() : '',
      registrationDeadline: data.registrationDeadline || data.startTime,
      startTime: data.startTime,
      endTime: data.endTime,
      tags: Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      resultsReceived: Boolean(data.resultsReceived === true || data.resultsReceived === 'yes' || data.resultsReceived === 'true'),
      outcome: data.outcome || 'pending',
      notes: data.notes ? data.notes.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    hackathons.unshift(newHackathon);
    saveToDisk();

    return {
      ...newHackathon,
      status: calculateStatus(newHackathon)
    };
  },

  /**
   * UPDATE Existing Hackathon
   */
  update(id, data) {
    const index = hackathons.findIndex(h => h.id === id);
    if (index === -1) return null;

    const existing = hackathons[index];
    const updated = {
      ...existing,
      name: data.name !== undefined ? data.name.trim() : existing.name,
      mode: data.mode !== undefined ? (data.mode === 'in-person' ? 'in-person' : 'online') : existing.mode,
      venue: data.venue !== undefined ? data.venue.trim() : existing.venue,
      link: data.link !== undefined ? data.link.trim() : existing.link,
      registrationDeadline: data.registrationDeadline !== undefined ? data.registrationDeadline : existing.registrationDeadline,
      startTime: data.startTime !== undefined ? data.startTime : existing.startTime,
      endTime: data.endTime !== undefined ? data.endTime : existing.endTime,
      tags: data.tags !== undefined
        ? (Array.isArray(data.tags) ? data.tags : typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : existing.tags)
        : existing.tags,
      resultsReceived: data.resultsReceived !== undefined
        ? Boolean(data.resultsReceived === true || data.resultsReceived === 'yes' || data.resultsReceived === 'true')
        : existing.resultsReceived,
      outcome: data.outcome !== undefined ? data.outcome : existing.outcome,
      notes: data.notes !== undefined ? data.notes.trim() : existing.notes,
      updatedAt: new Date().toISOString()
    };

    hackathons[index] = updated;
    saveToDisk();

    return {
      ...updated,
      status: calculateStatus(updated)
    };
  },

  /**
   * DELETE Hackathon by ID
   */
  delete(id) {
    const index = hackathons.findIndex(h => h.id === id);
    if (index === -1) return false;

    const deleted = hackathons.splice(index, 1)[0];
    saveToDisk();
    return deleted;
  },

  /**
   * RESET all data to default initial seed
   */
  reset() {
    hackathons = [...initialSeedHackathons];
    saveToDisk();
    return this.findAll();
  },

  /**
   * IMPORT bulk data (replaces or appends)
   */
  importData(dataArray) {
    if (!Array.isArray(dataArray)) {
      throw new Error('Data to import must be an array of hackathon objects.');
    }
    hackathons = dataArray.map(item => ({
      id: item.id || `hk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name || 'Untitled Hackathon',
      mode: item.mode === 'in-person' ? 'in-person' : 'online',
      venue: item.venue || '',
      link: item.link || '',
      registrationDeadline: item.registrationDeadline || new Date().toISOString(),
      startTime: item.startTime || new Date().toISOString(),
      endTime: item.endTime || new Date().toISOString(),
      tags: Array.isArray(item.tags) ? item.tags : [],
      resultsReceived: Boolean(item.resultsReceived),
      outcome: item.outcome || 'pending',
      notes: item.notes || '',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    saveToDisk();
    return this.findAll();
  }
};

export default HackathonModel;
