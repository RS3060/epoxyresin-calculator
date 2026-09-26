export type Locale = 'en' | 'es' | 'de' | 'fr' | 'id' | 'it' | 'pt' | 'pl' | 'ru' | 'bg';

export interface Translations {
  locale: Locale;
  langName: string;
  meta: {
    title: string;
    description: string;
    keywords?: string;
  };
  nav: {
    calculator: string;
    coverage: string;
    converter: string;
    shapes: string;
    referenceTable: string;
    guides: string;
    faq: string;
    paa: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    highlightPill1: string;
    highlightPill2: string;
    highlightPill3: string;
  };
  header: {
    subtitle: string;
  };
  calculator: {
    projectShape: string;
    shapes: {
      rectangle: string;
      circle: string;
      oval: string;
      riverTable: string;
      knownVolume: string;
    };
    dimensionsTitle: string;
    dimensionUnit: string;
    units: {
      cm: string;
      mm: string;
      m: string;
      in: string;
      ft: string;
    };
    length: string;
    tableLength: string;
    width: string;
    diameter: string;
    avgVoidWidth: string;
    depth: string;
    depthSubtext: string;
    knownVolumeLabel: string;
    knownVolumeSubtext: string;
    volumeUnits: {
      ml: string;
      floz: string;
      l: string;
      gal: string;
    };
    wastageTitle: string;
    wastageSubtext: string;
    bufferBadge: string;
    wastagePills: {
      exact: string;
      standard: string;
      recommended: string;
    };
    ratioTitle: string;
    ratioLabel: string;
    splitModeTitle: string;
    splitModeVolume: string;
    splitModeWeight: string;
    customRatio: string;
    partALabel: string;
    partBLabel: string;
    advancedDensities: string;
    advancedDensitiesSubtext: string;
    densityALabel: string;
    densityBLabel: string;
    clearBtn: string;
    presetsTitle: string;
    presets: {
      coaster: string;
      tray: string;
      roundTable: string;
      riverTable: string;
      mold: string;
    };
    results: {
      summaryTitle: string;
      totalVolume: string;
      inclBuffer: string;
      totalWeight: string;
      resinPartA: string;
      hardenerPartB: string;
      byVolume: string;
      byWeight: string;
      secondaryConversions: string;
      secondaryHeaders: {
        liters: string;
        gallons: string;
        kilograms: string;
        pounds: string;
      };
      copyRecipe: string;
      copiedNotice: string;
      disclaimer: string;
      fluidVisualLabel: string;
    };
  };
  coverage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    surfaceDimensions: string;
    unit: string;
    length: string;
    width: string;
    depth: string;
    thicknessGuide: string;
    safetyBufferLabel: string;
    resultTitle: string;
    badgeCoating: string;
    equivalent: string;
    presets: {
      seal: string;
      flood: string;
      art: string;
    };
    surfaceArea: string;
    volumeNeeded: string;
    withWaste: string;
    batchWeight: string;
    ruleOfThumb: string;
  };
  converter: {
    eyebrow: string;
    title: string;
    subtitle: string;
    amount: string;
    fromUnit: string;
    toUnit: string;
    convertedResult: string;
    densityNote: string;
    quickConversions: string;
    calibratedDensity: string;
    groupVolume: string;
    groupWeight: string;
    units: {
      ml: string;
      l: string;
      floz: string;
      gal: string;
      g: string;
      kg: string;
      oz: string;
      lbs: string;
    };
    quickButtons: {
      lToFloz: string;
      galToL: string;
      mlToG: string;
      kgToMl: string;
    };
  };
  shapeGuide: {
    eyebrow: string;
    title: string;
    subtitle: string;
    loadBtn: string;
    rectDesc: string;
    circleDesc: string;
    riverDesc: string;
    ovalDesc: string;
    waterFormula: string;
    waterDesc: string;
  };
  guides: {
    eyebrow: string;
    title: string;
    subtitle: string;
    card1Badge: string;
    card2Badge: string;
    card3Badge: string;
    guide1: {
      title: string;
      content: string[];
    };
    guide2: {
      title: string;
      content: string[];
    };
    guide3: {
      title: string;
      content: string[];
    };
  };
  referenceTable: {
    eyebrow: string;
    title: string;
    subtitle: string;
    calcNote: string;
    colProject: string;
    colDimensions: string;
    colVolume: string;
    colFlOz: string;
    colWeight: string;
    colPartA: string;
    colPartB: string;
    projects: {
      p1: string;
      p2: string;
      p3: string;
      p4: string;
      p5: string;
      p6: string;
    };
    safetyNote: string;
    adjustLink: string;
    avgVoid: string;
  };
  footer: {
    tagline: string;
    legalNote: string;
    calculationsTitle: string;
    languagesTitle: string;
    aboutUs: string;
    contactUs: string;
    privacy: string;
    terms: string;
    allRightsReserved: string;
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  paa: {
    tag: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
}

import { en } from './locales/en';
import { es } from './locales/es';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { id } from './locales/id';
import { it } from './locales/it';
import { pt } from './locales/pt';
import { pl } from './locales/pl';
import { ru } from './locales/ru';
import { bg } from './locales/bg';

export const translations: Record<Locale, Translations> = {
  en,
  es,
  de,
  fr,
  id,
  it,
  pt,
  pl,
  ru,
  bg,
};
