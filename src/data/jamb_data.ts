export interface Subject {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  subjectId: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'eng', name: 'Use of English' },
  { id: 'math', name: 'Mathematics' },
  { id: 'phy', name: 'Physics' },
  { id: 'geo', name: 'Geography' },
  { id: 'chem', name: 'Chemistry' },
  { id: 'bio', name: 'Biology' },
  { id: 'eco', name: 'Economics' },
  { id: 'gov', name: 'Government' },
  { id: 'lit', name: 'Literature in English' },
  { id: 'crs', name: 'Christian Religious Studies' }
];

export const QUESTIONS: Question[] = [
  // ==========================================
  // USE OF ENGLISH
  // ==========================================
  { id: 'eng1', subjectId: 'eng', text: 'Choose the word most nearly opposite in meaning to the italicized word: The young man was *arrogant* in his behavior.', optionA: 'Humble', optionB: 'Proud', optionC: 'Ignorant', optionD: 'Stupid', correctOption: 'A' },
  { id: 'eng2', subjectId: 'eng', text: 'Fill in the blank: Neither the principal nor the teachers _____ present at the meeting.', optionA: 'was', optionB: 'were', optionC: 'is', optionD: 'are', correctOption: 'B' },
  { id: 'eng3', subjectId: 'eng', text: 'Identify the figure of speech in the following sentence: "The sun smiled down on the children playing in the park."', optionA: 'Simile', optionB: 'Metaphor', optionC: 'Personification', optionD: 'Hyperbole', correctOption: 'C' },
  { id: 'eng4', subjectId: 'eng', text: 'Choose the option that best completes the sentence: If I had known he was coming, I _____ prepared some food.', optionA: 'will have', optionB: 'would have', optionC: 'have', optionD: 'had', correctOption: 'B' },
  { id: 'eng5', subjectId: 'eng', text: 'Which of the following words is correctly spelt?', optionA: 'Accomodation', optionB: 'Accommodation', optionC: 'Acommodation', optionD: 'Acomodation', correctOption: 'B' },

  // ==========================================
  // MATHEMATICS
  // ==========================================
  { id: 'math1', subjectId: 'math', text: 'Evaluate: log10(100) + log10(10)', optionA: '2', optionB: '3', optionC: '10', optionD: '100', correctOption: 'B' },
  { id: 'math2', subjectId: 'math', text: 'Find the derivative of y = 3x^2 + 2x - 5', optionA: '6x + 2', optionB: '3x + 2', optionC: '6x - 5', optionD: 'x^2 + 2', correctOption: 'A' },
  { id: 'math3', subjectId: 'math', text: 'If a matrix has 3 rows and 4 columns, what is its order?', optionA: '4 x 3', optionB: '3 x 4', optionC: '7', optionD: '12', correctOption: 'B' },
  { id: 'math4', subjectId: 'math', text: 'Solve for x: 2x - 5 = 11', optionA: '3', optionB: '8', optionC: '16', optionD: '6', correctOption: 'B' },
  { id: 'math5', subjectId: 'math', text: 'What is the sum of the interior angles of a hexagon?', optionA: '360 degrees', optionB: '540 degrees', optionC: '720 degrees', optionD: '900 degrees', correctOption: 'C' },

  // ==========================================
  // PHYSICS
  // ==========================================
  { id: 'phy1', subjectId: 'phy', text: 'Which of the following is a scalar quantity?', optionA: 'Velocity', optionB: 'Force', optionC: 'Mass', optionD: 'Acceleration', correctOption: 'C' },
  { id: 'phy2', subjectId: 'phy', text: 'Calculate the work done when a force of 20N moves an object through a distance of 5m in the direction of the force.', optionA: '15 J', optionB: '25 J', optionC: '100 J', optionD: '4 J', correctOption: 'C' },
  { id: 'phy3', subjectId: 'phy', text: 'The SI unit of electrical resistance is the:', optionA: 'Ampere', optionB: 'Volt', optionC: 'Ohm', optionD: 'Watt', correctOption: 'C' },
  { id: 'phy4', subjectId: 'phy', text: 'Which of the following electromagnetic waves has the highest frequency?', optionA: 'Radio waves', optionB: 'Microwaves', optionC: 'X-rays', optionD: 'Gamma rays', correctOption: 'D' },
  { id: 'phy5', subjectId: 'phy', text: 'The process by which a solid changes directly into a gas without passing through the liquid state is called:', optionA: 'Evaporation', optionB: 'Condensation', optionC: 'Sublimation', optionD: 'Melting', correctOption: 'C' },

  // ==========================================
  // GEOGRAPHY
  // ==========================================
  { id: 'geo1', subjectId: 'geo', text: 'The instrument used for measuring wind speed is the:', optionA: 'Barometer', optionB: 'Anemometer', optionC: 'Hygrometer', optionD: 'Thermometer', correctOption: 'B' },
  { id: 'geo2', subjectId: 'geo', text: 'Which of the following planets is closest to the sun?', optionA: 'Venus', optionB: 'Earth', optionC: 'Mercury', optionD: 'Mars', correctOption: 'C' },
  { id: 'geo3', subjectId: 'geo', text: 'The largest continent by land area is:', optionA: 'Africa', optionB: 'North America', optionC: 'Asia', optionD: 'Europe', correctOption: 'C' },
  { id: 'geo4', subjectId: 'geo', text: 'Which of the following is an example of an igneous rock?', optionA: 'Limestone', optionB: 'Marble', optionC: 'Granite', optionD: 'Sandstone', correctOption: 'C' },
  { id: 'geo5', subjectId: 'geo', text: 'The imaginary line that divides the Earth into the Northern and Southern Hemispheres is the:', optionA: 'Prime Meridian', optionB: 'Tropic of Cancer', optionC: 'Equator', optionD: 'Tropic of Capricorn', correctOption: 'C' },

  // ==========================================
  // CHEMISTRY
  // ==========================================
  { id: 'chem1', subjectId: 'chem', text: 'What is the chemical symbol for Gold?', optionA: 'Ag', optionB: 'Au', optionC: 'Pb', optionD: 'Fe', correctOption: 'B' },
  { id: 'chem2', subjectId: 'chem', text: 'The pH of a neutral solution is:', optionA: '0', optionB: '7', optionC: '14', optionD: '1', correctOption: 'B' },
  { id: 'chem3', subjectId: 'chem', text: 'Which gas is most abundant in the Earth\'s atmosphere?', optionA: 'Oxygen', optionB: 'Carbon Dioxide', optionC: 'Nitrogen', optionD: 'Hydrogen', correctOption: 'C' },

  // ==========================================
  // BIOLOGY
  // ==========================================
  { id: 'bio1', subjectId: 'bio', text: 'The powerhouse of the cell is the:', optionA: 'Nucleus', optionB: 'Ribosome', optionC: 'Mitochondrion', optionD: 'Chloroplast', correctOption: 'C' },
  { id: 'bio2', subjectId: 'bio', text: 'Which of the following blood groups is considered the universal donor?', optionA: 'A', optionB: 'B', optionC: 'AB', optionD: 'O', correctOption: 'D' },
  { id: 'bio3', subjectId: 'bio', text: 'The process by which plants make their own food is called:', optionA: 'Respiration', optionB: 'Transpiration', optionC: 'Photosynthesis', optionD: 'Digestion', correctOption: 'C' }
];
