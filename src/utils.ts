/**
 * Utility functions for Hackathon Tracker PWA
 */

import confetti from 'canvas-confetti';
import { Hackathon, ApiResponse } from './types';

// Base API URL
const API_BASE = '/api/hackathons';

/**
 * Dynamically determine the status of a hackathon:
 * - 'ongoing': Current time is between startTime and endTime
 * - 'upcoming': Current time is before startTime
 * - 'completed': Current time is after endTime
 */
export function calculateStatus(hackathon: { startTime: string; endTime: string }): 'upcoming' | 'ongoing' | 'completed' {
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
 * Fetch all hackathons from backend with optional filters
 */
export async function apiFetchHackathons(status?: string, search?: string): Promise<Hackathon[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search && search.trim()) params.append('search', search.trim());

  const url = `${API_BASE}${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  const json: ApiResponse<Hackathon[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch hackathons');
  }
  return json.data;
}

/**
 * Fetch single hackathon by ID
 */
export async function apiGetHackathon(id: string): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/${id}`);
  const json: ApiResponse<Hackathon> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Hackathon not found');
  }
  return json.data;
}

/**
 * Create new hackathon
 */
export async function apiCreateHackathon(data: Partial<Hackathon>): Promise<Hackathon> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Hackathon> = await res.json();
  if (!res.ok || !json.success) {
    const errorMsg = json.errors?.map(e => `${e.field}: ${e.message}`).join(', ') || json.message || 'Failed to create hackathon';
    throw new Error(errorMsg);
  }
  return json.data;
}

/**
 * Update existing hackathon
 */
export async function apiUpdateHackathon(id: string, data: Partial<Hackathon>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Hackathon> = await res.json();
  if (!res.ok || !json.success) {
    const errorMsg = json.errors?.map(e => `${e.field}: ${e.message}`).join(', ') || json.message || 'Failed to update hackathon';
    throw new Error(errorMsg);
  }
  return json.data;
}

/**
 * Delete hackathon by ID
 */
export async function apiDeleteHackathon(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  const json: ApiResponse<Hackathon> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete hackathon');
  }
  return true;
}

/**
 * Reset hackathons to initial seed
 */
export async function apiResetHackathons(): Promise<Hackathon[]> {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
  });
  const json: ApiResponse<Hackathon[]> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to reset hackathons');
  }
  return json.data;
}

/**
 * Bulk import hackathons
 */
export async function apiImportHackathons(items: Hackathon[]): Promise<Hackathon[]> {
  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  });
  const json: ApiResponse<Hackathon[]> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to import hackathons');
  }
  return json.data;
}

/**
 * Calculate countdown units between now and a target ISO date
 */
export function getCountdown(targetDateStr: string) {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: '00:00:00:00',
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted: `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}

/**
 * Format a human-readable date range, e.g. "Nov 12 - Nov 14, 2026"
 */
export function formatDateRange(startStr: string, endStr: string): string {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'TBD';

    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  } catch {
    return 'TBD';
  }
}

/**
 * Format single ISO string to readable string: "Nov 12, 09:00 EST"
 */
export function formatDateTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return 'TBD';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return 'TBD';
  }
}

/**
 * Format ISO to HTML datetime-local input value (YYYY-MM-DDTHH:mm)
 */
export function toDatetimeLocalValue(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

/**
 * Play celebration confetti when user marks a hackathon as winner or finalist
 */
export function triggerCelebration(outcome: string) {
  if (outcome === 'won') {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#fd68b3', '#72ebff', '#1a1c1c', '#00daf3'],
    });
  } else if (outcome === 'finalist') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#fd68b3', '#ffd700', '#1a1c1c'],
    });
  }
}

/**
 * Synthesize satisfying Neo-Brutalist 8-bit / modern web audio sound effects
 */
export function playSound(type: 'click' | 'success' | 'delete' | 'bell' | 'win') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'success' || type === 'win') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } else if (type === 'delete') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // Ignore audio context autoplay policy blocks
  }
}
