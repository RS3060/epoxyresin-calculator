import { calculateEpoxy, toCm, formatNum } from '../src/lib/resinCalculator.ts';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
}

console.log('--- Testing Unit Conversions ---');
assert(toCm(10, 'cm') === 10, '10 cm is 10 cm');
assert(toCm(100, 'mm') === 10, '100 mm is 10 cm');
assert(toCm(1, 'm') === 100, '1 m is 100 cm');
assert(Math.abs(toCm(10, 'in') - 25.4) < 1e-6, '10 inches is 25.4 cm');
assert(Math.abs(toCm(1, 'ft') - 30.48) < 1e-6, '1 foot is 30.48 cm');

console.log('--- Testing Shape 1: Rectangle / Serving Tray ---');
// 30 x 30 x 1 cm tray, exact (0% wastage), 2:1 volume ratio
const trayExact = calculateEpoxy({
  shape: 'rectangle',
  length: 30,
  width: 30,
  depth: 1,
  unit: 'cm',
  wastagePercent: 0,
  ratioA: 2,
  ratioB: 1,
  splitMode: 'volume'
});
assert(trayExact.rawVolumeMl === 900, 'Raw volume of 30x30x1 cm is 900 ml');
assert(trayExact.totalVolumeMl === 900, 'Total volume is 900 ml with 0% margin');
assert(trayExact.partAVolumeMl === 600, 'Part A is 600 ml for 2:1 volume split');
assert(trayExact.partBVolumeMl === 300, 'Part B is 300 ml for 2:1 volume split');
assert(Math.abs(trayExact.partAWeightG - 690) < 1e-6, 'Part A weight is 600 * 1.15 = 690 g');
assert(Math.abs(trayExact.partBWeightG - 300) < 1e-6, 'Part B weight is 300 * 1.00 = 300 g');

// 30 x 30 x 1 cm tray with 10% wastage
const trayWithMargin = calculateEpoxy({
  shape: 'rectangle',
  length: 30,
  width: 30,
  depth: 1,
  unit: 'cm',
  wastagePercent: 10,
  ratioA: 2,
  ratioB: 1,
  splitMode: 'volume'
});
assert(Math.abs(trayWithMargin.totalVolumeMl - 990) < 1e-6, 'Total volume is 990 ml with 10% margin');
assert(Math.abs(trayWithMargin.partAVolumeMl - 660) < 1e-6, 'Part A is 660 ml with 10% margin');
assert(Math.abs(trayWithMargin.partBVolumeMl - 330) < 1e-6, 'Part B is 330 ml with 10% margin');

console.log('--- Testing Shape 2: Circle / Round Table ---');
// Circle diameter = 60 cm (radius = 30 cm), depth = 0.6 cm
const roundTable = calculateEpoxy({
  shape: 'circle',
  diameter: 60,
  depth: 0.6,
  unit: 'cm',
  wastagePercent: 0,
  ratioA: 1,
  ratioB: 1,
  splitMode: 'volume'
});
const expectedCircleVol = Math.PI * 30 * 30 * 0.6;
assert(Math.abs(roundTable.rawVolumeMl - expectedCircleVol) < 1e-6, 'Circle volume matches pi * r^2 * depth');
assert(Math.abs(roundTable.partAVolumeMl - expectedCircleVol / 2) < 1e-6, '1:1 ratio splits volume equally');

console.log('--- Testing Shape 3: Oval / Ellipse ---');
// Oval length = 40, width = 20, depth = 1 cm
const oval = calculateEpoxy({
  shape: 'oval',
  length: 40,
  width: 20,
  depth: 1,
  unit: 'cm',
  wastagePercent: 0,
  ratioA: 1,
  ratioB: 1,
  splitMode: 'volume'
});
const expectedOvalVol = Math.PI * 20 * 10 * 1;
assert(Math.abs(oval.rawVolumeMl - expectedOvalVol) < 1e-6, 'Oval volume matches pi * a * b * depth');

console.log('--- Testing Shape 4: River Table ---');
// Length = 120 cm, avg void width = 20 cm, depth = 5 cm
const riverTable = calculateEpoxy({
  shape: 'river-table',
  length: 120,
  avgVoidWidth: 20,
  depth: 5,
  unit: 'cm',
  wastagePercent: 5,
  ratioA: 2,
  ratioB: 1,
  splitMode: 'volume'
});
assert(riverTable.rawVolumeMl === 12000, 'River table raw volume is 12,000 ml (12 L)');
assert(riverTable.totalVolumeMl === 12600, 'River table with 5% margin is 12,600 ml');
assert(riverTable.partAVolumeMl === 8400, 'River table Part A volume is 8,400 ml');
assert(riverTable.partBVolumeMl === 4200, 'River table Part B volume is 4,200 ml');

console.log('--- Testing Weight Ratio Mode (e.g. 100:45 by weight) ---');
const weightSplit = calculateEpoxy({
  shape: 'rectangle',
  length: 10,
  width: 10,
  depth: 10, // 1000 cm³ = 1000 ml
  unit: 'cm',
  wastagePercent: 0,
  ratioA: 100,
  ratioB: 45,
  splitMode: 'weight',
  densityA: 1.15,
  densityB: 1.00
});
assert(Math.abs(weightSplit.partBWeightG / weightSplit.partAWeightG - 0.45) < 1e-6, 'Mass ratio matches 100:45 exactly');
assert(Math.abs((weightSplit.partAVolumeMl + weightSplit.partBVolumeMl) - 1000) < 1e-4, 'Sum of component volumes fills the 1000 ml void exactly');

console.log('--- Testing Shape 5: Known Volume (Water Displacement) ---');
const knownVol = calculateEpoxy({
  shape: 'known-volume',
  knownVolume: 500,
  knownVolumeUnit: 'ml',
  depth: 0,
  unit: 'cm',
  wastagePercent: 10,
  ratioA: 2,
  ratioB: 1,
  splitMode: 'volume'
});
assert(Math.abs(knownVol.totalVolumeMl - 550) < 1e-6, '500 ml known volume with 10% margin is 550 ml');
assert(Math.abs(knownVol.partAVolumeMl - 366.6666666) < 1e-4, 'Part A is 2/3 of 550 ml');

console.log('--- Testing Coating Coverage (1 m² at 1 mm) ---');
import { calculateCoatingCoverage } from '../src/lib/resinCalculator.ts';
const coverage = calculateCoatingCoverage(100, 100, 1.0, 0); // 100 x 100 cm = 1 m², 1 mm
assert(coverage.surfaceAreaM2 === 1, '100x100 cm is 1.0 m²');
assert(coverage.requiredVolumeMl === 1000, '1 m² at 1 mm requires 1000 ml (1 Liter)');

console.log('\nAll Mathematical Unit, Ratio, Known-Volume & Coverage Tests Passed Successfully!');
