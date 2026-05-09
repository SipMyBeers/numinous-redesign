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
  artist?: string;
  techniques?: string[];
  longDescription?: string;
}

export const pieces: Piece[] = [
  {
    id: "female-twin",
    name: "Female Twin",
    category: "Sculpture",
    material: "Stainless Steel",
    year: "2009",
    image: "/images/portfolio/female-twin.jpg",
    model: "/models/female-twin.glb",
    artist: "Orion Fredericks",
    techniques: ["Hand-formed steel", "MIG welding", "Mirror polish"],
    description:
      "A monumental stainless steel figure capturing the duality of form — strength and grace fused in polished metal, reflecting fire and light.",
    longDescription:
      "Female Twin is a study in contrasts — the raw power of industrial steel shaped into a form that embodies organic grace. Every curve was hand-hammered and welded, then polished to a mirror finish that transforms the piece into a living reflection of its environment. At night, integrated fire effects bring the sculpture to life, casting dancing shadows that multiply the figure across the landscape.",
  },
  {
    id: "the-portal",
    name: "The Portal",
    category: "Sculpture",
    material: "Stainless Steel",
    year: "2017",
    image: "/images/portfolio/the-portal.jpg",
    model: "/models/the-portal.glb",
    artist: "Orion Fredericks",
    techniques: ["Plasma cutting", "Hand forming", "Fire integration", "LED lighting"],
    description:
      "An immersive gateway sculpture that invites viewers to step between worlds. Fire and steel combine to create a threshold experience.",
    longDescription:
      "The Portal is a monumental archway that defines the boundary between the ordinary and the extraordinary. Standing beneath it, viewers are enveloped by the interplay of fire, light, and polished steel. The piece was designed to be walked through — an interactive experience that transforms the viewer from spectator to participant. Currently installed at Area15 in Las Vegas.",
    location: "Area15, Las Vegas, NV",
    extraImages: ["/images/portfolio/the-portal-day.jpg"],
  },
  {
    id: "et",
    name: "ET (Elemental Threshold)",
    category: "Sculpture",
    material: "Stainless Steel",
    year: "2017",
    image: "/images/portfolio/the-portal-day.jpg",
    artist: "Orion Fredericks",
    techniques: ["Structural engineering", "Steel fabrication", "Fire effects"],
    description:
      "The Elemental Threshold stands as a beacon — a sculptural portal where fire meets sky, steel meets earth.",
    longDescription:
      "Elemental Threshold pushes the boundary of what sculpture can be — part architecture, part art, entirely experiential. The piece invites viewers to contemplate the elements that make up our world: fire, earth, air, and the steel that binds them.",
  },
  {
    id: "gilly",
    name: "Gilly (Gilloptorus Corvus)",
    category: "Sculpture",
    material: "Hand-formed Stainless Steel",
    year: "2015",
    image: "/images/portfolio/gilly.jpg",
    model: "/models/gilly.glb",
    vimeoId: "124467035",
    vimeoId2: "78879028",
    vimeoLabel2: "Making of Gilly",
    dimensions: "21' × 16' × 16'",
    artist: "Orion Fredericks",
    techniques: ["Hand forming", "Stainless steel fabrication", "Kinetic elements"],
    description:
      "A fantastical 21-foot creature made entirely of hand-formed stainless steel. Gilly is available for exhibition and long-term installation.",
    longDescription:
      "Gilloptorus Corvus — known as Gilly — is a mythical creature standing 21 feet tall, fabricated entirely from hand-formed stainless steel. Every panel, every joint, every flowing contour was shaped by hand, giving the piece an organic quality that belies its industrial origins. Gilly challenges the boundary between the natural and the constructed, inviting viewers to imagine a world where metal breathes and steel takes flight. The sculpture is available for sale and for short-term or long-term exhibition hire.",
  },
  {
    id: "le-attrata",
    name: "Le Attrata",
    category: "Installation",
    material: "Mixed Media",
    year: "2016",
    image: "/images/portfolio/le-attrata.jpg",
    model: "/models/le-attrata.glb",
    artist: "Orion Fredericks",
    techniques: ["Mixed media fabrication", "Light integration", "Spatial design"],
    description:
      "An immersive installation that draws viewers into a world of light, texture, and spatial drama.",
    longDescription:
      "Le Attrata is an environment as much as it is an artwork. Viewers don't simply look at this piece — they enter it. The installation combines fabricated metal forms with carefully orchestrated lighting to create a space that shifts and transforms as you move through it. Each angle reveals a new narrative, a new relationship between form and light.",
  },
  {
    id: "divi",
    name: "Divi (Divinatrix)",
    category: "Fire & Water Sculpture",
    material: "Hand-formed Stainless Steel",
    year: "2016",
    image: "/images/portfolio/divi.jpg",
    model: "/models/divi.glb",
    vimeoId: "153978804",
    vimeoId2: "168269015",
    vimeoLabel2: "Live at Maker Faire 2016",
    dimensions: "16' × 7' × 7'",
    artist: "Orion Fredericks",
    techniques: ["Hand forming", "Fire effects", "Water fountain", "Forced air combustion"],
    description:
      "A 16-foot hand-formed stainless steel fire and water fountain. Deconstructed from the Harmonizer, Divinatrix holds 45 gallons of water with fire effects reaching 20+ feet.",
    longDescription:
      "Divinatrix was deconstructed and reimagined from the earlier sculpture 'Harmonizer.' Standing 16 feet tall, this hand-formed stainless steel sculpture integrates both fire and water in a single dynamic system. The piece holds 45 gallons of water that cascades across its surface while forced-air combustion drives fire effects up to 20 feet into the sky. The result is a primal meeting of opposing elements — water flowing down as fire reaches up — creating an experience that is equal parts engineering marvel and visceral art. Divinatrix debuted at Maker Faire 2016 and continues to captivate audiences at large-scale events.",
  },
  {
    id: "springwater",
    name: "Springwater",
    category: "Installation",
    material: "Mixed Media",
    year: "2018",
    image: "/images/portfolio/springwater.jpg",
    model: "/models/springwater.glb",
    artist: "Orion Fredericks",
    techniques: ["Water integration", "Mixed media", "Environmental design"],
    description:
      "A meditation on natural flow and constructed form. Springwater captures the essence of water's movement in permanent materials.",
    longDescription:
      "Springwater is an exercise in paradox — using rigid, permanent materials to capture the ephemeral quality of flowing water. The installation invites contemplation of the relationship between natural forces and human construction, finding beauty in the tension between the two.",
  },
  {
    id: "echeveria",
    name: "Echeveria",
    category: "Fire Sculpture",
    material: "Stainless Steel, Bronze, Copper",
    year: "2015",
    image: "/images/portfolio/echeveria.jpg",
    model: "/models/echeveria.glb",
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
    category: "Fire Sculpture",
    material: "Steel, Fire",
    year: "2010",
    image: "/images/portfolio/fata.jpg",
    model: "/models/fata.glb",
    vimeoId: "125820250",
    artist: "Orion Fredericks",
    techniques: ["Kinetic engineering", "Fire effects", "Steel fabrication", "Propane systems"],
    description:
      "Fata Morgana is a kinetic fire sculpture that spins fire into mesmerizing patterns, named after the optical illusion seen in the desert.",
    longDescription:
      "Fata Morgana — named after the desert mirage phenomenon — is a kinetic fire sculpture that transforms raw flame into choreographed beauty. The piece rotates and spins, casting fire in arcs and spirals that create ephemeral patterns in the night sky. Built for large-scale events and festivals, Fata Morgana has been a centerpiece at Burning Man and Maker Faire, captivating audiences with its primal yet precisely engineered dance of fire and steel.",
  },
];
