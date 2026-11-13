export type Celebration = {
  id: "mehndi" | "haldi" | "wedding";
  shortName: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  supportingLine: string;
  start: string;
  calendarTitle: string;
  image: string;
  scene: "lanterns" | "fire" | "candlelight";
  mapUrl: string;
  phereTime?: string;
};
const maps = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const weddingVenue = {
  name: "The Grand Piazza",
  address: "Lawn 1, CISF Road, Indirapuram, Ghaziabad",
};
const weddingMap = maps(`${weddingVenue.name}, ${weddingVenue.address}`);
const homeAddress = "26 C, Heritage Divine, Gyan Khand 2, Indirapuram";
const mehndiAddress = "Golden Rivaah Party Hall, Gyan Khand-2, Indirapuram, Ghaziabad, Uttar Pradesh";
export const invitationConfig = {
  couple: {
    first: "Shristi",
    second: "Harsh",
    firstParents: "Shristi · Daughter of Smt. Asha Devi & Sh. Jagat Singh Chauhan",
    secondParents: "Harsh · Son of Smt. Renu Chaudhary & Sh. Dhanveer Singh",
  },
  weddingLabel: "10 December 2026 · Indirapuram",
  invitationLine: "With the blessings of Late Smt. Jagdai Devi & Late Veer Singh Chauhan, we request the honour of your gracious presence at the wedding of their loving granddaughter Shristi with Harsh.",
  monogram: "/assets/shristi-harsh-monogram.png",
  artwork: "/assets/shristi-harsh-celebration.png",
  venue: { ...weddingVenue, mapUrl: weddingMap },
  contacts: ["9899577693", "9582317003", "9899012987"],
  optional: { travel: "", stay: "", contact: "", musicUrl: "/assets/kudmayi.mp3", whatsappHostNumber: "" },
  celebrations: [
    {
      id: "mehndi", shortName: "Mehndi", title: "Mehndi — Rang Pyaar Ke",
      dateLabel: "Wednesday, 9 December 2026", timeLabel: "8:00 PM onwards",
      venue: "Golden Rivaah Party Hall", address: "Gyan Khand-2, Indirapuram, Ghaziabad (U.P.)",
      supportingLine: "Henna-stained hands, music and a little magic. Let the celebrations begin!",
      start: "20261209T200000", calendarTitle: "Shristi & Harsh · Mehndi",
      image: "/assets/mehndi-floral-arch-v2.png", scene: "lanterns", mapUrl: maps(mehndiAddress),
    },
    {
      id: "haldi", shortName: "Haldi Hath", title: "Haldi Hath — Sunehre Pal",
      dateLabel: "Thursday, 10 December 2026", timeLabel: "11:00 AM onwards",
      venue: "Bride’s Residence", address: homeAddress,
      supportingLine: "A touch of turmeric, a shower of petals and blessings for a golden beginning.",
      start: "20261210T110000", calendarTitle: "Shristi & Harsh · Haldi Hath",
      image: "/assets/haldi-floral-arch-v2.png", scene: "candlelight", mapUrl: maps(homeAddress),
    },
    {
      id: "wedding", shortName: "Wedding Ceremony", title: "Shubh Vivaah — A Promise of Forever",
      dateLabel: "Thursday, 10 December 2026", timeLabel: "7:00 PM onwards",
      venue: weddingVenue.name, address: weddingVenue.address,
      supportingLine: "Sacred vows, two hearts and the love of everyone who brought us here.",
      start: "20261210T190000", calendarTitle: "Shristi & Harsh · Wedding Ceremony",
      image: "/assets/wedding-floral-arch-v2.png", scene: "fire", mapUrl: weddingMap,
    },
  ] satisfies Celebration[],
  calendar: { timezone: "Asia/Kolkata" },
} as const;
