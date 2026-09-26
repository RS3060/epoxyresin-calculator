/**
 * Institutional-Grade Mathematical Engine for Epoxy Resin Volume & Mixing Calculations
 * Zero external dependencies. Pure TypeScript.
 * epoxyresin-calculator.com
 */

export type ProjectShape = 'rectangle' | 'circle' | 'oval' | 'river-table' | 'known-volume';
export type DimensionUnit = 'cm' | 'mm' | 'm' | 'in' | 'ft';
export type VolumeUnit = 'ml' | 'l' | 'floz' | 'gal';
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lbs';
export type RatioPreset = '1:1' | '2:1' | '3:1' | '4:1' | '100:50' | '100:45' | '100:30' | 'custom';
export type SplitMode = 'volume' | 'weight';

export interface CalculatorInputs {
  shape: ProjectShape;
  // Dimensions according to shape
  length?: number;          // Rectangle, Oval, River Table
  width?: number;           // Rectangle, Oval
  avgVoidWidth?: number;    // River Table
  diameter?: number;        // Circle
  depth: number;            // All shapes (except known-volume)
  knownVolume?: number;     // Known Volume / Water displacement
  knownVolumeUnit?: VolumeUnit;
  unit: DimensionUnit;
  wastagePercent: number;   // 0, 5, 10, etc.
  ratioA: number;           // e.g. 1, 2, 100
  ratioB: number;           // e.g. 1, 1, 45
  splitMode: SplitMode;     // 'volume' or 'weight'
  densityA?: number;        // g/ml, default 1.15
  densityB?: number;        // g/ml, default 1.00
}

export interface CalculationOutputs {
  rawVolumeMl: number;
  wastageVolumeMl: number;
  totalVolumeMl: number;
  totalVolumeL: number;
  totalVolumeFlOz: number;
  totalVolumeGal: number;
  
  // Volume Splits
  partAVolumeMl: number;
  partBVolumeMl: number;
  partAVolumeL: number;
  partBVolumeL: number;
  partAVolumeFlOz: number;
  partBVolumeFlOz: number;

  // Weight Splits
  totalWeightG: number;
  totalWeightKg: number;
  totalWeightOz: number;
  totalWeightLbs: number;
  partAWeightG: number;
  partBWeightG: number;
  partAWeightKg: number;
  partBWeightKg: number;
  partAWeightOz: number;
  partBWeightOz: number;
  partAWeightLbs: number;
  partBWeightLbs: number;

  // Density used
  densityA: number;
  densityB: number;
  splitMode: SplitMode;
  ratioA: number;
  ratioB: number;
}

// Unit conversion constants to cm
const CM_CONVERSIONS: Record<DimensionUnit, number> = {
  cm: 1,
  mm: 0.1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

// Imperial & metric volumetric / mass conversion constants
export const ML_PER_FL_OZ = 29.5735295625;
export const ML_PER_GALLON = 3785.411784;
export const GRAMS_PER_OZ = 28.349523125;
export const GRAMS_PER_LB = 453.59237;

/**
 * Converts a dimension value to centimeters (cm).
 */
export function toCm(val: number, unit: DimensionUnit): number {
  if (isNaN(val) || val < 0) return 0;
  return val * CM_CONVERSIONS[unit];
}

/**
 * Converts any volume unit to milliliters (ml).
 */
export function volumeToMl(val: number, unit: VolumeUnit): number {
  if (isNaN(val) || val < 0) return 0;
  switch (unit) {
    case 'ml': return val;
    case 'l': return val * 1000;
    case 'floz': return val * ML_PER_FL_OZ;
    case 'gal': return val * ML_PER_GALLON;
    default: return val;
  }
}

/**
 * Converts milliliters (ml) to any volume unit.
 */
export function mlToVolume(valMl: number, unit: VolumeUnit): number {
  if (isNaN(valMl) || valMl < 0) return 0;
  switch (unit) {
    case 'ml': return valMl;
    case 'l': return valMl / 1000;
    case 'floz': return valMl / ML_PER_FL_OZ;
    case 'gal': return valMl / ML_PER_GALLON;
    default: return valMl;
  }
}

/**
 * Converts any weight unit to grams (g).
 */
export function weightToGrams(val: number, unit: WeightUnit): number {
  if (isNaN(val) || val < 0) return 0;
  switch (unit) {
    case 'g': return val;
    case 'kg': return val * 1000;
    case 'oz': return val * GRAMS_PER_OZ;
    case 'lbs': return val * GRAMS_PER_LB;
    default: return val;
  }
}

/**
 * Converts grams (g) to any weight unit.
 */
export function gramsToWeight(valG: number, unit: WeightUnit): number {
  if (isNaN(valG) || valG < 0) return 0;
  switch (unit) {
    case 'g': return valG;
    case 'kg': return valG / 1000;
    case 'oz': return valG / GRAMS_PER_OZ;
    case 'lbs': return valG / GRAMS_PER_LB;
    default: return valG;
  }
}

/**
 * Computes the geometric void volume in cubic centimeters (cm³ = ml).
 */
export function calculateGeometricVolume(
  shape: ProjectShape,
  unit: DimensionUnit,
  inputs: {
    length?: number;
    width?: number;
    avgVoidWidth?: number;
    diameter?: number;
    depth: number;
    knownVolume?: number;
    knownVolumeUnit?: VolumeUnit;
  }
): number {
  if (shape === 'known-volume') {
    return volumeToMl(inputs.knownVolume ?? 0, inputs.knownVolumeUnit ?? 'ml');
  }

  const depthCm = toCm(inputs.depth, unit);
  if (depthCm <= 0) return 0;

  switch (shape) {
    case 'rectangle': {
      const lengthCm = toCm(inputs.length ?? 0, unit);
      const widthCm = toCm(inputs.width ?? 0, unit);
      return lengthCm * widthCm * depthCm;
    }
    case 'circle': {
      const diameterCm = toCm(inputs.diameter ?? 0, unit);
      const radiusCm = diameterCm / 2;
      return Math.PI * radiusCm * radiusCm * depthCm;
    }
    case 'oval': {
      const lengthCm = toCm(inputs.length ?? 0, unit);
      const widthCm = toCm(inputs.width ?? 0, unit);
      return Math.PI * (lengthCm / 2) * (widthCm / 2) * depthCm;
    }
    case 'river-table': {
      const lengthCm = toCm(inputs.length ?? 0, unit);
      const voidWidthCm = toCm(inputs.avgVoidWidth ?? 0, unit);
      return lengthCm * voidWidthCm * depthCm;
    }
    default:
      return 0;
  }
}

/**
 * Surface Area Coating Coverage calculation:
 * 1 liter of epoxy resin covers exactly 1 m² at 1.0 mm thickness.
 */
export interface CoatingCoverageResult {
  surfaceAreaM2: number;
  surfaceAreaSqFt: number;
  requiredVolumeMl: number;
  withWastageMl: number;
  requiredVolumeL: number;
  withWastageL: number;
  requiredWeightG: number;
  withWastageG: number;
}

export function calculateCoatingCoverage(
  lengthCm: number,
  widthCm: number,
  depthMm: number,
  wastagePercent: number = 10,
  density: number = 1.12
): CoatingCoverageResult {
  const surfaceAreaM2 = (Math.max(0, lengthCm) * Math.max(0, widthCm)) / 10000;
  const surfaceAreaSqFt = surfaceAreaM2 * 10.7639;
  // Volume in ml = Area (cm²) * depth (cm)
  // Area (cm²) = lengthCm * widthCm
  // depth (cm) = depthMm / 10
  const areaCm2 = Math.max(0, lengthCm) * Math.max(0, widthCm);
  const depthCm = Math.max(0, depthMm) / 10;
  const requiredVolumeMl = areaCm2 * depthCm;
  const withWastageMl = requiredVolumeMl * (1 + Math.max(0, wastagePercent) / 100);

  return {
    surfaceAreaM2,
    surfaceAreaSqFt,
    requiredVolumeMl,
    withWastageMl,
    requiredVolumeL: requiredVolumeMl / 1000,
    withWastageL: withWastageMl / 1000,
    requiredWeightG: requiredVolumeMl * density,
    withWastageG: withWastageMl * density,
  };
}

/**
 * Main calculation engine function.
 * Computes raw volume, wastage buffer, volume splits, and scale weights.
 */
export function calculateEpoxy(inputs: CalculatorInputs): CalculationOutputs {
  const densityA = inputs.densityA && inputs.densityA > 0 ? inputs.densityA : 1.15;
  const densityB = inputs.densityB && inputs.densityB > 0 ? inputs.densityB : 1.00;
  const wastage = Math.max(0, inputs.wastagePercent || 0) / 100;
  const ratioA = Math.max(0.001, inputs.ratioA || 1);
  const ratioB = Math.max(0.001, inputs.ratioB || 1);
  const splitMode = inputs.splitMode || 'volume';

  // 1. Raw Geometric Volume (in ml = cm³)
  const rawVolumeMl = calculateGeometricVolume(inputs.shape, inputs.unit, {
    length: inputs.length,
    width: inputs.width,
    avgVoidWidth: inputs.avgVoidWidth,
    diameter: inputs.diameter,
    depth: inputs.depth,
    knownVolume: inputs.knownVolume,
    knownVolumeUnit: inputs.knownVolumeUnit,
  });

  // 2. Volume with wastage buffer
  const totalVolumeMl = rawVolumeMl * (1 + wastage);
  const wastageVolumeMl = totalVolumeMl - rawVolumeMl;

  let partAVolumeMl = 0;
  let partBVolumeMl = 0;
  let partAWeightG = 0;
  let partBWeightG = 0;

  if (splitMode === 'volume') {
    // Ratio is defined by VOLUME (e.g., 1:1 by volume, 2:1 by volume)
    const totalRatioParts = ratioA + ratioB;
    partAVolumeMl = totalVolumeMl * (ratioA / totalRatioParts);
    partBVolumeMl = totalVolumeMl * (ratioB / totalRatioParts);

    // Weights computed from volume x density
    partAWeightG = partAVolumeMl * densityA;
    partBWeightG = partBVolumeMl * densityB;
  } else {
    // Ratio is defined by WEIGHT (e.g. 100:45 by weight)
    // To fill totalVolumeMl: V_total = V_A + V_B = (M_A / rho_A) + (M_B / rho_B)
    // Since M_B / M_A = ratioB / ratioA => M_B = M_A * (ratioB / ratioA)
    // V_total = M_A * (1/rho_A + (ratioB/ratioA)/rho_B)
    const factor = (1 / densityA) + (ratioB / ratioA) * (1 / densityB);
    partAWeightG = totalVolumeMl / factor;
    partBWeightG = partAWeightG * (ratioB / ratioA);

    partAVolumeMl = partAWeightG / densityA;
    partBVolumeMl = partBWeightG / densityB;
  }

  const totalWeightG = partAWeightG + partBWeightG;

  return {
    rawVolumeMl,
    wastageVolumeMl,
    totalVolumeMl,
    totalVolumeL: totalVolumeMl / 1000,
    totalVolumeFlOz: totalVolumeMl / ML_PER_FL_OZ,
    totalVolumeGal: totalVolumeMl / ML_PER_GALLON,

    partAVolumeMl,
    partBVolumeMl,
    partAVolumeL: partAVolumeMl / 1000,
    partBVolumeL: partBVolumeMl / 1000,
    partAVolumeFlOz: partAVolumeMl / ML_PER_FL_OZ,
    partBVolumeFlOz: partBVolumeMl / ML_PER_FL_OZ,

    totalWeightG,
    totalWeightKg: totalWeightG / 1000,
    totalWeightOz: totalWeightG / GRAMS_PER_OZ,
    totalWeightLbs: totalWeightG / GRAMS_PER_LB,

    partAWeightG,
    partBWeightG,
    partAWeightKg: partAWeightG / 1000,
    partBWeightKg: partBWeightG / 1000,
    partAWeightOz: partAWeightG / GRAMS_PER_OZ,
    partBWeightOz: partBWeightG / GRAMS_PER_OZ,
    partAWeightLbs: partAWeightG / GRAMS_PER_LB,
    partBWeightLbs: partBWeightG / GRAMS_PER_LB,

    densityA,
    densityB,
    splitMode,
    ratioA,
    ratioB,
  };
}

/**
 * Cleanly formats a numeric value for display without trailing zeros unless specified.
 */
export function formatNum(val: number, maxDecimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  if (val === 0) return '0';
  if (val >= 1000) {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals > 1 ? 1 : maxDecimals,
    });
  }
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}
