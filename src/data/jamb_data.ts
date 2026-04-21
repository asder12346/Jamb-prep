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
  // USE OF ENGLISH (eng)
  // ==========================================
  { id: 'eng1', subjectId: 'eng', text: 'Choose the word most nearly opposite in meaning to the italicized word: The young man was *arrogant* in his behavior.', optionA: 'Humble', optionB: 'Proud', optionC: 'Ignorant', optionD: 'Stupid', correctOption: 'A' },
  { id: 'eng2', subjectId: 'eng', text: 'Fill in the blank: Neither the principal nor the teachers _____ present at the meeting.', optionA: 'was', optionB: 'were', optionC: 'is', optionD: 'are', correctOption: 'B' },
  { id: 'eng3', subjectId: 'eng', text: 'Identify the figure of speech: "The sun smiled down on the children playing in the park."', optionA: 'Simile', optionB: 'Metaphor', optionC: 'Personification', optionD: 'Hyperbole', correctOption: 'C' },
  { id: 'eng4', subjectId: 'eng', text: 'Choose the option that best completes the sentence: If I had known he was coming, I _____ prepared some food.', optionA: 'will have', optionB: 'would have', optionC: 'have', optionD: 'had', correctOption: 'B' },
  { id: 'eng5', subjectId: 'eng', text: 'Which of the following words is correctly spelt?', optionA: 'Accomodation', optionB: 'Accommodation', optionC: 'Acommodation', optionD: 'Acomodation', correctOption: 'B' },
  { id: 'eng6', subjectId: 'eng', text: 'Choose the option nearest in meaning to the italicised word: The new policy is *detrimental* to our progress.', optionA: 'Beneficial', optionB: 'Harmful', optionC: 'Indifferent', optionD: 'Inconsequential', correctOption: 'B' },
  { id: 'eng7', subjectId: 'eng', text: 'Fill in the blank: The man was charged ____ murder.', optionA: 'for', optionB: 'with', optionC: 'of', optionD: 'about', correctOption: 'B' },
  { id: 'eng8', subjectId: 'eng', text: 'From the options, choose the expression that best completes the sentence: He is looking forward ____ you.', optionA: 'to seeing', optionB: 'to see', optionC: 'seeing', optionD: 'having seen', correctOption: 'A' },
  { id: 'eng9', subjectId: 'eng', text: 'Identify the correct sentence:', optionA: 'He gave me an advice.', optionB: 'He gave me some advice.', optionC: 'He gave me some advices.', optionD: 'He gave me many advices.', correctOption: 'B' },
  { id: 'eng10', subjectId: 'eng', text: 'Choose the word that has the same consonant sound as the italicized letter in *chief*.', optionA: 'Machine', optionB: 'Chore', optionC: 'Cheque', optionD: 'Ocean', correctOption: 'B' },
  { id: 'eng11', subjectId: 'eng', text: 'Fill in the blank: The students were asked to hand ____ their assignments.', optionA: 'over', optionB: 'in', optionC: 'down', optionD: 'out', correctOption: 'B' },
  { id: 'eng12', subjectId: 'eng', text: 'Complete the idiom: By the skin of one\'s...', optionA: 'fingers', optionB: 'nose', optionC: 'teeth', optionD: 'mouth', correctOption: 'C' },

  // ==========================================
  // MATHEMATICS (math)
  // ==========================================
  { id: 'math1', subjectId: 'math', text: 'Evaluate: log10(100) + log10(10)', optionA: '2', optionB: '3', optionC: '10', optionD: '100', correctOption: 'B' },
  { id: 'math2', subjectId: 'math', text: 'Find the derivative of y = 3x^2 + 2x - 5', optionA: '6x + 2', optionB: '3x + 2', optionC: '6x - 5', optionD: 'x^2 + 2', correctOption: 'A' },
  { id: 'math3', subjectId: 'math', text: 'If a matrix has 3 rows and 4 columns, what is its order?', optionA: '4 x 3', optionB: '3 x 4', optionC: '7', optionD: '12', correctOption: 'B' },
  { id: 'math4', subjectId: 'math', text: 'Solve for x: 2x - 5 = 11', optionA: '3', optionB: '8', optionC: '16', optionD: '6', correctOption: 'B' },
  { id: 'math5', subjectId: 'math', text: 'What is the sum of the interior angles of a hexagon?', optionA: '360 degrees', optionB: '540 degrees', optionC: '720 degrees', optionD: '900 degrees', correctOption: 'C' },
  { id: 'math6', subjectId: 'math', text: 'Find the simple interest on ₦50,000 for 3 years at 5% per annum.', optionA: '₦7,500', optionB: '₦15,000', optionC: '₦2,500', optionD: '₦57,500', correctOption: 'A' },
  { id: 'math7', subjectId: 'math', text: 'Solve the simultaneous equations: x + y = 5, 2x - y = 4', optionA: 'x=2, y=3', optionB: 'x=3, y=2', optionC: 'x=4, y=1', optionD: 'x=1, y=4', correctOption: 'B' },
  { id: 'math8', subjectId: 'math', text: 'A bag contains 3 red balls and 5 green balls. What is the probability of picking a green ball?', optionA: '3/8', optionB: '5/8', optionC: '1/2', optionD: '5/3', correctOption: 'B' },
  { id: 'math9', subjectId: 'math', text: 'Calculate the area of a circle with radius 7cm. (Take π = 22/7)', optionA: '44 cm²', optionB: '154 cm²', optionC: '22 cm²', optionD: '77 cm²', correctOption: 'B' },
  { id: 'math10', subjectId: 'math', text: 'Make x the actual subject of the formula: y = 2x + 3', optionA: 'x = (y - 3) / 2', optionB: 'x = 2y - 3', optionC: 'x = y / 2 - 3', optionD: 'x = y - 3 / 2', correctOption: 'A' },

  // ==========================================
  // PHYSICS (phy)
  // ==========================================
  { id: 'phy1', subjectId: 'phy', text: 'Which of the following is a scalar quantity?', optionA: 'Velocity', optionB: 'Force', optionC: 'Mass', optionD: 'Acceleration', correctOption: 'C' },
  { id: 'phy2', subjectId: 'phy', text: 'Calculate the work done when a force of 20N moves an object through a distance of 5m in the direction of the force.', optionA: '15 J', optionB: '25 J', optionC: '100 J', optionD: '4 J', correctOption: 'C' },
  { id: 'phy3', subjectId: 'phy', text: 'The SI unit of electrical resistance is the:', optionA: 'Ampere', optionB: 'Volt', optionC: 'Ohm', optionD: 'Watt', correctOption: 'C' },
  { id: 'phy4', subjectId: 'phy', text: 'Which of the following electromagnetic waves has the highest frequency?', optionA: 'Radio waves', optionB: 'Microwaves', optionC: 'X-rays', optionD: 'Gamma rays', correctOption: 'D' },
  { id: 'phy5', subjectId: 'phy', text: 'The process by which a solid changes directly into a gas without passing through the liquid state is called:', optionA: 'Evaporation', optionB: 'Condensation', optionC: 'Sublimation', optionD: 'Melting', correctOption: 'C' },
  { id: 'phy6', subjectId: 'phy', text: 'The instrument used to measure the current in a circuit is called:', optionA: 'Voltmeter', optionB: 'Ammeter', optionC: 'Galvanometer', optionD: 'Potentiometer', correctOption: 'B' },
  { id: 'phy7', subjectId: 'phy', text: 'An object of mass 2kg is moving with a velocity of 5m/s. Calculate its kinetic energy.', optionA: '10 J', optionB: '25 J', optionC: '50 J', optionD: '5 J', correctOption: 'B' },
  { id: 'phy8', subjectId: 'phy', text: 'Which of these is a derived unit?', optionA: 'Kilogram', optionB: 'Meter', optionC: 'Newton', optionD: 'Second', correctOption: 'C' },
  { id: 'phy9', subjectId: 'phy', text: 'The phenomenon where light bends as it passes from one medium to another is known as:', optionA: 'Reflection', optionB: 'Refraction', optionC: 'Diffraction', optionD: 'Dispersion', correctOption: 'B' },
  { id: 'phy10', subjectId: 'phy', text: 'Acceleration due to gravity on earth is approximately:', optionA: '9.8 m/s²', optionB: '6.67 x 10^-11 Nm²/kg²', optionC: '3 x 10^8 m/s', optionD: '1.6 m/s²', correctOption: 'A' },

  // ==========================================
  // CHEMISTRY (chem)
  // ==========================================
  { id: 'chem1', subjectId: 'chem', text: 'What is the chemical symbol for Gold?', optionA: 'Ag', optionB: 'Au', optionC: 'Pb', optionD: 'Fe', correctOption: 'B' },
  { id: 'chem2', subjectId: 'chem', text: 'The pH of a neutral solution is:', optionA: '0', optionB: '7', optionC: '14', optionD: '1', correctOption: 'B' },
  { id: 'chem3', subjectId: 'chem', text: 'Which gas is most abundant in the Earth\'s atmosphere?', optionA: 'Oxygen', optionB: 'Carbon Dioxide', optionC: 'Nitrogen', optionD: 'Hydrogen', correctOption: 'C' },
  { id: 'chem4', subjectId: 'chem', text: 'The subatomic particle with no electrical charge is the:', optionA: 'Proton', optionB: 'Electron', optionC: 'Neutron', optionD: 'Positron', correctOption: 'C' },
  { id: 'chem5', subjectId: 'chem', text: 'What type of bond involves the sharing of electron pairs between atoms?', optionA: 'Ionic bond', optionB: 'Covalent bond', optionC: 'Metallic bond', optionD: 'Hydrogen bond', correctOption: 'B' },
  { id: 'chem6', subjectId: 'chem', text: 'The process of turning liquid into vapor below its boiling point is:', optionA: 'Condensation', optionB: 'Sublimation', optionC: 'Evaporation', optionD: 'Freezing', correctOption: 'C' },
  { id: 'chem7', subjectId: 'chem', text: 'An alloy is a mixture of:', optionA: 'Two or more metals', optionB: 'Two non-metals', optionC: 'A metal and a gas', optionD: 'Acids and bases', correctOption: 'A' },
  { id: 'chem8', subjectId: 'chem', text: 'The atomic number of an element is determined by the number of:', optionA: 'Neutrons', optionB: 'Protons', optionC: 'Electrons', optionD: 'Nucleons', correctOption: 'B' },
  { id: 'chem9', subjectId: 'chem', text: 'What is the formula of tetraoxosulphate(VI) acid?', optionA: 'H2SO3', optionB: 'HSO4', optionC: 'H2S', optionD: 'H2SO4', correctOption: 'D' },
  { id: 'chem10', subjectId: 'chem', text: 'Which of the following is an endothermic process?', optionA: 'Combustion', optionB: 'Melting of ice', optionC: 'Rusting of iron', optionD: 'Respiration', correctOption: 'B' },

  // ==========================================
  // BIOLOGY (bio)
  // ==========================================
  { id: 'bio1', subjectId: 'bio', text: 'The powerhouse of the cell is the:', optionA: 'Nucleus', optionB: 'Ribosome', optionC: 'Mitochondrion', optionD: 'Chloroplast', correctOption: 'C' },
  { id: 'bio2', subjectId: 'bio', text: 'Which of the following blood groups is considered the universal donor?', optionA: 'A', optionB: 'B', optionC: 'AB', optionD: 'O', correctOption: 'D' },
  { id: 'bio3', subjectId: 'bio', text: 'The process by which plants make their own food is called:', optionA: 'Respiration', optionB: 'Transpiration', optionC: 'Photosynthesis', optionD: 'Digestion', correctOption: 'C' },
  { id: 'bio4', subjectId: 'bio', text: 'Which of the following is not a characteristic of living organisms?', optionA: 'Growth', optionB: 'Reproduction', optionC: 'Locomotion', optionD: 'Crystallization', correctOption: 'D' },
  { id: 'bio5', subjectId: 'bio', text: 'In genetics, the actual physical appearance of an organism is known as its:', optionA: 'Genotype', optionB: 'Phenotype', optionC: 'Allele', optionD: 'Chromsome', correctOption: 'B' },
  { id: 'bio6', subjectId: 'bio', text: 'The human heart consists of how many chambers?', optionA: '2', optionB: '3', optionC: '4', optionD: '5', correctOption: 'C' },
  { id: 'bio7', subjectId: 'bio', text: 'Which part of the brain controls voluntary actions and memory?', optionA: 'Cerebellum', optionB: 'Cerebrum', optionC: 'Medulla oblongata', optionD: 'Hypothalamus', correctOption: 'B' },
  { id: 'bio8', subjectId: 'bio', text: 'The fundamental unit of inheritance is the:', optionA: 'Gene', optionB: 'Cell', optionC: 'Tissue', optionD: 'Organism', correctOption: 'A' },
  { id: 'bio9', subjectId: 'bio', text: 'Which organ is primarily responsible for filtering blood in the human body?', optionA: 'Liver', optionB: 'Kidney', optionC: 'Heart', optionD: 'Pancreas', correctOption: 'B' },
  { id: 'bio10', subjectId: 'bio', text: 'A collection of tissues performing a specific function is an:', optionA: 'Cell', optionB: 'Organ', optionC: 'Organ system', optionD: 'Organism', correctOption: 'B' },

  // ==========================================
  // ECONOMICS (eco)
  // ==========================================
  { id: 'eco1', subjectId: 'eco', text: 'Economics is primarily described as the study of:', optionA: 'Money and banking', optionB: 'Wealth accumulation', optionC: 'The allocation of scarce resources', optionD: 'Government policy', correctOption: 'C' },
  { id: 'eco2', subjectId: 'eco', text: 'Opportunity cost is best defined as:', optionA: 'The total cost of production', optionB: 'The monetary value of an item', optionC: 'The next best alternative forgone', optionD: 'The sunk cost of a business', correctOption: 'C' },
  { id: 'eco3', subjectId: 'eco', text: 'Which of the following describes a market with only one seller?', optionA: 'Oligopoly', optionB: 'Monopoly', optionC: 'Monopsony', optionD: 'Perfect Competition', correctOption: 'B' },
  { id: 'eco4', subjectId: 'eco', text: 'The law of demand states that, all else being equal:', optionA: 'As price rises, quantity demanded falls', optionB: 'As price rises, quantity demanded rises', optionC: 'Price and demand are unrelated', optionD: 'Demand increases with supply', correctOption: 'A' },
  { id: 'eco5', subjectId: 'eco', text: 'Inflation is fundamentally defined as:', optionA: 'A general increase in price levels over time', optionB: 'A decrease in the money supply', optionC: 'An increase in unemployment', optionD: 'A drop in consumer spending', correctOption: 'A' },
  { id: 'eco6', subjectId: 'eco', text: 'A change in quantity supplied is depicted graphically as:', optionA: 'A shift in the supply curve', optionB: 'A movement along the supply curve', optionC: 'A vertical supply curve', optionD: 'A horizontal supply curve', correctOption: 'B' },
  { id: 'eco7', subjectId: 'eco', text: 'National Income is most accurately estimated by measuring:', optionA: 'Gross Domestic Product', optionB: 'Net exports', optionC: 'Personal disposable income', optionD: 'Government spending', correctOption: 'A' },
  { id: 'eco8', subjectId: 'eco', text: 'A regressive tax system places a heavier burden on:', optionA: 'High-income earners', optionB: 'Low-income earners', optionC: 'Corporations', optionD: 'Foreign investors', correctOption: 'B' },
  { id: 'eco9', subjectId: 'eco', text: 'Which function of money helps eliminate the double coincidence of wants?', optionA: 'Store of value', optionB: 'Standard of deferred payment', optionC: 'Medium of exchange', optionD: 'Unit of account', correctOption: 'C' },
  { id: 'eco10', subjectId: 'eco', text: 'The concept of elasticity of demand measures:', optionA: 'The responsiveness of demand to price changes', optionB: 'The profit margins of producers', optionC: 'The durability of goods', optionD: 'Government tax revenue', correctOption: 'A' },

  // ==========================================
  // GOVERNMENT (gov)
  // ==========================================
  { id: 'gov1', subjectId: 'gov', text: 'The principle of the rule of law implies that:', optionA: 'Lawyers rule the nation', optionB: 'Nobody is above the law', optionC: 'The president makes all laws', optionD: 'Laws are unbreakable', correctOption: 'B' },
  { id: 'gov2', subjectId: 'gov', text: 'Which organ of government is primarily responsible for interpreting the law?', optionA: 'The Executive', optionB: 'The Legislature', optionC: 'The Judiciary', optionD: 'The Civil Service', correctOption: 'C' },
  { id: 'gov3', subjectId: 'gov', text: 'A system of government where ultimate power rests with the people is called:', optionA: 'Autocracy', optionB: 'Oligarchy', optionC: 'Democracy', optionD: 'Monarchy', correctOption: 'C' },
  { id: 'gov4', subjectId: 'gov', text: 'Bicameralism refers to a legislature with:', optionA: 'One chamber', optionB: 'Two chambers', optionC: 'Three chambers', optionD: 'No chambers', correctOption: 'B' },
  { id: 'gov5', subjectId: 'gov', text: 'The systematic process of separating powers among the organs of government was popularized by:', optionA: 'A.V. Dicey', optionB: 'Karl Marx', optionC: 'Baron de Montesquieu', optionD: 'Thomas Hobbes', correctOption: 'C' },
  { id: 'gov6', subjectId: 'gov', text: 'In a federal system of government, power is:', optionA: 'Concentrated in the center', optionB: 'Shared between the central and regional governments', optionC: 'Given entirely to the states', optionD: 'Controlled by the military', correctOption: 'B' },
  { id: 'gov7', subjectId: 'gov', text: 'Franchise in government refers to:', optionA: 'The right to vote in public elections', optionB: 'The right to own property', optionC: 'Freedom of speech', optionD: 'A business license', correctOption: 'A' },
  { id: 'gov8', subjectId: 'gov', text: 'An election held to fill a vacant seat in the legislature before a general election is called:', optionA: 'Primary election', optionB: 'General election', optionC: 'Bye-election', optionD: 'Referendum', correctOption: 'C' },
  { id: 'gov9', subjectId: 'gov', text: 'The highest court of appeal in Nigeria is the:', optionA: 'Court of Appeal', optionB: 'High Court', optionC: 'Supreme Court', optionD: 'Federal High Court', correctOption: 'C' },
  { id: 'gov10', subjectId: 'gov', text: 'Which international organization replaced the League of Nations?', optionA: 'African Union', optionB: 'United Nations', optionC: 'ECOWAS', optionD: 'Commonwealth of Nations', correctOption: 'B' },

  // ==========================================
  // GEOGRAPHY (geo)
  // ==========================================
  { id: 'geo1', subjectId: 'geo', text: 'The instrument used for measuring wind speed is the:', optionA: 'Barometer', optionB: 'Anemometer', optionC: 'Hygrometer', optionD: 'Thermometer', correctOption: 'B' },
  { id: 'geo2', subjectId: 'geo', text: 'Which of the following planets is closest to the sun?', optionA: 'Venus', optionB: 'Earth', optionC: 'Mercury', optionD: 'Mars', correctOption: 'C' },
  { id: 'geo3', subjectId: 'geo', text: 'The largest continent by land area is:', optionA: 'Africa', optionB: 'North America', optionC: 'Asia', optionD: 'Europe', correctOption: 'C' },
  { id: 'geo4', subjectId: 'geo', text: 'Which of the following is an example of an igneous rock?', optionA: 'Limestone', optionB: 'Marble', optionC: 'Granite', optionD: 'Sandstone', correctOption: 'C' },
  { id: 'geo5', subjectId: 'geo', text: 'The imaginary line that divides the Earth into the Northern and Southern Hemispheres is the:', optionA: 'Prime Meridian', optionB: 'Tropic of Cancer', optionC: 'Equator', optionD: 'Tropic of Capricorn', correctOption: 'C' },
  { id: 'geo6', subjectId: 'geo', text: 'The process of wearing away of rocks at the earth surface is known as:', optionA: 'Erosion', optionB: 'Weathering', optionC: 'Deposition', optionD: 'Transportation', correctOption: 'B' },
  { id: 'geo7', subjectId: 'geo', text: 'Which of these is NOT a type of rainfall?', optionA: 'Convectional', optionB: 'Relief', optionC: 'Cyclonic', optionD: 'Latitudinal', correctOption: 'D' },
  { id: 'geo8', subjectId: 'geo', text: 'The point strictly below the epicenter of an earthquake is the:', optionA: 'Focus', optionB: 'Fault line', optionC: 'Mantle', optionD: 'Crater', correctOption: 'A' },
  
  // ==========================================
  // LITERATURE IN ENGLISH (lit)
  // ==========================================
  { id: 'lit1', subjectId: 'lit', text: 'Which literary term describes the repetition of consonant sounds at the beginning of words?', optionA: 'Assonance', optionB: 'Alliteration', optionC: 'Rhyme', optionD: 'Meter', correctOption: 'B' },
  { id: 'lit2', subjectId: 'lit', text: 'A tragic flaw that brings about the downfall of a tragic hero is known as:', optionA: 'Catharsis', optionB: 'Hamartia', optionC: 'Hubris', optionD: 'Nemesis', correctOption: 'B' },
  { id: 'lit3', subjectId: 'lit', text: 'A poem consisting of 14 lines is called a:', optionA: 'Ballad', optionB: 'Sonnet', optionC: 'Ode', optionD: 'Lyric', correctOption: 'B' },
  { id: 'lit4', subjectId: 'lit', text: 'In drama, words spoken by a character alone on stage to reveal their inner thoughts are called:', optionA: 'Dialogue', optionB: 'Monologue', optionC: 'Soliloquy', optionD: 'Aside', correctOption: 'C' },
  { id: 'lit5', subjectId: 'lit', text: 'The central idea or underlying meaning of a literary work is the:', optionA: 'Plot', optionB: 'Theme', optionC: 'Setting', optionD: 'Tone', correctOption: 'B' },

  // ==========================================
  // CHRISTIAN RELIGIOUS STUDIES (crs)
  // ==========================================
  { id: 'crs1', subjectId: 'crs', text: 'According to the book of Genesis, God created man on the:', optionA: 'Third day', optionB: 'Fourth day', optionC: 'Fifth day', optionD: 'Sixth day', correctOption: 'D' },
  { id: 'crs2', subjectId: 'crs', text: 'Who led the Israelites across the Red Sea?', optionA: 'Joshua', optionB: 'Moses', optionC: 'Aaron', optionD: 'David', correctOption: 'B' },
  { id: 'crs3', subjectId: 'crs', text: 'Where was Jesus born?', optionA: 'Nazareth', optionB: 'Jerusalem', optionC: 'Bethlehem', optionD: 'Jericho', correctOption: 'C' },
  { id: 'crs4', subjectId: 'crs', text: 'The first martyr of the early Christian church was:', optionA: 'Peter', optionB: 'Paul', optionC: 'Stephen', optionD: 'James', correctOption: 'C' },
  { id: 'crs5', subjectId: 'crs', text: 'According to Jesus, the greatest commandment is to:', optionA: 'Keep the Sabbath', optionB: 'Love God with all your heart', optionC: 'Honor your father and mother', optionD: 'Do not murder', correctOption: 'B' }
];
