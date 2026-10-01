import { SubmissionStatus } from '../types';

export interface SubmissionEvaluationResult {
  status: SubmissionStatus;
  penaltyPercent: number; // 0, 10, 25
  penaltyMultiplier: number; // 0, 0.10, 0.25
  label: string;
  badgeClass: string;
  bannerClass: string;
  description: string;
  uploadAllowed: boolean;
  effectiveDeadline: Date;
  diffMinutes: number;
}

export const ONE_HOUR_MS = 60 * 60 * 1000;
export const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;
export const FORTY_EIGHT_HOURS_MS = 48 * ONE_HOUR_MS;

/**
 * Computes submission status and penalty based on timestamp vs deadline.
 * Handles boundary cases:
 * - On time: ts <= D (0% penalty)
 * - Late Band 1: D < ts <= D + 24h (10% penalty)
 * - Late Band 2: D + 24h < ts <= D + 48h (25% penalty)
 * - Closed: ts > D + 48h (upload blocked unless extension granted)
 */
export function evaluateSubmissionStatus(
  timestamp: Date | number | string,
  deadline: Date | number | string,
  extensionGranted = false,
  extendedDeadline?: Date | number | string | null
): SubmissionEvaluationResult {
  const ts = new Date(timestamp).getTime();
  const dOrig = new Date(deadline).getTime();
  
  let d = dOrig;
  let hasValidExtension = false;

  if (extensionGranted && extendedDeadline) {
    const extD = new Date(extendedDeadline).getTime();
    if (extD > dOrig) {
      d = extD;
      hasValidExtension = true;
    }
  }

  const diffMs = ts - d;
  const diffMinutes = Math.round(diffMs / (60 * 1000));
  const effectiveDeadlineDate = new Date(d);

  // Exact boundary comparison
  if (ts <= d) {
    return {
      status: 'ON_TIME',
      penaltyPercent: 0,
      penaltyMultiplier: 0,
      label: hasValidExtension ? 'On Time (Extended Deadline)' : 'On Time',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      bannerClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      description: 'Submitted within the deadline. No late submission penalty applied (0%).',
      uploadAllowed: true,
      effectiveDeadline: effectiveDeadlineDate,
      diffMinutes,
    };
  }

  if (ts <= d + TWENTY_FOUR_HOURS_MS) {
    return {
      status: 'LATE_BAND_1',
      penaltyPercent: 10,
      penaltyMultiplier: 0.1,
      label: 'Late Band 1 (0–24h)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      bannerClass: 'bg-amber-50 border-amber-300 text-amber-900',
      description: 'Submitted within 24 hours after the deadline. Standard 10% penalty applied.',
      uploadAllowed: true,
      effectiveDeadline: effectiveDeadlineDate,
      diffMinutes,
    };
  }

  if (ts <= d + FORTY_EIGHT_HOURS_MS) {
    return {
      status: 'LATE_BAND_2',
      penaltyPercent: 25,
      penaltyMultiplier: 0.25,
      label: 'Late Band 2 (24–48h)',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      bannerClass: 'bg-orange-50 border-orange-300 text-orange-900',
      description: 'Submitted between 24 and 48 hours past deadline. Significant 25% penalty applied.',
      uploadAllowed: true,
      effectiveDeadline: effectiveDeadlineDate,
      diffMinutes,
    };
  }

  // Beyond 48 hours
  return {
    status: 'CLOSED',
    penaltyPercent: 100,
    penaltyMultiplier: 1.0,
    label: 'Portal Closed (>48h)',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    bannerClass: 'bg-rose-50 border-rose-300 text-rose-900',
    description: 'Deadline exceeded by more than 48 hours. Submissions are strictly closed unless an explicit faculty extension is granted.',
    uploadAllowed: false,
    effectiveDeadline: effectiveDeadlineDate,
    diffMinutes,
  };
}

/**
 * Computes final marks = awarded * (1 - penalty), rounded to 1 decimal place.
 */
export function computeFinalMarks(awardedMarks: number, penaltyPercent: number): number {
  if (isNaN(awardedMarks) || awardedMarks < 0) return 0;
  const multiplier = Math.max(0, 1 - penaltyPercent / 100);
  const calculated = awardedMarks * multiplier;
  // Round to 1 decimal place (e.g., 63.75 -> 63.8)
  return Math.round(calculated * 10) / 10;
}

/**
 * Validates awarded marks: whole or 0.5 step, between 0 and maxMarks.
 */
export function validateAwardedMarks(marks: number, maxMarks: number): { valid: boolean; error?: string } {
  if (isNaN(marks)) {
    return { valid: false, error: 'Marks must be a valid number' };
  }
  if (marks < 0) {
    return { valid: false, error: 'Marks cannot be negative' };
  }
  if (marks > maxMarks) {
    return { valid: false, error: `Marks cannot exceed max marks of ${maxMarks}` };
  }
  // Check if multiple of 0.5: marks * 2 should be an integer
  if (Math.round(marks * 2) !== marks * 2) {
    return { valid: false, error: 'Marks must be entered in steps of 0.5 (e.g. 18.0, 18.5, 19.0)' };
  }
  return { valid: true };
}

/**
 * Validates assignment max marks: whole number between 1 and 100.
 */
export function validateMaxMarks(maxMarks: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(maxMarks) || maxMarks < 1 || maxMarks > 100) {
    return { valid: false, error: 'Max marks must be an integer between 1 and 100.' };
  }
  return { valid: true };
}

/**
 * Validates file upload: PDF, DOCX, ZIP only, max 10 MB (10 * 1024 * 1024 bytes).
 */
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.zip'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateUploadFile(file: { name: string; size: number }): { valid: boolean; error?: string } {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file format "${extension}". Only PDF, DOCX, or ZIP files are allowed.`
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10.0 MB.`
    };
  }
  return { valid: true };
}

/**
 * Calculates turnaround time in days between deadline and feedback release.
 */
export function computeTurnaroundDays(deadlineDate: string | Date | number, releaseDate: string | Date | number): number {
  const d = new Date(deadlineDate).getTime();
  const r = new Date(releaseDate).getTime();
  const diffDays = (r - d) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(diffDays * 10) / 10);
}

/**
 * Checks if Day 5 reminder should be active for faculty (5 days past deadline and not graded/released).
 */
export function isDay5ReminderDue(deadline: string | Date | number, now: string | Date | number, feedbackReleased: boolean): boolean {
  if (feedbackReleased) return false;
  const d = new Date(deadline).getTime();
  const current = new Date(now).getTime();
  const day5Ms = d + 5 * 24 * 60 * 60 * 1000;
  return current >= day5Ms;
}

/**
 * Format date in Indian Standard Time (IST).
 */
export function formatIST(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date) + ' IST';
}

export function formatISTShort(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Generates human readable countdown to deadline.
 */
export function getCountdown(deadlineInput: string | Date | number, nowInput: string | Date | number) {
  const deadline = new Date(deadlineInput).getTime();
  const now = new Date(nowInput).getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    const elapsed = Math.abs(diff);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const mins = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isPast: true,
      text: hours > 24 ? `${Math.floor(hours / 24)}d ${hours % 24}h past deadline` : `${hours}h ${mins}m past deadline`,
      severity: hours > 48 ? 'critical' : hours > 24 ? 'high' : 'warning',
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    return { isPast: false, text: `${days}d ${hours}h left`, severity: 'normal' };
  }
  if (hours > 6) {
    return { isPast: false, text: `${hours}h ${mins}m left`, severity: 'normal' };
  }
  return { isPast: false, text: `${hours}h ${mins}m ${secs}s left`, severity: 'urgent' };
}
