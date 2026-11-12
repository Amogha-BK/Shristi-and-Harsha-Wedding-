export type Celebration = {
  id: "sufi" | "wedding" | "reception";
  shortName: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  supportingLine: string;
  start: string;
  end: string;
  calendarTitle: string;
  image: string;
  scene: "lanterns" | "fire" | "candlelight";
  mapUrl: string;
  phereTime?: string;
};

const venueMap =
  "https://www.google.com/maps/search/?api=1&query=Jardin%2C%20Nipania%20Road%2C%20Indore";

export const invitationConfig = {
  couple: {
    first: "Amit",
    second: "Ankita",
    firstParents: "",
    secondParents: "",
  },
  weddingLabel: "29–30 November 2026 · Indore",
  invitationLine: "Together with our families, we invite you to celebrate our wedding.",
  monogram: "/assets/amit-ankita-logo",
  introMedallion: "/assets/amit-ankita-medallion.png",
  assets: {
    originalMonogramPoster: "/assets/image-1",
    sufi: "/assets/image-2",
    wedding: "/assets/image-3",
    reception: "/assets/image-4",
    visualReferences: [
      "/assets/image-5",
      "/assets/image-6",
      "/assets/image-7",
      "/assets/image-8",
      "/assets/image-9",
    ],
  },
  venue: {
    name: "Jardin",
    address: "Nipania Road, Indore",
    mapUrl: venueMap,
  },
  optional: {
    travel: "",
    stay: "",
    contact: "",
    musicUrl: "",
    openingVideoUrl: "",
    whatsappHostNumber: "",
  },
  celebrations: [
    {
      id: "sufi",
      shortName: "Sufi Evening",
      title: "Ek Shaam Sufi Ke Naam",
      dateLabel: "Sunday, 29 November 2026",
      timeLabel: "9:00 PM onwards",
      venue: "Jardin, Nipania Road, Indore",
      supportingLine: "An evening of music, mehfil and celebration.",
      start: "20261129T210000",
      end: "20261129T235900",
      calendarTitle: "Ek Shaam Sufi Ke Naam",
      image: "/assets/image-2",
      scene: "lanterns",
      mapUrl: venueMap,
    },
    {
      id: "wedding",
      shortName: "Baraat & Wedding Celebrations",
      title: "Saat Phere – A Promise of Forever",
      dateLabel: "Monday, 30 November 2026",
      timeLabel: "Baraat at 2:00 PM, followed by lunch.",
      venue: "Jardin, Nipania Road, Indore",
      supportingLine: "A promise of forever, surrounded by those we love.",
      start: "20261130T140000",
      end: "20261130T180000",
      calendarTitle: "Baraat & Wedding Celebrations",
      image: "/assets/image-3",
      scene: "fire",
      mapUrl: venueMap,
      phereTime: "",
    },
    {
      id: "reception",
      shortName: "Reception",
      title: "Reception",
      dateLabel: "Monday, 30 November 2026",
      timeLabel: "8:00 PM onwards",
      venue: "Jardin, Nipania Road, Indore",
      supportingLine: "Join us for an evening of dinner, music and celebration.",
      start: "20261130T200000",
      end: "20261130T235900",
      calendarTitle: "Reception for Amit & Ankita",
      image: "/assets/image-4",
      scene: "candlelight",
      mapUrl: venueMap,
    },
  ] satisfies Celebration[],
  calendar: {
    timezone: "Asia/Kolkata",
  },
} as const;
