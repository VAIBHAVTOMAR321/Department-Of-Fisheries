const fishImages = {
  "golden mahseer": {
    scientificName: "Tor putitora",
    note: "A native Himalayan river fish",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Golden_mahseer_%28Tor_putitora%29_Babai_River.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Golden_mahseer_(Tor_putitora)_Babai_River.jpg",
    credit: "Charles J. Sharp · CC BY-SA 4.0",
  },
  "rainbow trout": {
    scientificName: "Oncorhynchus mykiss",
    note: "Well suited to cold, clear waters",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Female_Rainbow_Trout_in_hand.JPG",
    source:
      "https://commons.wikimedia.org/wiki/File:Female_Rainbow_Trout_in_hand.JPG",
    credit: "Mike Anderson · CC BY-SA 3.0",
  },
  rohu: {
    scientificName: "Labeo rohita",
    note: "A widely farmed Indian major carp",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Labeo_rohita.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Labeo_rohita.JPG",
    credit: "Khalid Mahmood · CC BY-SA 4.0",
  },
  catla: {
    scientificName: "Catla catla",
    note: "An important freshwater aquaculture species",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Catla_catla.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Catla_catla.JPG",
    credit: "Khalid Mahmood · CC BY-SA 4.0",
  },
  "common carp": {
    scientificName: "Cyprinus carpio",
    note: "A hardy species for fish culture",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Cyprinus_carpio.jpeg",
    source: "https://commons.wikimedia.org/wiki/File:Cyprinus_carpio.jpeg",
    credit: "Dezidor · CC BY-SA 3.0",
  },
  tilapia: {
    scientificName: "Oreochromis niloticus",
    note: "A commonly farmed freshwater fish",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Oreochromis-niloticus-Nairobi.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Oreochromis-niloticus-Nairobi.JPG",
    credit: "Sailesh Patnaik · Wikimedia Commons",
  },
  pangasius: {
    scientificName: "Pangasius spp.",
    note: "A freshwater catfish raised in aquaculture",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Pangasius_pangasius_or_Pangas_catfish_in_a_Bangladeshi_bazar.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Pangasius_pangasius_or_Pangas_catfish_in_a_Bangladeshi_bazar.jpg",
    credit: "Wikimedia Commons",
  },
};

export function getFishImage(species) {
  return fishImages[String(species || "").trim().toLowerCase()] || {
    scientificName: "Freshwater fish",
    note: "Freshwater fisheries listing",
    image: fishImages.rohu.image,
    source: fishImages.rohu.source,
    credit: fishImages.rohu.credit,
  };
}

export const uttarakhandFish = [
  "Golden Mahseer",
  "Rainbow Trout",
  "Rohu",
  "Catla",
  "Common Carp",
].map((name) => ({ name, ...getFishImage(name) }));
