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
const homeAddress = "26 C, Heritage Divine, Gyan Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh";
const mehndiAddress = "Golden Rivaah Party Hall, Gyan Khand-2, Indirapuram, Ghaziabad, Uttar Pradesh";
export const invitationConfig = {
  couple: {
    first: "Shristi",
    second: "Harsh",
    firstParents: "Shristi · D/O Smt. Asha Devi & Sh. Jagat Singh Chauhan",
    secondParents: "Harsh · S/O Smt. Renu Chaudhary & Sh. Dhanveer Singh",
  },
  weddingLabel: "10 December 2026 · Indirapuram",
  memorialLine: "With the blessings and in loving memory of Late Smt. Jagdai Devi & Late Veer Singh Chauhan",
  invitationLine: "Shristi & Harsh cordially invite you to grace the occasion of their Wedding Ceremony with your presence and blessings.",
  blessingLine: "We look forward to your gracious presence and blessings on this joyous occasion.",
  homeAddress,
  monogram: "/assets/shristi-harsh-monogram.png",
  artwork: "/assets/shristi-harsh-celebration.png",
  venue: { ...weddingVenue, mapUrl: weddingMap },
  contacts: ["9899577693", "9582317003", "9899012987"],
  optional: { travel: "", stay: "", contact: "", musicUrl: "/assets/kudmayi.mp3", whatsappHostNumber: "" },
  celebrations: [
    {
      id: "mehndi", shortName: "Mehndi Ceremony", title: "Mehndi Ceremony — Rang Pyaar Ke",
      dateLabel: "Wednesday, 9 December 2026", timeLabel: "8:00 p.m.",
      venue: "Golden Rivaah Party Hall", address: "Gyan Khand-2, Indirapuram, Ghaziabad (U.P.)",
      supportingLine: "Henna-stained hands, music and a little magic. Let the celebrations begin!",
      start: "2026-12-09T20:00:00+05:30", calendarTitle: "Shristi & Harsh · Mehndi Ceremony",
      image: "/assets/mehndi-floral-arch-v2.png", scene: "lanterns", mapUrl: maps(mehndiAddress),
    },
    {
      id: "haldi", shortName: "Haldi Ceremony", title: "Haldi Ceremony — Sunehre Pal",
      dateLabel: "Thursday, 10 December 2026", timeLabel: "11:00 a.m.",
      venue: "Bride’s Residence", address: homeAddress,
      supportingLine: "A touch of turmeric, a shower of petals and blessings for a golden beginning.",
      start: "2026-12-10T11:00:00+05:30", calendarTitle: "Shristi & Harsh · Haldi Ceremony",
      image: "/assets/haldi-floral-arch-v2.png", scene: "candlelight", mapUrl: maps(homeAddress),
    },
    {
      id: "wedding", shortName: "Wedding Ceremony", title: "Shubh Vivaah — A Promise of Forever",
      dateLabel: "Thursday, 10 December 2026", timeLabel: "7:00 p.m.",
      venue: weddingVenue.name, address: weddingVenue.address,
      supportingLine: "Sacred vows, two hearts and the love of everyone who brought us here.",
      start: "2026-12-10T19:00:00+05:30", calendarTitle: "Shristi & Harsh · Wedding Ceremony",
      image: "/assets/wedding-floral-arch-v2.png", scene: "fire", mapUrl: weddingMap,
    },
  ] satisfies Celebration[],
  calendar: { timezone: "Asia/Kolkata" },
} as const;
