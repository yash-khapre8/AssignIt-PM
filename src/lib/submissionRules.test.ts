import { describe, it, expect } from 'vitest';
import {
  evaluateSubmissionStatus,
  computeFinalMarks,
  validateAwardedMarks,
  validateMaxMarks,
  validateUploadFile,
  computeTurnaroundDays,
  isDay5ReminderDue,
} from './submissionRules';

describe('Submission Rules Boundary Evaluation', () => {
  const baseDeadline = new Date('2026-10-15T18:00:00.000Z').getTime(); // Deadline D

  it('D - 1s: should evaluate to ON_TIME with 0% penalty', () => {
    const ts = baseDeadline - 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('ON_TIME');
    expect(result.penaltyPercent).toBe(0);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D (exact deadline): should evaluate to ON_TIME with 0% penalty', () => {
    const ts = baseDeadline;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('ON_TIME');
    expect(result.penaltyPercent).toBe(0);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D + 1s: should evaluate to LATE_BAND_1 with 10% penalty', () => {
    const ts = baseDeadline + 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('LATE_BAND_1');
    expect(result.penaltyPercent).toBe(10);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D + 24h: should evaluate to LATE_BAND_1 with 10% penalty', () => {
    const ts = baseDeadline + 24 * 60 * 60 * 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('LATE_BAND_1');
    expect(result.penaltyPercent).toBe(10);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D + 24h + 1s: should evaluate to LATE_BAND_2 with 25% penalty', () => {
    const ts = baseDeadline + 24 * 60 * 60 * 1000 + 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('LATE_BAND_2');
    expect(result.penaltyPercent).toBe(25);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D + 48h: should evaluate to LATE_BAND_2 with 25% penalty', () => {
    const ts = baseDeadline + 48 * 60 * 60 * 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('LATE_BAND_2');
    expect(result.penaltyPercent).toBe(25);
    expect(result.uploadAllowed).toBe(true);
  });

  it('D + 48h + 1s: should evaluate to CLOSED and block upload', () => {
    const ts = baseDeadline + 48 * 60 * 60 * 1000 + 1000;
    const result = evaluateSubmissionStatus(ts, baseDeadline);
    expect(result.status).toBe('CLOSED');
    expect(result.uploadAllowed).toBe(false);
  });

  it('D + 48h + 1s with Extension Granted: should allow upload under extended deadline', () => {
    const ts = baseDeadline + 48 * 60 * 60 * 1000 + 1000;
    const extendedDeadline = baseDeadline + 72 * 60 * 60 * 1000; // 3 days extension
    const result = evaluateSubmissionStatus(ts, baseDeadline, true, extendedDeadline);
    expect(result.status).toBe('ON_TIME');
    expect(result.penaltyPercent).toBe(0);
    expect(result.uploadAllowed).toBe(true);
  });
});

describe('Marks Calculation and Validation', () => {
  it('computes final marks with 0% penalty', () => {
    expect(computeFinalMarks(85, 0)).toBe(85.0);
  });

  it('computes final marks with 10% penalty (85 * 0.9 = 76.5)', () => {
    expect(computeFinalMarks(85, 10)).toBe(76.5);
  });

  it('computes final marks with 25% penalty and rounds to 1 decimal (85 * 0.75 = 63.75 -> 63.8)', () => {
    expect(computeFinalMarks(85, 25)).toBe(63.8);
  });

  it('validates 0.5 step mark increments', () => {
    expect(validateAwardedMarks(18.5, 20).valid).toBe(true);
    expect(validateAwardedMarks(18.0, 20).valid).toBe(true);
    expect(validateAwardedMarks(18.25, 20).valid).toBe(false);
    expect(validateAwardedMarks(22, 20).valid).toBe(false);
    expect(validateAwardedMarks(-1, 20).valid).toBe(false);
  });

  it('validates max marks whole number 1 to 100', () => {
    expect(validateMaxMarks(100).valid).toBe(true);
    expect(validateMaxMarks(50).valid).toBe(true);
    expect(validateMaxMarks(0).valid).toBe(false);
    expect(validateMaxMarks(101).valid).toBe(false);
    expect(validateMaxMarks(45.5).valid).toBe(false);
  });
});

describe('File Upload Validation', () => {
  it('accepts valid PDF, DOCX, ZIP files under 10MB', () => {
    expect(validateUploadFile({ name: 'assignment_report.pdf', size: 4 * 1024 * 1024 }).valid).toBe(true);
    expect(validateUploadFile({ name: 'code.zip', size: 9.9 * 1024 * 1024 }).valid).toBe(true);
    expect(validateUploadFile({ name: 'answers.docx', size: 1 * 1024 * 1024 }).valid).toBe(true);
  });

  it('rejects files larger than 10MB', () => {
    const res = validateUploadFile({ name: 'large.zip', size: 10.5 * 1024 * 1024 });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('exceeds maximum');
  });

  it('rejects invalid file types', () => {
    const res = validateUploadFile({ name: 'script.py', size: 1024 });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Only PDF, DOCX, or ZIP files are allowed');
  });
});

describe('Turnaround and Reminder Rules', () => {
  it('computes turnaround days accurately', () => {
    const deadline = '2026-10-01T12:00:00Z';
    const release = '2026-10-06T18:00:00Z'; // 5.25 days -> 5.3 days
    expect(computeTurnaroundDays(deadline, release)).toBe(5.3);
  });

  it('triggers Day 5 reminder when current date is at or past Day 5', () => {
    const deadline = new Date('2026-10-01T00:00:00Z').getTime();
    const day4 = deadline + 4 * 24 * 60 * 60 * 1000;
    const day5 = deadline + 5 * 24 * 60 * 60 * 1000;
    expect(isDay5ReminderDue(deadline, day4, false)).toBe(false);
    expect(isDay5ReminderDue(deadline, day5, false)).toBe(true);
    expect(isDay5ReminderDue(deadline, day5, true)).toBe(false); // already released
  });
});
