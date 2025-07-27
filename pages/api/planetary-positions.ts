import type { NextApiRequest, NextApiResponse } from 'next';
import sweph from 'sweph';
import path from 'path';
import {
  calculateNakshatraPada,
} from '../../lib/services/astronomical-calculations';
import { PlanetaryData, PlanetPosition, Vector3D } from '../../lib/types/planetary-events';

// Define planet constants for Swiss Ephemeris
const SE_SUN = 0;
const SE_MOON = 1;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;
const SE_TRUE_NODE = 11; // Rahu

const planets = {
  sun: SE_SUN,
  moon: SE_MOON,
  mercury: SE_MERCURY,
  venus: SE_VENUS,
  mars: SE_MARS,
  jupiter: SE_JUPITER,
  saturn: SE_SATURN,
};

// Set the path to the ephemeris files
const ephePath = path.join(process.cwd(), 'lib', 'ephemeris');
sweph.set_ephe_path(ephePath);

// Function to convert a date to Julian Day (UT)
function getJulianDay(date: Date): number {
  const time = date.getTime();
  const tzoffset = date.getTimezoneOffset() * 60000;
  return (time - tzoffset) / 86400000 + 2440587.5;
}

// Function to normalize degrees
const normalizeDegrees = (degrees: number): number => {
  return (degrees % 360 + 360) % 360;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlanetaryData | { error: string }>
) {
  try {
    const { date: dateString } = req.query;
    const date = dateString ? new Date(dateString as string) : new Date();

    const julianDay = getJulianDay(date);
    const SEFLG_SPEED = 256;
    // Remove SEFLG_XYZ flag to get spherical coordinates (longitude, latitude, distance)
    // instead of Cartesian coordinates (x, y, z)
    const flag = SEFLG_SPEED;

    // Set sidereal mode to Lahiri and calculate ayanamsa
    const SE_SIDM_LAHIRI = 1;
    
    // Log diagnostic information
    console.log('Calculating ayanamsa for Julian Day:', julianDay);
    console.log('Using Lahiri ayanamsa (SE_SIDM_LAHIRI = 1)');
    
    let ayanamsa: number;
    try {
      // First, ensure sidereal mode is properly set
      sweph.set_sid_mode(SE_SIDM_LAHIRI, 0, 0);
      console.log('Sidereal mode set successfully');
      
      // Try the original function call to see the actual error
      ayanamsa = sweph.get_ayanamsa_ut(julianDay) as number;
      console.log('Successfully calculated ayanamsa:', ayanamsa);
    } catch (ayanamsaError) {
      console.error('Error calculating ayanamsa:', ayanamsaError);
      console.error('Error details:', {
        message: ayanamsaError.message,
        stack: ayanamsaError.stack,
        julianDay,
        siderealMode: SE_SIDM_LAHIRI
      });
      
      // Try alternative approach using get_ayanamsa instead of get_ayanamsa_ut
      try {
        console.log('Trying alternative get_ayanamsa function...');
        ayanamsa = sweph.get_ayanamsa(julianDay) as number;
        console.log('Successfully calculated ayanamsa with alternative function:', ayanamsa);
      } catch (alternativeError) {
        console.error('Alternative ayanamsa calculation also failed:', alternativeError);
        throw new Error(`All ayanamsa calculation methods failed. Original error: ${ayanamsaError.message}, Alternative error: ${alternativeError.message}`);
      }
    }

    const calculatePlanetPosition = (planetId: number, planetName: string): PlanetPosition => {
      try {
        console.log(`Calculating position for ${planetName} (ID: ${planetId})`);
        
        const planetData = sweph.calc_ut(julianDay, planetId, flag) as any;
        
        console.log(`Raw planet data for ${planetName}:`, planetData);
        console.log(`Planet data type:`, typeof planetData);
        console.log(`Is array:`, Array.isArray(planetData));
        
        let tropicalLongitude: number;
        let speed: number;
        let x: number, y: number, z: number;
        
        // Handle different return formats from Swiss Ephemeris
        if (Array.isArray(planetData)) {
          // Array format: [longitude, latitude, distance, longitude_speed, latitude_speed, distance_speed]
          tropicalLongitude = planetData[0];
          speed = planetData[3];
          x = planetData[0]; // Use longitude as x for now
          y = planetData[1]; // Use latitude as y
          z = planetData[2]; // Use distance as z
        } else if (planetData && typeof planetData === 'object') {
          // Object format - try common property names
          tropicalLongitude = planetData.longitude || planetData.lon || planetData[0];
          speed = planetData.speed || planetData.longitude_speed || planetData[3] || 0;
          x = planetData.x || planetData.longitude || planetData[0] || 0;
          y = planetData.y || planetData.latitude || planetData[1] || 0;
          z = planetData.z || planetData.distance || planetData[2] || 0;
          
          console.log(`Object properties for ${planetName}:`, Object.keys(planetData));
        } else {
          throw new Error(`Invalid planet data returned for ${planetName}: ${JSON.stringify(planetData)}`);
        }
        
        console.log(`${planetName} - Tropical longitude: ${tropicalLongitude}, Ayanamsa: ${ayanamsa}`);
        
        if (typeof tropicalLongitude !== 'number' || isNaN(tropicalLongitude)) {
          throw new Error(`Invalid tropical longitude for ${planetName}: ${tropicalLongitude}`);
        }
        
        if (typeof ayanamsa !== 'number' || isNaN(ayanamsa)) {
          throw new Error(`Invalid ayanamsa value: ${ayanamsa}`);
        }
        
        const siderealLongitude = normalizeDegrees(tropicalLongitude - ayanamsa);
        console.log(`${planetName} - Sidereal longitude: ${siderealLongitude}`);
        
        if (isNaN(siderealLongitude)) {
          throw new Error(`Calculated sidereal longitude is NaN for ${planetName}. Tropical: ${tropicalLongitude}, Ayanamsa: ${ayanamsa}`);
        }
        
        const nakshatraData = calculateNakshatraPada(siderealLongitude);

        return {
          planet: planetName,
          longitude: tropicalLongitude,
          siderealLongitude: siderealLongitude,
          speed: speed,
          nakshatra: nakshatraData.nakshatra,
          nakshatraSanskrit: nakshatraData.nakshatraSanskrit,
          pada: nakshatraData.pada,
          nakshatraLord: nakshatraData.nakshatraLord,
          deity: nakshatraData.deity,
          nature: nakshatraData.nature,
          sign: '', // Placeholder
          signLord: '', // Placeholder
          house: 0, // Placeholder
          position: { x, y, z },
        };
      } catch (error) {
        console.error(`Error calculating position for ${planetName}:`, error);
        throw new Error(`Failed to calculate position for ${planetName}: ${error.message}`);
      }
    };

    const positions: PlanetPosition[] = [
      calculatePlanetPosition(planets.sun, 'Sun'),
      calculatePlanetPosition(planets.moon, 'Moon'),
      calculatePlanetPosition(planets.mars, 'Mars'),
      calculatePlanetPosition(planets.mercury, 'Mercury'),
      calculatePlanetPosition(planets.jupiter, 'Jupiter'),
      calculatePlanetPosition(planets.venus, 'Venus'),
      calculatePlanetPosition(planets.saturn, 'Saturn'),
      calculatePlanetPosition(SE_TRUE_NODE, 'Rahu'),
    ];

    // Calculate Ketu (180 degrees opposite to Rahu)
    const rahuPosition = positions.find(p => p.planet === 'Rahu')!;
    const ketuLongitude = normalizeDegrees(rahuPosition.siderealLongitude + 180);
    const ketuNakshatraData = calculateNakshatraPada(ketuLongitude);
    
    const ketuPosition: PlanetPosition = {
      planet: 'Ketu',
      longitude: normalizeDegrees(rahuPosition.longitude + 180),
      siderealLongitude: ketuLongitude,
      speed: rahuPosition.speed, // Ketu's speed is the same as Rahu's
      position: { x: -rahuPosition.position.x, y: -rahuPosition.position.y, z: -rahuPosition.position.z },
      ...ketuNakshatraData,
      sign: '',
      signLord: '',
      house: 0,
    };

    positions.push(ketuPosition);

    const responseData: PlanetaryData = {
      source: 'Swiss Ephemeris (Lahiri Ayanamsa)',
      date: date.toISOString(),
      julianDay: julianDay,
      ayanamsa: {
        name: 'Lahiri',
        value: ayanamsa,
      },
      positions,
      moonPhase: { phase: 0.5, angle: 0, illumination: 0.5, name: 'Waxing' }, // Placeholder
      siderealTime: 0, // Placeholder
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
