export interface Piece {
  id: string;
  name: string;
  category: string;
  material: string;
  year: string;
  image: string;
  model?: string;
  description: string;
  extraImages?: string[];
  vimeoId?: string;
  vimeoId2?: string;
  vimeoLabel2?: string;
  dimensions?: string;
  weight?: string;
  location?: string;
  availability?: string;
  artist?: string;
  techniques?: string[];
  longDescription?: string;
}

export const pieces: Piece[] = [
  {
    id: "the-twins",
    name: "The Twins",
    category: "Sculpture",
    material: "Stainless Steel, Bronze",
    year: "2003",
    image: "/images/portfolio/female-twin.jpg",
    dimensions: "6' H × 5' W × 6' L",
    location: "Area 15, Las Vegas, NV",
    availability: "Sold — permanent installation at Area 15, Las Vegas",
    artist: "Orion Fredericks",
    techniques: ["Cold-forged stainless steel", "Bronze fabrication", "Fire effects", "Pneumatic actuation"],
    description:
      "A pair of interactive 6-foot sculptures in cold-forged stainless steel with bronze horns. Sold to Area 15 in Las Vegas, where they live on as a permanent installation.",
    longDescription:
      "The Twins are a study in synergetic duality — two alien-like figures whose pivoting, horned masks come to life through internal combustion, sound, and fire. Pneumatic actuators and CO₂ give the critters movement, controlled from a custom footplate, and when activated their bronze horns align to form the Gemini symbol. Hand-formed from 16-gauge stainless steel, every curve was shaped and welded by hand, then polished to a finish that reflects fire and light. The Twins have been sold to Area 15 in Las Vegas, where they are permanently installed.",
  },
  {
    id: "the-portal",
    name: "The Portal",
    category: "Sculpture",
    material: "Stainless Steel",
    year: "2011",
    image: "/images/portfolio/the-portal.jpg",
    dimensions: "24' H × 25' W × 25' L",
    availability: "Available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Plasma cutting", "Hand forming", "Fire integration", "LED lighting"],
    description:
      "An immersive gateway sculpture that invites viewers to step between worlds. Fire and steel combine to create a threshold experience. Available for rental or purchase.",
    longDescription:
      "The Portal — also known as Excucistar Triuctus, the Passage of Awakening — is a monumental archway built around two 1,000-pound stainless steel rings counter-rotating around a narrow bridge. Crossing the two-foot-wide span, viewers are enveloped by fire, fog, steam, and water, with Palo Santo and copal scents released along the way and flames erupting from the horns at its peak. The piece was designed to be walked through — a rite of passage that transforms the viewer from spectator to participant. Modular and portable, it can be installed indoors or out, and is available for rental or purchase.",
    extraImages: ["/images/portfolio/the-portal-day.jpg"],
  },
  {
    id: "gilly",
    name: "Gilly (Gilloptorus Corvus)",
    category: "Sculpture",
    material: "Hand-formed Stainless Steel",
    year: "2014",
    image: "/images/portfolio/gilly.jpg",
    vimeoId: "124467035",
    vimeoId2: "78879028",
    vimeoLabel2: "Making of Gilly",
    dimensions: "16' H × 16' W × 21' L",
    location: "Area 15, Las Vegas, NV",
    availability: "Permanently installed at Area 15, Las Vegas",
    artist: "Orion Fredericks",
    techniques: ["Hand forming", "Stainless steel fabrication", "Fire effects", "Kinetic elements"],
    description:
      "A fantastical fire-breathing creature made entirely of hand-formed stainless steel, permanently installed at Area 15 in Las Vegas.",
    longDescription:
      "Gilloptorus Corvus — known as Gilly — is a mythical creature of primal, alien beauty, fabricated entirely from hand-formed stainless steel. Dual fire-breathing mouths and flame effects along its spine reach over 1,200°F, producing synchronized sound with each burst of combustion. Every panel, every joint, every flowing contour was shaped by hand, giving the piece an organic quality that belies its industrial origins. Gilly serves as the matriarch of The Twins — an imagined species that evolves, splits, and adapts like cryptic lifeforms. The sculpture is permanently installed at Area 15 in Las Vegas.",
  },
  {
    id: "le-attrata",
    name: "Le Attrata",
    category: "Installation",
    material: "Stainless Steel, Mild Steel",
    year: "2016",
    image: "/images/portfolio/le-attrata.jpg",
    dimensions: "26' H × 43' W × 43' L",
    availability: "Available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Steel fabrication", "Turbine fire effects", "Light integration", "Spatial design"],
    description:
      "A turbine engine-powered fire sculpture — three stainless steel moths, the Fuocco Falene, hover above viewers in a dramatic fusion of performance combustion and sculptural elegance.",
    longDescription:
      "Le Attrata is an environment as much as it is an artwork. Three stainless steel moths — the Fuocco Falene — are positioned above a seating area, drawn like their mythological namesakes to the very elements that threaten them. Turbine engine-powered fire effects deliver a dramatic fusion of performance combustion and sculptural elegance, while carefully orchestrated lighting transforms the space as you move through it. Each angle reveals a new narrative, a new relationship between form, flame, and light. Le Attrata is available for rental or purchase.",
  },
  {
    id: "divi",
    name: "Divi (Divinatrix)",
    category: "Fire & Water Sculpture",
    material: "Hand-formed Stainless Steel",
    year: "2015",
    image: "/images/portfolio/divi.jpg",
    vimeoId: "153978804",
    vimeoId2: "168269015",
    vimeoLabel2: "Live at Maker Faire 2016",
    availability: "Available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Hand forming", "Fire effects", "Water fountain", "Forced air combustion"],
    description:
      "A 16-foot hand-formed stainless steel fire and water fountain. Deconstructed from the Harmonizer, Divinatrix holds 45 gallons of water with fire effects reaching 20+ feet. Available for rental or purchase.",
    longDescription:
      "Divinatrix was deconstructed and reimagined from the earlier sculpture 'Harmonizer.' Standing 16 feet tall, this hand-formed stainless steel sculpture integrates both fire and water in a single dynamic system. The piece holds 45 gallons of water that cascades across its surface while forced-air combustion drives fire effects up to 20 feet into the sky. The result is a primal meeting of opposing elements — water flowing down as fire reaches up — creating an experience that is equal parts engineering marvel and visceral art. Divinatrix debuted at Maker Faire 2016 and is available for rental or purchase.",
  },
  {
    id: "springwater",
    name: "Springwater",
    category: "Fire & Water Sculpture",
    material: "Stainless Steel, Bronze, Copper, Hand-blown Glass",
    year: "2005",
    image: "/images/portfolio/springwater.jpg",
    dimensions: "7' H × 6' W × 6' L",
    availability: "Available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Water vortex engineering", "Fire effects", "Hand-blown glass", "Multi-metal fabrication"],
    description:
      "A serene convergence of opposites — a swirling water vortex held in a hand-blown glass vessel, with fire flickering up through the heart of the spinning water. Available for rental or purchase.",
    longDescription:
      "Springwater is a meditation on opposing forces — water, fire, and light — contained within a hand-blown glass vessel set on stainless steel, bronze, and copper. A swirling vortex spins at its center, and fire can be brought up through the vortex of water itself, flame and current sharing the same column in a quietly hypnotic display. Integrated lighting beneath the glass animates the piece after dark. The original centerpiece of the Fata Morgana installation, Springwater later inspired its companion piece, Echeveria. It is available for rental or purchase.",
  },
  {
    id: "echeveria",
    name: "Echeveria",
    category: "Fire Sculpture",
    material: "Stainless Steel, Bronze, Copper",
    year: "2015",
    image: "/images/portfolio/echeveria.jpg",
    artist: "Orion Fredericks",
    techniques: ["Multi-metal fabrication", "Fire effects", "Water integration", "Kinetic design"],
    description:
      "Inspired by the succulent plant, Echeveria blooms in steel, bronze, and copper — integrating fire and water into a living kinetic sculpture.",
    longDescription:
      "Echeveria takes its name and form from the desert succulent, but reimagines it at monumental scale in three metals: stainless steel, bronze, and copper. The sculpture integrates both fire and water effects, creating a kinetic experience that changes throughout the day. By daylight, the mixed metals catch and reflect the sun. At night, flames dance from within the petals while water flows across the copper surfaces, creating a living, breathing work of art.",
  },
  {
    id: "fata",
    name: "Fata (Fata Morgana)",
    category: "Kinetic Sculpture",
    material: "Steel",
    year: "2007",
    image: "/images/portfolio/fata.jpg",
    vimeoId: "125820250",
    availability: "Available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Kinetic engineering", "Steel fabrication"],
    description:
      "Fata Morgana is a kinetic sculpture that spins light into mesmerizing patterns, named after the optical illusion seen in the desert. Available for rental or purchase.",
    longDescription:
      "Fata Morgana — named after the desert mirage phenomenon — is a kinetic sculpture that transforms motion into choreographed beauty. The piece rotates and spins, casting arcs and spirals that create ephemeral patterns against the night sky. Built for large-scale events and festivals, Fata Morgana has been a centerpiece at Burning Man and Maker Faire, captivating audiences with its primal yet precisely engineered dance of steel and light. It is available for rental or purchase.",
  },
  {
    id: "skrillex-spaceship",
    name: "Skrillex Spaceship",
    category: "Stage Sculpture",
    material: "Steel",
    year: "2012",
    image: "/images/portfolio/skrillex-spaceship.jpg",
    dimensions: "18' H × 14' W × 12' L",
    availability: "Commissioned work — not available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Steel fabrication", "Cryogenics", "Scissor-lift mechanics", "Faux-aged finishing"],
    description:
      "An 18-foot all-steel spaceship commissioned by Skrillex as a centerpiece stage prop — part futuristic craft, part weathered mythological relic.",
    longDescription:
      "Commissioned by Skrillex for live performance, the Spaceship is an all-steel stage sculpture built on a rush production timeline. Cryogenics and specialized engines were integrated into the structure, with scissor-lift action bringing the craft to life on stage. A faux-painted finish gives the steel an aged, weathered appearance — a ship that reads as both futuristic and ancient, as if recovered from another world's history. The piece is a private commission and is not available for rental or purchase.",
    extraImages: [
      "/images/portfolio/skrillex-spaceship-2.jpg",
      "/images/portfolio/skrillex-spaceship-3.jpg",
    ],
  },
  {
    id: "the-dragonfly",
    name: "The Dragonfly",
    category: "Art Car",
    material: "Steel, Addressable LEDs",
    year: "2024",
    image: "/images/portfolio/dragonfly.jpg",
    dimensions: "9' H × 9' W × 19' L",
    availability: "Commissioned work — not available for rental or purchase",
    artist: "Orion Fredericks",
    techniques: ["Vehicle fabrication", "Addressable LED systems", "Collaborative engineering"],
    description:
      "A one-of-a-kind dragonfly art car commissioned by the Lucid Dreams camp for Burning Man 2024, illuminated by an intricate system of addressable LEDs.",
    longDescription:
      "The Dragonfly is a striking vehicular sculpture commissioned by the Lucid Dreams Burning Man camp for the 2024 festival. Its stylized dragonfly form is brilliantly illuminated by an intricate system of addressable LEDs that trace and accentuate every line of the build. The project came together over several months of collaboration between clients, engineers, fabricators, and technologists working with Engineered Artworks. The Dragonfly is a private commission and is not available for rental or purchase.",
  },
  {
    id: "ipe-coffee-table",
    name: "Ipe Coffee Table with Brass Inlay",
    category: "Functional Design",
    material: "Ipe Wood, Brass, Stainless Steel",
    year: "",
    image: "/images/portfolio/jdavoli-1-1.jpg",
    dimensions: "42.5\" L × 17.5\" W × 17\" H",
    artist: "Jason Davoli",
    techniques: ["Fine woodworking", "Brass inlay", "Steel fabrication"],
    description:
      "A coffee table in dense ipe hardwood with hand-set brass inlay, carried on steel and stainless steel legs.",
    longDescription:
      "This coffee table pairs ipe — one of the densest hardwoods in the world — with hand-set brass inlay that traces across its surface. Steel and stainless steel legs ground the piece, letting the warmth of the wood and the glint of brass carry the design. Built by master fabricator Jason Davoli of JDavoliDesign in New York.",
    extraImages: [
      "/images/portfolio/jdavoli-1-2.jpg",
      "/images/portfolio/jdavoli-2-1.jpg",
    ],
  },
  {
    id: "brass-ipe-nightstand",
    name: "Brass & Ipe Wood Night Stand",
    category: "Functional Design",
    material: "Brass, Ipe Wood",
    year: "",
    image: "/images/portfolio/jdavoli-1-3.jpg",
    dimensions: "21\" × 18\" × 14\"",
    artist: "Jason Davoli",
    techniques: ["Fine woodworking", "Brass fabrication"],
    description:
      "A night stand in brass and ipe wood — warm hardwood and aged metal in quiet conversation.",
    longDescription:
      "A companion to the ipe coffee table, this night stand brings brass and ipe hardwood together at bedside scale. The contrast of warm, dense wood against patinated brass gives the piece a presence well beyond its footprint. Built by Jason Davoli of JDavoliDesign in New York.",
  },
  {
    id: "aluminum-coffee-table",
    name: "Aluminum Coffee Table",
    category: "Functional Design",
    material: "Aluminum",
    year: "",
    image: "/images/portfolio/jdavoli-2-2.jpg",
    dimensions: "42\" × 23\" × 14\"",
    artist: "Jason Davoli",
    techniques: ["Aluminum fabrication", "Precision welding"],
    description:
      "A coffee table fabricated entirely in aluminum — clean lines and cool metal, built to last generations.",
    longDescription:
      "Fabricated entirely from aluminum, this coffee table strips the form down to its essentials: clean planes, precise welds, and a finish that catches the light. Built by Jason Davoli of JDavoliDesign in New York.",
  },
  {
    id: "stainless-benches",
    name: "Powder-Coated Stainless Steel Benches",
    category: "Functional Design",
    material: "Stainless Steel, Powder Coat",
    year: "",
    image: "/images/portfolio/jdavoli-c-1.jpg",
    artist: "Jason Davoli",
    techniques: ["Stainless steel fabrication", "Powder coating", "Site-specific design"],
    description:
      "Burly Man Orange powder-coated stainless steel benches, fabricated for outdoor spaces across New York City.",
    longDescription:
      "These stainless steel benches, finished in Burly Man Orange powder coat, were fabricated for outdoor public and residential spaces in New York City — including the outdoor space at 8 East 3rd Street and a private residential courtyard in NoHo. Built to take decades of weather and use, they bring a shot of color and craft to the streetscape. Fabricated by Jason Davoli of JDavoliDesign.",
    extraImages: ["/images/portfolio/jdavoli-c-5.jpg"],
  },
  {
    id: "aluminum-pergola",
    name: "Black Magic Aluminum Pergola",
    category: "Functional Design",
    material: "Aluminum, Powder Coat",
    year: "",
    image: "/images/portfolio/jdavoli-c-2.jpg",
    dimensions: "16' × 16' × 10'",
    location: "Union Square, New York, NY",
    artist: "Jason Davoli",
    techniques: ["Aluminum fabrication", "Powder coating", "Architectural installation"],
    description:
      "A Black Magic powder-coated aluminum pergola, custom-built for a private residential courtyard near Union Square, New York.",
    longDescription:
      "This pergola in Black Magic powder-coated aluminum was custom-fabricated for a private residential courtyard on 4th Avenue, south of Union Square in New York City. Light enough to install in a constrained urban courtyard yet rigid enough to span the full space, the structure turns an outdoor room into architecture. Fabricated by Jason Davoli of JDavoliDesign.",
    extraImages: [
      "/images/portfolio/jdavoli-c-3.jpg",
      "/images/portfolio/jdavoli-c-4.jpg",
    ],
  },
];
