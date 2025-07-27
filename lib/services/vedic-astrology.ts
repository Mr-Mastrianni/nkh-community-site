/**
 * Vedic Astrology Calculation Service
 * Comprehensive Jyotish calculations for authentic Vedic astrology
 * Integrates with existing astronomical calculations service
 */

import { 
  VedicPlanetaryPosition, 
  Rashi, 
  NakshatraInfo, 
  VedicAspect, 
  VedicTransit, 
  VedicCalculationResult,
  NAKSHATRAS,
  RASHIS
} from '../types/vedic-astrology';

// Constants for Vedic calculations
const LAHIRI_AYANAMSA_2000 = 23.8583; // Lahiri Ayanamsa for Jan 1, 2000
const TROPICAL_YEAR = 365.2422;
const SIDEREAL_YEAR = 365.2564;

// Precession rate per year (degrees)
const PRECESSION_RATE = 0.0139692;

// Nakshatra boundaries in degrees (0-360)
const NAKSHATRA_SPAN = 13.3333; // 360/27
const NAKSHATRA_PADA = 3.3333; // 13.3333/4

/**
 * Calculate Lahiri Ayanamsa for a given date
 */
function calculateLahiriAyanamsa(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Julian day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Days since J2000.0
  const daysSinceJ2000 = jdn - 2451545.0;
  
  // Calculate ayanamsa using Lahiri formula
  const t = daysSinceJ2000 / 36525;
  const ayanamsa = LAHIRI_AYANAMSA_2000 + (PRECESSION_RATE * (year - 2000 + daysSinceJ2000 / TROPICAL_YEAR));
  
  return ayanamsa;
}

/**
 * Convert tropical longitude to sidereal using Lahiri Ayanamsa
 */
function tropicalToSidereal(tropicalLongitude: number, date: Date): number {
  const ayanamsa = calculateLahiriAyanamsa(date);
  let sidereal = tropicalLongitude - ayanamsa;
  
  // Normalize to 0-360 degrees
  while (sidereal < 0) sidereal += 360;
  while (sidereal >= 360) sidereal -= 360;
  
  return sidereal;
}

/**
 * Get Rashi from sidereal longitude
 */
function getRashi(siderealLongitude: number): Rashi {
  const rashiIndex = Math.floor(siderealLongitude / 30);
  return RASHIS[rashiIndex];
}

/**
 * Get Nakshatra information from sidereal longitude
 */
function getNakshatra(siderealLongitude: number): NakshatraInfo {
  const nakshatraIndex = Math.floor(siderealLongitude / NAKSHATRA_SPAN);
  const nakshatraBase = NAKSHATRAS[nakshatraIndex];
  const degreeInNakshatra = siderealLongitude % NAKSHATRA_SPAN;
  const pada = Math.floor(degreeInNakshatra / NAKSHATRA_PADA) + 1;
  
  return {
    ...nakshatraBase,
    pada,
    degree: degreeInNakshatra
  } as NakshatraInfo;
}

/**
 * Calculate Vedic planetary positions from tropical positions
 */
export function calculateVedicPositions(
  tropicalPositions: Array<{
    planet: string;
    longitude: number;
    latitude: number;
    speed: number;
    isRetrograde: boolean;
  }>,
  date: Date
): VedicPlanetaryPosition[] {
  return tropicalPositions.map(pos => {
    const siderealLongitude = tropicalToSidereal(pos.longitude, date);
    const rashi = getRashi(siderealLongitude);
    const nakshatra = getNakshatra(siderealLongitude);
    
    // Calculate house (simplified - actual house calculation needs ascendant)
    const bhava = ((Math.floor(siderealLongitude / 30) + 1) % 12) || 12;
    
    return {
      planet: pos.planet,
      longitude: siderealLongitude,
      latitude: pos.latitude,
      rashi,
      nakshatra,
      bhava,
      isRetrograde: pos.isRetrograde,
      speed: pos.speed
    };
  });
}

/**
 * Calculate Vedic aspects between planets
 */
export function calculateVedicAspects(positions: VedicPlanetaryPosition[]): VedicAspect[] {
  const aspects: VedicAspect[] = [];
  const planets = positions.filter(p => p.planet !== 'Earth');
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      const angle = Math.abs(planet1.longitude - planet2.longitude);
      const normalizedAngle = Math.min(angle, 360 - angle);
      
      // Vedic aspects (simplified)
      let aspectType: 'Full' | 'Half' | 'Quarter' | 'Special' = 'Special';
      let strength = 0;
      
      if (normalizedAngle <= 10) {
        aspectType = 'Full';
        strength = 100;
      } else if (normalizedAngle >= 170 && normalizedAngle <= 190) {
        aspectType = 'Full';
        strength = 75;
      } else if (normalizedAngle >= 80 && normalizedAngle <= 100) {
        aspectType = 'Half';
        strength = 50;
      }
      
      if (strength > 0) {
        aspects.push({
          aspectingPlanet: planet1.planet,
          aspectedPlanet: planet2.planet,
          aspectType,
          strength,
          orb: Math.abs(normalizedAngle - (normalizedAngle <= 10 ? 0 : 180)),
          isApplying: false, // Simplified
          nature: 'Neutral' // Simplified
        });
      }
    }
  }
  
  return aspects;
}

/**
 * Calculate Vedic transits
 */
export function calculateVedicTransits(
  currentPositions: VedicPlanetaryPosition[],
  previousPositions: VedicPlanetaryPosition[],
  date: Date
): VedicTransit[] {
  const transits: VedicTransit[] = [];
  
  for (let i = 0; i < currentPositions.length; i++) {
    const current = currentPositions[i];
    const previous = previousPositions.find(p => p.planet === current.planet);
    
    if (previous && Math.floor(current.longitude / 30) !== Math.floor(previous.longitude / 30)) {
      transits.push({
        planet: current.planet,
        fromRashi: previous.rashi.name,
        toRashi: current.rashi.name,
        fromNakshatra: previous.nakshatra.name,
        toNakshatra: current.nakshatra.name,
        transitDate: date,
        significance: [`${current.planet} transits from ${previous.rashi.name} to ${current.rashi.name}`],
        effects: {
          general: [`${current.planet} enters ${current.rashi.name}`],
          forRashis: {}
        },
        duration: 'Variable',
        intensity: 'Moderate'
      });
    }
  }
  
  return transits;
}

/**
 * Calculate Vimshottari Dasha periods
 */
export function calculateVimshottariDasha(
  moonLongitude: number,
  birthDate: Date
): any {
  // Simplified Vimshottari Dasha calculation
  const nakshatraIndex = Math.floor(moonLongitude / NAKSHATRA_SPAN);
  const elapsedInNakshatra = (moonLongitude % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  
  // Dasha years for each planet
  const dashaYears: Record<string, number> = {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17
  };
  
  const dashaOrder: string[] = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  
  return {
    system: 'Vimshottari',
    currentMahadasha: {
      planet: dashaOrder[nakshatraIndex % 9],
      startDate: birthDate,
      endDate: new Date(birthDate.getTime() + (dashaYears[dashaOrder[nakshatraIndex % 9]] * 365.25 * 24 * 60 * 60 * 1000)),
      totalYears: dashaYears[dashaOrder[nakshatraIndex % 9]],
      remainingYears: dashaYears[dashaOrder[nakshatraIndex % 9]] * (1 - elapsedInNakshatra)
    },
    currentAntardasha: {
      planet: dashaOrder[(nakshatraIndex + 1) % 9],
      startDate: birthDate,
      endDate: new Date(birthDate.getTime() + (dashaYears[dashaOrder[(nakshatraIndex + 1) % 9]] * 365.25 * 24 * 60 * 60 * 1000) / 9),
      totalMonths: dashaYears[dashaOrder[(nakshatraIndex + 1) % 9]] / 9,
      remainingMonths: (dashaYears[dashaOrder[(nakshatraIndex + 1) % 9]] / 9) * (1 - elapsedInNakshatra)
    },
    currentPratyantardasha: {
      planet: dashaOrder[(nakshatraIndex + 2) % 9],
      startDate: birthDate,
      endDate: new Date(birthDate.getTime() + (dashaYears[dashaOrder[(nakshatraIndex + 2) % 9]] * 365.25 * 24 * 60 * 60 * 1000) / 120),
      totalDays: dashaYears[dashaOrder[(nakshatraIndex + 2) % 9]] * 365.25 / 120,
      remainingDays: (dashaYears[dashaOrder[(nakshatraIndex + 2) % 9]] * 365.25 / 120) * (1 - elapsedInNakshatra)
    },
    upcomingPeriods: []
  };
}

/**
 * Main function to calculate complete Vedic astrology data
 */
export function calculateVedicAstrology(
  tropicalPositions: Array<{
    planet: string;
    longitude: number;
    latitude: number;
    speed: number;
    isRetrograde: boolean;
  }>,
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string
): VedicCalculationResult {
  const vedicPositions = calculateVedicPositions(tropicalPositions, date);
  const aspects = calculateVedicAspects(vedicPositions);
  const moonPosition = vedicPositions.find(p => p.planet === 'Moon');
  
  const dasha = moonPosition ? calculateVimshottariDasha(moonPosition.longitude, date) : null;
  
  return {
    timestamp: date,
    location: {
      latitude,
      longitude,
      timezone
    },
    ayanamsa: {
      name: 'Lahiri',
      value: calculateLahiriAyanamsa(date),
      epoch: new Date('2000-01-01'),
      formula: 'Lahiri Ayanamsa'
    },
    siderealTime: 0, // Placeholder - would need actual calculation
    planets: vedicPositions,
    houses: [], // Placeholder - would need actual house calculation
    aspects,
    yogas: [], // Placeholder - would need actual yoga calculation
    dashas: dasha || {
      system: 'Vimshottari',
      currentMahadasha: {
        planet: 'Moon',
        startDate: date,
        endDate: date,
        totalYears: 10,
        remainingYears: 10
      },
      currentAntardasha: {
        planet: 'Moon',
        startDate: date,
        endDate: date,
        totalMonths: 10/9,
        remainingMonths: 10/9
      },
      currentPratyantardasha: {
        planet: 'Moon',
        startDate: date,
        endDate: date,
        totalDays: 10*365.25/120,
        remainingDays: 10*365.25/120
      },
      upcomingPeriods: []
    },
    transits: [],
    panchanga: {
      tithi: {
        name: 'Pratipada',
        number: 1,
        paksha: 'Shukla',
        endTime: new Date(date.getTime() + 24 * 60 * 60 * 1000),
        deity: 'Agni',
        nature: 'Nanda'
      },
      vara: {
        name: 'Sunday',
        number: 1,
        lord: 'Sun',
        color: 'Red'
      },
      nakshatra: moonPosition ? moonPosition.nakshatra : NAKSHATRAS[0],
      yoga: {
        name: 'Vishkumbha',
        number: 1,
        deity: 'Yama',
        nature: 'Malefic',
        endTime: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      },
      karana: {
        name: 'Kinstughna',
        number: 1,
        type: 'Chara',
        deity: 'Shiva',
        endTime: new Date(date.getTime() + 6 * 60 * 60 * 1000)
      }
    },
    muhurtas: [],
    charts: {
      rashi: {
        chartType: 'Rashi',
        houses: [],
        planets: vedicPositions,
        aspects,
        yogas: [],
        ascendant: {
          rashi: vedicPositions[0]?.rashi || RASHIS[0],
          nakshatra: vedicPositions[0]?.nakshatra || NAKSHATRAS[0],
          degree: 0
        },
        moonSign: moonPosition?.rashi || RASHIS[0],
        sunSign: vedicPositions.find(p => p.planet === 'Sun')?.rashi || RASHIS[0]
      },
      navamsa: {
        chartType: 'Navamsa',
        houses: [],
        planets: [],
        aspects: [],
        yogas: [],
        ascendant: {
          rashi: RASHIS[0],
          nakshatra: {
            ...NAKSHATRAS[0],
            pada: 1,
            degree: 0
          },
          degree: 0
        },
        moonSign: RASHIS[0],
        sunSign: RASHIS[0]
      }
    }
  };
}

// Export utility functions for external use
export {
  calculateLahiriAyanamsa,
  tropicalToSidereal,
  getRashi,
  getNakshatra
};