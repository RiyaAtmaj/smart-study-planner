export interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  chapter?: string;
  class: number; // 1-10 for CBSE classes
  type: 'website' | 'pdf' | 'website' | 'article' | 'quiz';
  url: string;
  source: string;
  tags: string[];
}

export const CBSE_RESOURCES: Resource[] = [
  // Mathematics - Class 10
  {
    id: 'math-10-real-numbers',
    title: 'Real Numbers - Complete Chapter',
    description: 'Learn about Euclid\'s Division Algorithm, Fundamental Theorem of Arithmetic, and rational/irrational numbers.',
    subject: 'Mathematics',
    chapter: 'Real Numbers',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:real-numbers',
    source: 'Khan Academy',
    tags: ['real numbers', 'euclid', 'irrational', 'rational']
  },
  {
    id: 'math-10-polynomials',
    title: 'Polynomials - Geometrical Meaning',
    description: 'Understanding polynomials, their degrees, and graphical representations.',
    subject: 'Mathematics',
    chapter: 'Polynomials',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:polynomials',
    source: 'BYJU\'S',
    tags: ['polynomials', 'graphs', 'degree', 'zeros']
  },
  {
    id: 'math-10-quadratic-equations',
    title: 'Quadratic Equations - Factorization Method',
    description: 'Solving quadratic equations using factorization, completing square, and quadratic formula.',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/algebra/quadratics',
    source: 'Vedantu',
    tags: ['quadratic', 'factorization', 'discriminant', 'roots']
  },

  // Science - Class 10
  {
    id: 'science-10-chemical-reactions',
    title: 'Chemical Reactions and Equations',
    description: 'Types of chemical reactions, balancing equations, and oxidation-reduction reactions.',
    subject: 'Science',
    chapter: 'Chemical Reactions and Equations',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/chemical-reactions-stoichiometry',
    source: 'Khan Academy',
    tags: ['chemical reactions', 'balancing', 'oxidation', 'reduction']
  },
  {
    id: 'science-10-acids-bases',
    title: 'Acids, Bases and Salts',
    description: 'Properties of acids and bases, pH scale, and neutralization reactions.',
    subject: 'Science',
    chapter: 'Acids, Bases and Salts',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/acids-and-bases',
    source: 'BYJU\'S',
    tags: ['acids', 'bases', 'ph', 'neutralization']
  },
  {
    id: 'science-10-electricity',
    title: 'Electricity - Ohm\'s Law',
    description: 'Electric current, potential difference, resistance, and Ohm\'s law.',
    subject: 'Science',
    chapter: 'Electricity',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/physics/electricity-and-magnetism',
    source: 'Vedantu',
    tags: ['electricity', 'ohms law', 'resistance', 'current']
  },

  // English - Class 10
  {
    id: 'english-10-merchant-venice',
    title: 'The Merchant of Venice - Summary',
    description: 'Complete summary and analysis of Shakespeare\'s The Merchant of Venice.',
    subject: 'English',
    chapter: 'The Merchant of Venice',
    class: 10,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=TheMerchantOfVenice',
    source: 'NCERT Solutions',
    tags: ['shakespeare', 'drama', 'venice', 'portia']
  },
  {
    id: 'english-10-grammar-tenses',
    title: 'English Grammar - Tenses',
    description: 'Complete guide to English tenses with examples and practice exercises.',
    subject: 'English',
    chapter: 'Grammar - Tenses',
    class: 10,
    type: 'pdf',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=GrammarTenses',
    source: 'CBSE Study Material',
    tags: ['grammar', 'tenses', 'english', 'practice']
  },

  // Social Science - Class 10
  {
    id: 'social-10-democracy',
    title: 'Democracy and Diversity',
    description: 'Understanding democracy, its challenges, and promoting diversity.',
    subject: 'Social Science',
    chapter: 'Democracy and Diversity',
    class: 10,
    type: 'website',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=democracy-and-diversity',
    source: 'Khan Academy',
    tags: ['democracy', 'diversity', 'politics', 'social']
  },
  {
    id: 'social-10-gender-religion',
    title: 'Gender, Religion and Caste',
    description: 'Social inequalities based on gender, religion, and caste systems.',
    subject: 'Social Science',
    chapter: 'Gender, Religion and Caste',
    class: 10,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=gender-religion-caste',
    source: 'NCERT',
    tags: ['gender', 'religion', 'caste', 'inequality']
  },

  // Hindi - Class 10
  {
    id: 'hindi-10-kavita',
    title: 'हिंदी कविता - माधुर्य',
    description: 'हिंदी कविता की समझ और विश्लेषण।',
    subject: 'Hindi',
    chapter: 'कविता',
    class: 10,
    type: 'website',
    url: 'https://ncert.nic.in/textbook.php?le=hindi&chap=kavita',
    source: 'CBSE Hindi',
    tags: ['कविता', 'हिंदी', 'साहित्य', 'कवि']
  },

  // Mathematics - Class 10 (more chapters)
  {
    id: 'math-10-pair-linear-equations',
    title: 'Pair of Linear Equations in Two Variables',
    description: 'Solving systems of linear equations using graphical, substitution, and elimination methods.',
    subject: 'Mathematics',
    chapter: 'Pair of Linear Equations in Two Variables',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/algebra/linear-systems',
    source: 'Vedantu',
    tags: ['linear equations', 'systems', 'substitution', 'elimination']
  },
  {
    id: 'math-10-triangles',
    title: 'Triangles - Similarity and Congruence',
    description: 'Properties of similar and congruent triangles, theorems, and applications.',
    subject: 'Mathematics',
    chapter: 'Triangles',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/geometry/triangles',
    source: 'Khan Academy',
    tags: ['triangles', 'similarity', 'congruence', 'theorems']
  },
  {
    id: 'math-10-coordinate-geometry',
    title: 'Coordinate Geometry - Distance Formula',
    description: 'Distance between two points, section formula, and area of triangle.',
    subject: 'Mathematics',
    chapter: 'Coordinate Geometry',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/geometry/coordinate-geometry',
    source: 'BYJU\'S',
    tags: ['coordinate geometry', 'distance formula', 'section formula']
  },
  {
    id: 'math-10-trigonometry',
    title: 'Introduction to Trigonometry',
    description: 'Trigonometric ratios, identities, and their applications.',
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/trigonometry',
    source: 'Vedantu',
    tags: ['trigonometry', 'ratios', 'identities', 'applications']
  },
  {
    id: 'math-10-statistics',
    title: 'Statistics - Mean, Median, Mode',
    description: 'Measures of central tendency and cumulative frequency distribution.',
    subject: 'Mathematics',
    chapter: 'Statistics',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/math/statistics-probability',
    source: 'Khan Academy',
    tags: ['statistics', 'mean', 'median', 'mode', 'frequency']
  },

  // Science - Class 10 (more chapters)
  {
    id: 'science-10-carbon-compounds',
    title: 'Carbon and its Compounds',
    description: 'Organic chemistry basics, hydrocarbons, and functional groups.',
    subject: 'Science',
    chapter: 'Carbon and its Compounds',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/organic-chemistry',
    source: 'BYJU\'S',
    tags: ['carbon', 'organic chemistry', 'hydrocarbons', 'functional groups']
  },
  {
    id: 'science-10-periodic-classification',
    title: 'Periodic Classification of Elements',
    description: 'Mendeleev\'s and modern periodic table, trends in properties.',
    subject: 'Science',
    chapter: 'Periodic Classification of Elements',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/periodic-table',
    source: 'Vedantu',
    tags: ['periodic table', 'mendeleev', 'elements', 'properties']
  },
  {
    id: 'science-10-light-reflection',
    title: 'Light - Reflection and Refraction',
    description: 'Laws of reflection, refraction, lenses, and mirrors.',
    subject: 'Science',
    chapter: 'Light - Reflection and Refraction',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/physics/light-waves',
    source: 'Khan Academy',
    tags: ['light', 'reflection', 'refraction', 'lenses', 'mirrors']
  },
  {
    id: 'science-10-human-eye',
    title: 'The Human Eye and Colourful World',
    description: 'Structure of human eye, defects, and dispersion of light.',
    subject: 'Science',
    chapter: 'The Human Eye and Colourful World',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/physics/light-waves/v/vision',
    source: 'BYJU\'S',
    tags: ['human eye', 'vision', 'defects', 'dispersion']
  },
  {
    id: 'science-10-magnetic-effects',
    title: 'Magnetic Effects of Electric Current',
    description: 'Electromagnets, electric motors, and generators.',
    subject: 'Science',
    chapter: 'Magnetic Effects of Electric Current',
    class: 10,
    type: 'website',
    url: 'https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields',
    source: 'Vedantu',
    tags: ['magnetism', 'electromagnets', 'motors', 'generators']
  },

  // Social Science - Class 10 (more chapters)
  {
    id: 'social-10-power-sharing',
    title: 'Power Sharing - Federalism',
    description: 'Forms of power sharing and federal division of power in India.',
    subject: 'Social Science',
    chapter: 'Power Sharing',
    class: 10,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=power-sharing',
    source: 'NCERT',
    tags: ['power sharing', 'federalism', 'democracy', 'india']
  },
  {
    id: 'social-10-outcomes-democracy',
    title: 'Outcomes of Democracy',
    description: 'Expected and actual outcomes of democratic governments.',
    subject: 'Social Science',
    chapter: 'Outcomes of Democracy',
    class: 10,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=outcomes-of-democracy',
    source: 'NCERT Solutions',
    tags: ['democracy', 'outcomes', 'government', 'accountability']
  },
  {
    id: 'social-10-challenges-democracy',
    title: 'Challenges to Democracy',
    description: 'Foundational challenges and reforms needed in democracy.',
    subject: 'Social Science',
    chapter: 'Challenges to Democracy',
    class: 10,
    type: 'website',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=challenges-to-democracy',
    source: 'Khan Academy',
    tags: ['democracy', 'challenges', 'reforms', 'foundational']
  },

  // English - Class 10 (more chapters)
  {
    id: 'english-10-two-gentlemen-verona',
    title: 'Two Gentlemen of Verona - Analysis',
    description: 'Complete analysis of the story "Two Gentlemen of Verona".',
    subject: 'English',
    chapter: 'Two Gentlemen of Verona',
    class: 10,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=TwoGentlemenOfVerona',
    source: 'NCERT Solutions',
    tags: ['two gentlemen', 'verona', 'story', 'analysis']
  },
  {
    id: 'english-10-grammar-voice',
    title: 'English Grammar - Active and Passive Voice',
    description: 'Rules and examples of active and passive voice in English.',
    subject: 'English',
    chapter: 'Grammar - Voice',
    class: 10,
    type: 'pdf',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=ActivePassiveVoice',
    source: 'CBSE Study Material',
    tags: ['grammar', 'active voice', 'passive voice', 'english']
  },

  // Hindi - Class 10 (more chapters)
  {
    id: 'hindi-10-sanchayan-kavita',
    title: 'संचयन - कविता विश्लेषण',
    description: 'हिंदी कविताओं का गहन विश्लेषण और समझ।',
    subject: 'Hindi',
    chapter: 'संचयन कविता',
    class: 10,
    type: 'website',
    url: 'https://ncert.nic.in/textbook.php?le=hindi&chap=sanchayan-kavita',
    source: 'CBSE Hindi',
    tags: ['संचयन', 'कविता', 'विश्लेषण', 'हिंदी']
  },

  // Computer Science - Class 10 (more topics)
  {
    id: 'cs-10-html-css',
    title: 'HTML and CSS Basics',
    description: 'Introduction to web development with HTML and CSS.',
    subject: 'Computer Science',
    chapter: 'Web Development Basics',
    class: 10,
    type: 'website',
    url: 'https://www.w3schools.com/html/',
    source: 'freeCodeCamp',
    tags: ['html', 'css', 'web development', 'programming']
  },
  {
    id: 'cs-10-scratch-programming',
    title: 'Scratch Programming',
    description: 'Visual programming with Scratch for beginners.',
    subject: 'Computer Science',
    chapter: 'Scratch Programming',
    class: 10,
    type: 'website',
    url: 'https://scratch.mit.edu',
    source: 'MIT Scratch',
    tags: ['scratch', 'programming', 'visual', 'beginners']
  },

  // Add more resources for classes 1-9 and more chapters...
  // For brevity, I'll add a few more examples

  // Mathematics - Class 9
  {
    id: 'math-9-number-systems',
    title: 'Number Systems - Irrational Numbers',
    description: 'Understanding rational and irrational numbers with examples.',
    subject: 'Mathematics',
    chapter: 'Number Systems',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/math/pre-algebra/number-sense',
    source: 'Khan Academy',
    tags: ['number systems', 'irrational', 'rational', 'real numbers']
  },

  // Science - Class 9
  {
    id: 'science-9-matter',
    title: 'Matter in Our Surroundings',
    description: 'States of matter, properties, and changes of state.',
    subject: 'Science',
    chapter: 'Matter in Our Surroundings',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/states-of-matter',
    source: 'BYJU\'S',
    tags: ['matter', 'states', 'properties', 'changes']
  },

  // Mathematics - Class 9
  {
    id: 'math-9-number-systems',
    title: 'Number Systems - Irrational Numbers',
    description: 'Understanding rational and irrational numbers with examples.',
    subject: 'Mathematics',
    chapter: 'Number Systems',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org',
    source: 'Khan Academy',
    tags: ['number systems', 'irrational', 'rational', 'real numbers']
  },
  {
    id: 'math-9-polynomials',
    title: 'Polynomials - Introduction',
    description: 'Basics of polynomials, degrees, and operations.',
    subject: 'Mathematics',
    chapter: 'Polynomials',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/math/algebra/polynomials',
    source: 'BYJU\'S',
    tags: ['polynomials', 'degrees', 'operations', 'algebra']
  },
  {
    id: 'math-9-coordinate-geometry',
    title: 'Coordinate Geometry Basics',
    description: 'Introduction to coordinate plane and plotting points.',
    subject: 'Mathematics',
    chapter: 'Coordinate Geometry',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/math/geometry/coordinate-geometry',
    source: 'Vedantu',
    tags: ['coordinate geometry', 'plane', 'plotting', 'points']
  },

  // Science - Class 9
  {
    id: 'science-9-matter',
    title: 'Matter in Our Surroundings',
    description: 'States of matter, properties, and changes of state.',
    subject: 'Science',
    chapter: 'Matter in Our Surroundings',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org',
    source: 'BYJU\'S',
    tags: ['matter', 'states', 'properties', 'changes']
  },
  {
    id: 'science-9-atoms-molecule',
    title: 'Atoms and Molecules',
    description: 'Structure of atoms, molecules, and chemical formulas.',
    subject: 'Science',
    chapter: 'Atoms and Molecules',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/science/chemistry/atomic-structure',
    source: 'Khan Academy',
    tags: ['atoms', 'molecules', 'chemical formulas', 'structure']
  },
  {
    id: 'science-9-force-motion',
    title: 'Force and Laws of Motion',
    description: 'Newton\'s laws of motion and their applications.',
    subject: 'Science',
    chapter: 'Force and Laws of Motion',
    class: 9,
    type: 'website',
    url: 'https://www.khanacademy.org/science/physics/forces-newtons-laws',
    source: 'Vedantu',
    tags: ['force', 'motion', 'newton', 'laws']
  },

  // English - Class 9
  {
    id: 'english-9-beehive',
    title: 'Beehive - The Fun They Had',
    description: 'Analysis of the story "The Fun They Had" from Beehive textbook.',
    subject: 'English',
    chapter: 'The Fun They Had',
    class: 9,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=TheFunTheyHad',
    source: 'NCERT Solutions',
    tags: ['beehive', 'story', 'analysis', 'future']
  },
  {
    id: 'english-9-grammar-nouns',
    title: 'English Grammar - Nouns and Pronouns',
    description: 'Types of nouns and pronouns with examples and exercises.',
    subject: 'English',
    chapter: 'Grammar - Nouns and Pronouns',
    class: 9,
    type: 'pdf',
    url: 'https://ncert.nic.in/textbook.php?le=english&chap=NounsAndPronouns',
    source: 'CBSE Study Material',
    tags: ['grammar', 'nouns', 'pronouns', 'english']
  },

  // Social Science - Class 9
  {
    id: 'social-9-french-revolution',
    title: 'The French Revolution',
    description: 'Causes, events, and outcomes of the French Revolution.',
    subject: 'Social Science',
    chapter: 'The French Revolution',
    class: 9,
    type: 'website',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=french-revolution',
    source: 'Khan Academy',
    tags: ['french revolution', 'history', 'causes', 'outcomes']
  },
  {
    id: 'social-9-democracy-india',
    title: 'Democracy in India',
    description: 'Democratic institutions and processes in India.',
    subject: 'Social Science',
    chapter: 'Democracy in India',
    class: 9,
    type: 'article',
    url: 'https://ncert.nic.in/textbook.php?le=socialscientific&chap=democracy-in-india',
    source: 'NCERT',
    tags: ['democracy', 'india', 'institutions', 'processes']
  }
];

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Science',
  'Hindi',
  'Computer Science',
  'Arts',
  'Physical Education'
];

export const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const RESOURCE_TYPES = ['video', 'pdf', 'website', 'article', 'quiz'];