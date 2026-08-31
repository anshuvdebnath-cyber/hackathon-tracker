/**
 * ============================================================================
 * Frontend Vanilla JavaScript Application (public/app.js)
 * ============================================================================
 * Handles REST API communication with the Node/Express backend via fetch(),
 * dynamic DOM rendering, real-time countdown clocks, modal management,
 * and PWA Service Worker lifecycle.
 * ============================================================================
 */

// Global State
const state = {
  hackathons: [],
  currentFilter: 'all',
  searchQuery: '',
  selectedHackathon: null,
  isEditing: false,
};

// API Endpoint configuration
const API_URL = '/api/hackathons';

/**
 * ============================================================================
 * Key Function 1: Fetch all hackathons from Express REST API
 * ============================================================================
 * Sends a GET request to /api/hackathons with optional query params.
 */
async function loadHackathons() {
  try {
    const params = new URLSearchParams();
    if (state.currentFilter !== 'all') params.append('status', state.currentFilter);
    if (state.searchQuery.trim()) params.append('search', state.searchQuery.trim());

    const response = await fetch(`${API_URL}?${params.toString()}`);
    const result = await response.json();

    if (result.success) {
      state.hackathons = result.data;
      renderHackathonList();
    } else {
      console.error('API Error:', result.message);
    }
  } catch (error) {
    console.error('Failed to connect to backend server:', error);
  }
}

/**
 * ============================================================================
 * Key Function 2: Create or Update Hackathon via API
 * ============================================================================
 * Sends POST (create) or PUT (update) request with JSON payload.
 */
async function saveHackathon(payload, id = null) {
  try {
    const isUpdate = Boolean(id);
    const url = isUpdate ? `${API_URL}/${id}` : API_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      const errorMsg = result.errors ? result.errors.map(e => e.message).join(', ') : result.message;
      throw new Error(errorMsg || 'Failed to save');
    }

    await loadHackathons();
    return result.data;
  } catch (error) {
    alert('Error saving hackathon: ' + error.message);
    throw error;
  }
}

/**
 * ============================================================================
 * Key Function 3: Delete Hackathon with Confirmation
 * ============================================================================
 * Sends DELETE request to /api/hackathons/:id
 */
async function deleteHackathon(id) {
  if (!confirm('Are you sure you want to delete this hackathon?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
      await loadHackathons();
    } else {
      alert('Delete failed: ' + result.message);
    }
  } catch (error) {
    console.error('Delete request failed:', error);
  }
}

/**
 * ============================================================================
 * Key Function 4: Compute Countdown Timer
 * ============================================================================
 * Calculates Days, Hours, Minutes, Seconds until target date.
 */
function computeCountdown(targetDateStr) {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

/**
 * ============================================================================
 * Key Function 5: Render Hackathon Cards to DOM
 * ============================================================================
 */
function renderHackathonList() {
  const container = document.getElementById('hackathon-grid');
  if (!container) return;

  if (state.hackathons.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; border: 3px solid #1a1c1c; background: #fff;">
        <h3 style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; text-transform: uppercase;">NO HACKATHONS FOUND</h3>
        <p style="font-size: 14px; color: #7e775f; margin-top: 6px;">Try adjusting your filter or click "ADD EVENT" to register a new hackathon.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.hackathons.map(h => {
    const isOngoing = h.status === 'ongoing';
    const isUpcoming = h.status === 'upcoming';
    const isCompleted = h.status === 'completed';
    const cd = computeCountdown(isUpcoming ? (h.registrationDeadline || h.startTime) : h.endTime);

    return `
      <article class="neo-border neo-shadow-lg" style="background: ${isCompleted ? '#f3f3f3' : '#fff'}; display: flex; flex-direction: column;">
        <div style="border-bottom: 3px solid #1a1c1c; background: #eeeeee; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 11px; font-weight: bold; text-transform: uppercase; background: #fff; border: 2px solid #1a1c1c; padding: 2px 8px;">
            ${h.mode}
          </span>
          <span style="font-family: var(--font-mono); font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 2px 8px; border: 2px solid #1a1c1c; background: ${isOngoing ? '#ffd700' : isUpcoming ? '#ffe16d' : '#dadada'};" class="${isOngoing ? 'neo-pulse' : ''}">
            ${h.status}
          </span>
        </div>

        <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
          <h3 style="font-size: 18px; font-weight: 800; text-transform: uppercase;">${h.name}</h3>
          <div style="font-family: var(--font-mono); font-size: 12px; color: #705e00; font-weight: bold;">
            ${h.venue || 'Online / Virtual'}
          </div>

          ${h.resultsReceived && h.outcome !== 'pending' ? `
            <div style="background: ${h.outcome === 'won' ? '#ffd700' : '#fd68b3'}; border: 3px solid #1a1c1c; padding: 6px 10px; font-family: var(--font-mono); font-weight: 900; text-transform: uppercase; font-size: 12px;">
              ${h.outcome === 'won' ? '🏆 1ST PLACE WINNER' : '⭐ ' + h.outcome.toUpperCase()}
            </div>
          ` : ''}

          ${!isCompleted ? `
            <div style="margin-top: auto; padding-top: 8px;">
              <div style="font-family: var(--font-mono); font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">
                ${isOngoing ? '⏱️ HACKING ENDS IN:' : '⏳ REG CLOSES IN:'}
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center; background: #1a1c1c; padding: 6px; border: 2px solid #1a1c1c;">
                <div style="background: #fff; padding: 4px; font-family: var(--font-mono); font-weight: 800; font-size: 14px;">${String(cd.days).padStart(2, '0')}<div style="font-size: 9px; color: #666;">DAYS</div></div>
                <div style="background: #fff; padding: 4px; font-family: var(--font-mono); font-weight: 800; font-size: 14px;">${String(cd.hours).padStart(2, '0')}<div style="font-size: 9px; color: #666;">HRS</div></div>
                <div style="background: #fff; padding: 4px; font-family: var(--font-mono); font-weight: 800; font-size: 14px;">${String(cd.minutes).padStart(2, '0')}<div style="font-size: 9px; color: #666;">MIN</div></div>
                <div style="background: #fff; padding: 4px; font-family: var(--font-mono); font-weight: 800; font-size: 14px; color: #ba1a1a;">${String(cd.seconds).padStart(2, '0')}<div style="font-size: 9px; color: #666;">SEC</div></div>
              </div>
            </div>
          ` : ''}

          <div style="display: flex; gap: 8px; margin-top: 10px; border-top: 2px solid #1a1c1c; padding-top: 10px;">
            <button onclick="deleteHackathon('${h.id}')" class="neo-btn-sm" style="background: #fff; color: #ba1a1a; padding: 6px 10px; border-color: #1a1c1c;">
              DELETE
            </button>
            ${h.link ? `
              <a href="${h.link}" target="_blank" class="neo-btn-sm" style="flex: 1; text-align: center; background: #ffd700; color: #1a1c1c; text-decoration: none; padding: 6px 10px; display: flex; align-items: center; justify-content: center;">
                REGISTER LINK ↗
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Initial bootstrap
document.addEventListener('DOMContentLoaded', () => {
  loadHackathons();
  // Timer loop for real-time second ticker
  setInterval(() => {
    if (state.hackathons.length > 0) renderHackathonList();
  }, 1000);
});
