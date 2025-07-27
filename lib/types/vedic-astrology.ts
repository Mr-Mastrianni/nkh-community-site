// Vedic Astrology Type Definitions
// Comprehensive types for authentic Jyotish calculations

export interface VedicPlanetaryPosition {
  planet: string;
  longitude: number; // Sidereal longitude in degrees
  latitude: number; // Celestial latitude in degrees
  rashi: Rashi;
  nakshatra: NakshatraInfo;
  bhava: number; // House number (1-12)
  isRetrograde: boolean;
  speed: number; // Daily motion in degrees
}

export interface Rashi {
  name: string;
  number: number; // 1-12
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string; // Ruling planet
  exaltation?: string; // Exalted planet
  debilitation?: string; // Debilitated planet
  symbol: string;
  bodyPart: string;
  nature: 'Movable' | 'Fixed' | 'Dual';
}

export interface NakshatraInfo {
  name: string;
  number: number; // 1-27
  pada: number; // 1-4 (quarter)
  degree: number; // Position within nakshatra (0-13.33)
  ruler: string; // Nakshatra lord
  deity: string;
  symbol: string;
  nature: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  yoni: string; // Animal symbol
  tatva: 'Prithvi' | 'Jal' | 'Agni' | 'Vayu' | 'Akash';
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
  gotra: string;
  nadi: 'Adi' | 'Madhya' | 'Antya';
  characteristics: string[];
}

export interface BhavaInfo {
  number: number; // 1-12
  name: string;
  significance: string[];
  bodyParts: string[];
  karaka: string; // Natural significator
  planets: string[]; // Planets placed in this house
  lord: string; // House lord
  lordPosition: {
    bhava: number;
    rashi: string;
  };
}

export interface VedicAspect {
  aspectingPlanet: string;
  aspectedPlanet: string;
  aspectType: 'Full' | 'Half' | 'Quarter' | 'Special';
  strength: number; // 0-100
  orb: number;
  isApplying: boolean;
  nature: 'Benefic' | 'Malefic' | 'Neutral';
}

export interface Yoga {
  name: string;
  type: 'Raja' | 'Dhana' | 'Mahapurusha' | 'Nabhas' | 'Chandra' | 'Surya' | 'Parivartana' | 'Other';
  planets: string[];
  houses: number[];
  strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  description: string;
  effects: string[];
  conditions: string[];
  isActive: boolean;
}

export interface DashaInfo {
  system: 'Vimshottari' | 'Ashtottari' | 'Yogini' | 'Chara';
  currentMahadasha: {
    planet: string;
    startDate: Date;
    endDate: Date;
    totalYears: number;
    remainingYears: number;
  };
  currentAntardasha: {
    planet: string;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    remainingMonths: number;
  };
  currentPratyantardasha: {
    planet: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    remainingDays: number;
  };
  upcomingPeriods: DashaPeriod[];
}

export interface DashaPeriod {
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshma' | 'Prana';
  planet: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in years/months/days depending on level
  effects: string[];
}

export interface VedicTransit {
  planet: string;
  fromRashi: string;
  toRashi: string;
  fromNakshatra: string;
  toNakshatra: string;
  transitDate: Date;
  significance: string[];
  effects: {
    general: string[];
    forRashis: Record<string, string[]>;
  };
  duration: string;
  intensity: 'Major' | 'Moderate' | 'Minor';
}

export interface Ayanamsa {
  name: 'Lahiri' | 'Raman' | 'Krishnamurti' | 'Yukteshwar';
  value: number; // in degrees
  epoch: Date;
  formula: string;
}

export interface VedicChart {
  chartType: 'Rashi' | 'Navamsa' | 'Dasamsa' | 'Dwadasamsa' | 'Shodsamsa' | 'Vimsamsa' | 'Chaturthamsa' | 'Saptamsa' | 'Ashtamsa';
  houses: BhavaInfo[];
  planets: VedicPlanetaryPosition[];
  aspects: VedicAspect[];
  yogas: Yoga[];
  ascendant: {
    rashi: Rashi;
    nakshatra: NakshatraInfo;
    degree: number;
  };
  moonSign: Rashi;
  sunSign: Rashi;
}

export interface PanchangaInfo {
  tithi: {
    name: string;
    number: number; // 1-30
    paksha: 'Shukla' | 'Krishna';
    endTime: Date;
    deity: string;
    nature: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
  };
  vara: {
    name: string;
    number: number; // 1-7
    lord: string;
    color: string;
  };
  nakshatra: NakshatraInfo;
  yoga: {
    name: string;
    number: number; // 1-27
    deity: string;
    nature: string;
    endTime: Date;
  };
  karana: {
    name: string;
    number: number; // 1-11
    type: 'Chara' | 'Sthira';
    deity: string;
    endTime: Date;
  };
}

export interface MuhurtaInfo {
  name: string;
  startTime: Date;
  endTime: Date;
  type: 'Auspicious' | 'Inauspicious' | 'Neutral';
  activities: string[];
  toAvoid: string[];
  significance: string;
}

export interface VedicCalculationResult {
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  ayanamsa: Ayanamsa;
  siderealTime: number;
  planets: VedicPlanetaryPosition[];
  houses: BhavaInfo[];
  aspects: VedicAspect[];
  yogas: Yoga[];
  dashas: DashaInfo;
  transits: VedicTransit[];
  panchanga: PanchangaInfo;
  muhurtas: MuhurtaInfo[];
  charts: {
    rashi: VedicChart;
    navamsa: VedicChart;
  };
}

// Constants for Vedic calculations
export const RASHIS: Rashi[] = [
  {
    name: 'Mesha',
    number: 1,
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'Mars',
    exaltation: 'Sun',
    debilitation: 'Saturn',
    symbol: 'Ram',
    bodyPart: 'Head',
    nature: 'Movable'
  },
  {
    name: 'Vrishabha',
    number: 2,
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'Venus',
    exaltation: 'Moon',
    debilitation: 'Mars',
    symbol: 'Bull',
    bodyPart: 'Face, Neck',
    nature: 'Fixed'
  },
  {
    name: 'Mithuna',
    number: 3,
    element: 'Air',
    quality: 'Mutable',
    ruler: 'Mercury',
    exaltation: 'Rahu',
    debilitation: 'Ketu',
    symbol: 'Twins',
    bodyPart: 'Arms, Shoulders',
    nature: 'Dual'
  },
  {
    name: 'Karka',
    number: 4,
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'Moon',
    exaltation: 'Jupiter',
    debilitation: 'Mars',
    symbol: 'Crab',
    bodyPart: 'Chest',
    nature: 'Movable'
  },
  {
    name: 'Simha',
    number: 5,
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'Sun',
    exaltation: 'Pluto',
    debilitation: 'Venus',
    symbol: 'Lion',
    bodyPart: 'Heart, Upper Back',
    nature: 'Fixed'
  },
  {
    name: 'Kanya',
    number: 6,
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'Mercury',
    exaltation: 'Mercury',
    debilitation: 'Venus',
    symbol: 'Virgin',
    bodyPart: 'Stomach, Intestines',
    nature: 'Dual'
  },
  {
    name: 'Tula',
    number: 7,
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'Venus',
    exaltation: 'Saturn',
    debilitation: 'Sun',
    symbol: 'Balance',
    bodyPart: 'Lower Back, Kidneys',
    nature: 'Movable'
  },
  {
    name: 'Vrishchika',
    number: 8,
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Mars',
    exaltation: 'Ketu',
    debilitation: 'Moon',
    symbol: 'Scorpion',
    bodyPart: 'Reproductive Organs',
    nature: 'Fixed'
  },
  {
    name: 'Dhanu',
    number: 9,
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'Jupiter',
    exaltation: 'Ketu',
    debilitation: 'Mercury',
    symbol: 'Archer',
    bodyPart: 'Thighs',
    nature: 'Dual'
  },
  {
    name: 'Makara',
    number: 10,
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn',
    exaltation: 'Mars',
    debilitation: 'Jupiter',
    symbol: 'Goat',
    bodyPart: 'Knees',
    nature: 'Movable'
  },
  {
    name: 'Kumbha',
    number: 11,
    element: 'Air',
    quality: 'Fixed',
    ruler: 'Saturn',
    exaltation: 'Rahu',
    debilitation: 'Sun',
    symbol: 'Water Bearer',
    bodyPart: 'Calves, Ankles',
    nature: 'Fixed'
  },
  {
    name: 'Meena',
    number: 12,
    element: 'Water',
    quality: 'Mutable',
    ruler: 'Jupiter',
    exaltation: 'Venus',
    debilitation: 'Mercury',
    symbol: 'Fish',
    bodyPart: 'Feet',
    nature: 'Dual'
  }
];

export const NAKSHATRAS: Omit<NakshatraInfo, 'pada' | 'degree'>[] = [
  {
    name: 'Ashwini',
    number: 1,
    ruler: 'Ketu',
    deity: 'Ashwini Kumaras',
    symbol: 'Horse Head',
    nature: 'Swift, Light',
    gana: 'Deva',
    yoni: 'Horse',
    tatva: 'Prithvi',
    varna: 'Vaishya',
    gotra: 'Marichi',
    nadi: 'Adi',
    characteristics: ['Healing', 'Speed', 'Initiative', 'Medicine']
  },
  {
    name: 'Bharani',
    number: 2,
    ruler: 'Venus',
    deity: 'Yama',
    symbol: 'Yoni',
    nature: 'Fierce, Severe',
    gana: 'Manushya',
    yoni: 'Elephant',
    tatva: 'Prithvi',
    varna: 'Kshatriya',
    gotra: 'Marichi',
    nadi: 'Adi',
    characteristics: ['Transformation', 'Restraint', 'Moral Values', 'Justice']
  },
  {
    name: 'Krittika',
    number: 3,
    ruler: 'Sun',
    deity: 'Agni',
    symbol: 'Razor/Flame',
    nature: 'Sharp, Cutting',
    gana: 'Rakshasa',
    yoni: 'Sheep',
    tatva: 'Prithvi',
    varna: 'Brahmin',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Purification', 'Cutting Through', 'Fame', 'Leadership']
  },
  {
    name: 'Rohini',
    number: 4,
    ruler: 'Moon',
    deity: 'Brahma',
    symbol: 'Cart/Chariot',
    nature: 'Fixed, Stable',
    gana: 'Manushya',
    yoni: 'Serpent',
    tatva: 'Prithvi',
    varna: 'Shudra',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Growth', 'Beauty', 'Fertility', 'Material Prosperity']
  },
  {
    name: 'Mrigashira',
    number: 5,
    ruler: 'Mars',
    deity: 'Soma',
    symbol: 'Deer Head',
    nature: 'Soft, Tender',
    gana: 'Deva',
    yoni: 'Serpent',
    tatva: 'Prithvi',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Searching', 'Curiosity', 'Gentleness', 'Creativity']
  },
  {
    name: 'Ardra',
    number: 6,
    ruler: 'Rahu',
    deity: 'Rudra',
    symbol: 'Teardrop',
    nature: 'Sharp, Destructive',
    gana: 'Manushya',
    yoni: 'Dog',
    tatva: 'Jal',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Destruction', 'Renewal', 'Storms', 'Transformation']
  },
  {
    name: 'Punarvasu',
    number: 7,
    ruler: 'Jupiter',
    deity: 'Aditi',
    symbol: 'Bow and Quiver',
    nature: 'Movable, Changeable',
    gana: 'Deva',
    yoni: 'Cat',
    tatva: 'Jal',
    varna: 'Vaishya',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Return', 'Renewal', 'Repetition', 'Safety']
  },
  {
    name: 'Pushya',
    number: 8,
    ruler: 'Saturn',
    deity: 'Brihaspati',
    symbol: 'Cow Udder',
    nature: 'Light, Swift',
    gana: 'Deva',
    yoni: 'Sheep',
    tatva: 'Jal',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Nourishment', 'Spirituality', 'Protection', 'Prosperity']
  },
  {
    name: 'Ashlesha',
    number: 9,
    ruler: 'Mercury',
    deity: 'Nagas',
    symbol: 'Serpent',
    nature: 'Sharp, Harsh',
    gana: 'Rakshasa',
    yoni: 'Cat',
    tatva: 'Jal',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Adi',
    characteristics: ['Hypnotic Power', 'Kundalini', 'Mysticism', 'Poison/Medicine']
  },
  {
    name: 'Magha',
    number: 10,
    ruler: 'Ketu',
    deity: 'Pitrs',
    symbol: 'Throne',
    nature: 'Fierce, Severe',
    gana: 'Rakshasa',
    yoni: 'Rat',
    tatva: 'Jal',
    varna: 'Shudra',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Ancestral Power', 'Tradition', 'Authority', 'Respect']
  },
  {
    name: 'Purva Phalguni',
    number: 11,
    ruler: 'Venus',
    deity: 'Bhaga',
    symbol: 'Hammock',
    nature: 'Fierce, Severe',
    gana: 'Manushya',
    yoni: 'Rat',
    tatva: 'Jal',
    varna: 'Brahmin',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Pleasure', 'Procreation', 'Rest', 'Relaxation']
  },
  {
    name: 'Uttara Phalguni',
    number: 12,
    ruler: 'Sun',
    deity: 'Aryaman',
    symbol: 'Bed',
    nature: 'Fixed, Permanent',
    gana: 'Manushya',
    yoni: 'Cow',
    tatva: 'Agni',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Patronage', 'Friendship', 'Contracts', 'Marriage']
  },
  {
    name: 'Hasta',
    number: 13,
    ruler: 'Moon',
    deity: 'Savitar',
    symbol: 'Hand',
    nature: 'Light, Swift',
    gana: 'Deva',
    yoni: 'Buffalo',
    tatva: 'Agni',
    varna: 'Vaishya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Skill', 'Craft', 'Laughter', 'Dexterity']
  },
  {
    name: 'Chitra',
    number: 14,
    ruler: 'Mars',
    deity: 'Tvashtar',
    symbol: 'Pearl',
    nature: 'Soft, Mild',
    gana: 'Rakshasa',
    yoni: 'Tiger',
    tatva: 'Agni',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Beauty', 'Illusion', 'Creativity', 'Variety']
  },
  {
    name: 'Swati',
    number: 15,
    ruler: 'Rahu',
    deity: 'Vayu',
    symbol: 'Coral',
    nature: 'Movable, Changeable',
    gana: 'Deva',
    yoni: 'Buffalo',
    tatva: 'Agni',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Independence', 'Movement', 'Flexibility', 'Trade']
  },
  {
    name: 'Vishakha',
    number: 16,
    ruler: 'Jupiter',
    deity: 'Indra-Agni',
    symbol: 'Triumphal Arch',
    nature: 'Mixed',
    gana: 'Rakshasa',
    yoni: 'Tiger',
    tatva: 'Agni',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Achievement', 'Goal-oriented', 'Determination', 'Success']
  },
  {
    name: 'Anuradha',
    number: 17,
    ruler: 'Saturn',
    deity: 'Mitra',
    symbol: 'Lotus',
    nature: 'Soft, Mild',
    gana: 'Deva',
    yoni: 'Deer',
    tatva: 'Agni',
    varna: 'Shudra',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Friendship', 'Cooperation', 'Balance', 'Devotion']
  },
  {
    name: 'Jyeshtha',
    number: 18,
    ruler: 'Mercury',
    deity: 'Indra',
    symbol: 'Earring',
    nature: 'Sharp, Harsh',
    gana: 'Rakshasa',
    yoni: 'Deer',
    tatva: 'Agni',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Madhya',
    characteristics: ['Seniority', 'Protection', 'Responsibility', 'Generosity']
  },
  {
    name: 'Mula',
    number: 19,
    ruler: 'Ketu',
    deity: 'Nirriti',
    symbol: 'Bunch of Roots',
    nature: 'Sharp, Harsh',
    gana: 'Rakshasa',
    yoni: 'Dog',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Investigation', 'Destruction', 'Foundation', 'Research']
  },
  {
    name: 'Purva Ashadha',
    number: 20,
    ruler: 'Venus',
    deity: 'Apas',
    symbol: 'Fan',
    nature: 'Fierce, Severe',
    gana: 'Manushya',
    yoni: 'Monkey',
    tatva: 'Vayu',
    varna: 'Brahmin',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Invincibility', 'Purification', 'Strength', 'Pride']
  },
  {
    name: 'Uttara Ashadha',
    number: 21,
    ruler: 'Sun',
    deity: 'Vishvadevas',
    symbol: 'Elephant Tusk',
    nature: 'Fixed, Permanent',
    gana: 'Manushya',
    yoni: 'Mongoose',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Victory', 'Final Attainment', 'Permanence', 'Support']
  },
  {
    name: 'Shravana',
    number: 22,
    ruler: 'Moon',
    deity: 'Vishnu',
    symbol: 'Ear',
    nature: 'Movable, Changeable',
    gana: 'Deva',
    yoni: 'Monkey',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Learning', 'Listening', 'Connection', 'Fame']
  },
  {
    name: 'Dhanishtha',
    number: 23,
    ruler: 'Mars',
    deity: 'Vasus',
    symbol: 'Drum',
    nature: 'Movable, Changeable',
    gana: 'Rakshasa',
    yoni: 'Lion',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Wealth', 'Music', 'Rhythm', 'Adaptability']
  },
  {
    name: 'Shatabhisha',
    number: 24,
    ruler: 'Rahu',
    deity: 'Varuna',
    symbol: 'Empty Circle',
    nature: 'Movable, Changeable',
    gana: 'Rakshasa',
    yoni: 'Horse',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Healing', 'Secrecy', 'Research', 'Mysticism']
  },
  {
    name: 'Purva Bhadrapada',
    number: 25,
    ruler: 'Jupiter',
    deity: 'Aja Ekapada',
    symbol: 'Sword',
    nature: 'Fierce, Severe',
    gana: 'Manushya',
    yoni: 'Lion',
    tatva: 'Vayu',
    varna: 'Brahmin',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Transformation', 'Spirituality', 'Sacrifice', 'Idealism']
  },
  {
    name: 'Uttara Bhadrapada',
    number: 26,
    ruler: 'Saturn',
    deity: 'Ahir Budhnya',
    symbol: 'Twin',
    nature: 'Fixed, Permanent',
    gana: 'Manushya',
    yoni: 'Cow',
    tatva: 'Vayu',
    varna: 'Kshatriya',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Depth', 'Kundalini', 'Mysticism', 'Stability']
  },
  {
    name: 'Revati',
    number: 27,
    ruler: 'Mercury',
    deity: 'Pushan',
    symbol: 'Fish',
    nature: 'Soft, Mild',
    gana: 'Deva',
    yoni: 'Elephant',
    tatva: 'Akash',
    varna: 'Shudra',
    gotra: 'Angiras',
    nadi: 'Antya',
    characteristics: ['Completion', 'Journey', 'Nourishment', 'Prosperity']
  }
];

export const VIMSHOTTARI_DASHA_YEARS: Record<string, number> = {
  'Ketu': 7,
  'Venus': 20,
  'Sun': 6,
  'Moon': 10,
  'Mars': 7,
  'Rahu': 18,
  'Jupiter': 16,
  'Saturn': 19,
  'Mercury': 17
};

export const BHAVA_NAMES = [
  'Tanu Bhava', 'Dhana Bhava', 'Sahaja Bhava', 'Sukha Bhava',
  'Putra Bhava', 'Ari Bhava', 'Kalatra Bhava', 'Ayu Bhava',
  'Dharma Bhava', 'Karma Bhava', 'Labha Bhava', 'Vyaya Bhava'
];

export const BHAVA_SIGNIFICANCES = [
  ['Self', 'Personality', 'Physical Body', 'Appearance'],
  ['Wealth', 'Family', 'Speech', 'Food'],
  ['Siblings', 'Courage', 'Short Journeys', 'Communication'],
  ['Mother', 'Home', 'Happiness', 'Property'],
  ['Children', 'Education', 'Intelligence', 'Creativity'],
  ['Enemies', 'Disease', 'Service', 'Obstacles'],
  ['Spouse', 'Partnership', 'Business', 'Marriage'],
  ['Longevity', 'Transformation', 'Occult', 'Inheritance'],
  ['Religion', 'Philosophy', 'Higher Learning', 'Long Journeys'],
  ['Career', 'Reputation', 'Authority', 'Father'],
  ['Gains', 'Friends', 'Hopes', 'Elder Siblings'],
  ['Losses', 'Expenses', 'Foreign Lands', 'Spirituality']
];