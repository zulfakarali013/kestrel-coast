// Grades a touchdown 0 to 100 and names it, from "Greaser" to "Hard landing".
import * as THREE from 'three';
import { LANDING, MS_TO_KT } from '../core/config.js';
import { toRunway } from '../airfields/runway-frame.js';

// Grade a touchdown 0..100: sink rate, centreline, distance past the threshold, bank.
export function gradeLanding(td, field) {
  const p = toRunway(field, td.x, td.z);
  const fromThreshold = p.along + field.length / 2;
  const sinkFpm = td.sink * 196.85;
  const sinkPts = Math.max(0, 40 - Math.max(0, sinkFpm - 120) * 0.12);
  const linePts = Math.max(0, 25 - Math.abs(p.across) * 2);
  const zonePts = fromThreshold >= 0 && fromThreshold < field.length * 0.35 ? 25 : Math.max(0, 25 - Math.abs(fromThreshold - field.length * 0.2) * 0.08);
  const bankPts = Math.max(0, 10 - Math.abs(td.bank) * 57.3);
  return { total: Math.round(sinkPts + linePts + zonePts + bankPts), sinkFpm: Math.round(sinkFpm), across: p.across, fromThreshold: Math.round(fromThreshold) };
}

export function describeTouchdown(l) {
  if (!l) return '';
  if (l.sinkFpm < 200) return 'Greaser';
  if (l.sinkFpm < 400) return 'Firm but fine';
  if (l.sinkFpm < LANDING.maxSinkSafe * 196.85) return 'Arrival';
  return 'Hard landing';
}

export function speedKt(v) { return Math.round(v * MS_TO_KT); }
