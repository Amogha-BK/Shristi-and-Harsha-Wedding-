import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CalendarDays,
  Check,
  Clipboard,
  MapPin,
  Menu,
  Music,
  Pause,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Celebration, invitationConfig as config } from "./invitationConfig";

const navItems = [
  ["Our Wedding", "our-wedding"],
  ["Celebrations", "celebrations"],
  ["Venue", "venue"],
] as const;

const INTRO_STORAGE_KEY = "amit-ankita-intro-v3";

function Monogram({ className = "" }: { className?: string }) {
  return (
    <img
      className={`monogram ${className}`}
      src={config.monogram}
      alt="A and A monogram with a botanical sprig"
    />
  );
}

function LotusOutline() {
  return (
    <svg className="lotus-outline" viewBox="0 0 260 220" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M130 187C99 153 98 114 130 55c32 59 31 98 0 132Z" />
        <path d="M125 190C74 171 52 139 53 79c49 35 69 70 72 111Z" />
        <path d="M135 190c51-19 73-51 72-111-49 35-69 70-72 111Z" />
        <path d="M119 193C63 194 29 173 12 122c55 13 87 36 107 71Z" />
        <path d="M141 193c56 1 90-20 107-71-55 13-87 36-107 71Z" />
        <path d="M62 194c43 17 89 17 136 0" />
      </g>
    </svg>
  );
}

function Palace({ intro = false }: { intro?: boolean }) {
  return (
    <div className={`palace ${intro ? "palace-intro" : ""}`} aria-hidden="true">
      <div className="palace-back">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="palace-mid">
        <i />
        <i />
        <i />
      </div>
      <div className="palace-front">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function FloralArch() {
  return (
    <div className="opening-arch" aria-hidden="true">
      <div className="arch-line" />
      <div className="arch-foliage arch-left">⌇</div>
      <div className="arch-foliage arch-right">⌇</div>
      <div className="arch-flower flower-one" />
      <div className="arch-flower flower-two" />
      <div className="arch-flower flower-three" />
      <div className="arch-flower flower-four" />
    </div>
  );
}

function Opening({
  onComplete,
  onInteraction,
}: {
  onComplete: () => void;
  onInteraction: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const timers = useRef<number[]>([]);
  const hasVideo = Boolean(config.optional.openingVideoUrl) && !videoFailed;

  const finish = () => {
    timers.current.forEach(window.clearTimeout);
    localStorage.setItem(INTRO_STORAGE_KEY, "true");
    onComplete();
  };

  const begin = () => {
    if (started) return;
    setStarted(true);
    onInteraction();
    if (reduceMotion) {
      timers.current.push(window.setTimeout(finish, 700));
    } else if (!hasVideo) {
      timers.current.push(window.setTimeout(finish, 6500));
    }
  };

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return (
    <motion.div
      className={`opening ${started ? "opening-started" : ""}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
      role="dialog"
      aria-modal="true"
      aria-label="Open the wedding invitation"
    >
      <div className="opening-paper" />
      {started && hasVideo ? (
        <video
          className="opening-video"
          src={config.optional.openingVideoUrl}
          playsInline
          autoPlay
          muted
          onEnded={finish}
          onError={() => {
            setVideoFailed(true);
            timers.current.push(window.setTimeout(finish, 6500));
          }}
        />
      ) : (
        <>
          <div className="opening-halo" />
          <div className="petals" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} style={{ "--petal": index } as React.CSSProperties} />
            ))}
          </div>
          <div className="lotus-wrap">
            <LotusOutline />
          </div>
          <div className="arch-wrap">
            <FloralArch />
          </div>
          <div className="opening-palace">
            <Palace intro />
          </div>
          <div className="opening-couple">
            <small>The wedding celebrations of</small>
            <strong>
              <b>{config.couple.first}</b>
              <em>&</em>
              <b>{config.couple.second}</b>
            </strong>
          </div>
          <button
            className="opening-trigger focus-ring"
            type="button"
            onClick={begin}
            aria-label="Tap to open our celebrations"
          >
            <span className="medallion intro-medallion">
              <img src={config.introMedallion} alt="A and A botanical wedding monogram" />
            </span>
            <span>Tap the monogram</span>
            <small>to open our celebrations</small>
          </button>
        </>
      )}
      {started && (
        <button className="skip-intro focus-ring" type="button" onClick={finish}>
          Skip Intro
        </button>
      )}
    </motion.div>
  );
}

function MusicControl({ canPlay }: { canPlay: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const hasMusic = Boolean(config.optional.musicUrl);

  const togglePlay = async () => {
    if (!audio.current || !canPlay || !hasMusic) return;
    if (audio.current.paused) {
      try {
        await audio.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="music-controls">
      {hasMusic && (
        <audio ref={audio} src={config.optional.musicUrl} loop onError={() => setPlaying(false)} />
      )}
      <button
        type="button"
        className="icon-button focus-ring"
        onClick={togglePlay}
        disabled={!hasMusic}
        aria-label={hasMusic ? (playing ? "Pause music" : "Play music") : "Music is not configured"}
        title={hasMusic ? "Music" : "Music can be added in invitationConfig.ts"}
      >
        {playing ? <Pause /> : <Music />}
      </button>
      {hasMusic && (
        <button
          type="button"
          className="icon-button focus-ring"
          onClick={() => {
            if (!audio.current) return;
            audio.current.muted = !muted;
            setMuted(!muted);
          }}
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      )}
    </div>
  );
}

function Navigation({ onReplay }: { onReplay: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav" aria-label="Invitation navigation">
      <a className="nav-mark focus-ring" href="#our-wedding" aria-label="Home">
        A <span>&</span> A
      </a>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {navItems.map(([label, id]) => (
          <a key={id} className="focus-ring" href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <button
          className="focus-ring replay-intro"
          type="button"
          onClick={() => {
            setOpen(false);
            onReplay();
          }}
        >
          Replay Intro
        </button>
      </div>
      <button
        className="nav-toggle focus-ring"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

function localEventToDate(value: string) {
  const match = value.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!match) return new Date();
  const [, y, m, d, h, min, s] = match;
  return new Date(`${y}-${m}-${d}T${h}:${min}:${s}+05:30`);
}

function Countdown() {
  const target = useMemo(() => {
    const upcoming = config.celebrations
      .map((event) => ({ ...event, timestamp: localEventToDate(event.start).getTime() }))
      .filter((event) => event.timestamp > Date.now())
      .sort((a, b) => a.timestamp - b.timestamp)[0];
    return upcoming ?? null;
  }, []);
  const [remaining, setRemaining] = useState(() =>
    target ? Math.max(0, target.timestamp - Date.now()) : 0,
  );

  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, target.timestamp - Date.now())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [target]);

  if (!target) return <p className="countdown-complete">The celebrations have begun.</p>;
  const values = [
    ["Days", Math.floor(remaining / 86400000)],
    ["Hours", Math.floor((remaining / 3600000) % 24)],
    ["Minutes", Math.floor((remaining / 60000) % 60)],
    ["Seconds", Math.floor((remaining / 1000) % 60)],
  ];
  return (
    <div>
      <p className="countdown-label">Counting down to {target.shortName}</p>
      <div className="countdown" aria-label={`Countdown to ${target.shortName}`}>
        {values.map(([label, value]) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeICS(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function downloadCalendar(event: Celebration) {
  const description =
    event.id === "wedding" ? `${event.timeLabel} ${event.supportingLine}` : event.supportingLine;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amit and Ankita//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${event.id}-amit-ankita-2026@invitation`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=${config.calendar.timezone}:${event.start}`,
    `DTEND;TZID=${config.calendar.timezone}:${event.end}`,
    `SUMMARY:${escapeICS(event.calendarTitle)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(event.venue)}`,
    `URL:${event.mapUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `amit-ankita-${event.id}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{children}</h2>
      <div className="botanical-rule">
        <i />
        <b>◆</b>
        <i />
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Celebration; index: number }) {
  return (
    <motion.article
      id={event.id}
      className={`event-card scene-${event.scene}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
    >
      <img src={event.image} alt="" loading="lazy" />
      <div className="event-wash" />
      <div className="event-ornament" aria-hidden="true">
        {event.scene === "fire" ? (
          <svg viewBox="0 0 90 90">
            <path d="M47 10c5 18-10 20-6 35 3-7 9-8 12-18 13 18 18 31 8 45-8 12-29 13-40 0-12-15-2-32 11-43-2 16 6 20 9 21-1-16 13-22 6-40Z" />
          </svg>
        ) : (
          <Sparkles />
        )}
      </div>
      <div className="event-content">
        <p className="event-number">Celebration 0{index + 1}</p>
        <h3>{event.title}</h3>
        <p className="event-line">{event.supportingLine}</p>
        <div className="event-details">
          <strong>{event.dateLabel}</strong>
          <span>{event.timeLabel}</span>
          {event.phereTime && <span>Phere: {event.phereTime}</span>}
          <span>{event.venue}</span>
        </div>
        <div className="event-actions">
          <a
            className="button button-solid focus-ring"
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin /> Directions
          </a>
          <button
            className="button button-outline focus-ring"
            type="button"
            onClick={() => downloadCalendar(event)}
          >
            <CalendarDays /> Add to calendar
          </button>
        </div>
      </div>
    </motion.article>
  );
}

type RSVPData = {
  name: string;
  attendance: "yes" | "no";
  guests: string;
  celebrations: string[];
  dietary: string;
  message: string;
};

function RSVP() {
  const [data, setData] = useState<RSVPData>({
    name: "",
    attendance: "yes",
    guests: "1",
    celebrations: [],
    dietary: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCelebration = (label: string) => {
    setData((current) => ({
      ...current,
      celebrations: current.celebrations.includes(label)
        ? current.celebrations.filter((item) => item !== label)
        : [...current.celebrations, label],
    }));
  };

  const buildMessage = () => {
    const attending = data.attendance === "yes";
    const lines = [
      "RSVP for Amit & Ankita",
      "",
      `Name: ${data.name.trim()}`,
      `Attendance: ${attending ? "Joyfully attending" : "Sending our wishes"}`,
    ];
    if (attending) {
      lines.push(
        `Guests (including me): ${data.guests}`,
        `Celebrations: ${data.celebrations.join(", ")}`,
      );
      if (data.dietary.trim()) lines.push(`Dietary requirements: ${data.dietary.trim()}`);
    }
    if (data.message.trim()) lines.push(`Message: ${data.message.trim()}`);
    return lines.join("\n");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = "Please enter your full name.";
    if (data.attendance === "yes") {
      const guests = Number(data.guests);
      if (!Number.isInteger(guests) || guests < 1)
        nextErrors.guests = "Please enter at least one guest.";
      if (!data.celebrations.length)
        nextErrors.celebrations = "Please choose at least one celebration.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setPreview(buildMessage());
    setDialogOpen(true);
  };

  const sendWhatsApp = () => {
    if (!config.optional.whatsappHostNumber) return;
    const number = config.optional.whatsappHostNumber.replace(/\D/g, "");
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(preview)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const attending = data.attendance === "yes";
  return (
    <>
      <form className="rsvp-form" onSubmit={submit} noValidate>
        <label className="field">
          <span>
            Full name <b>*</b>
          </span>
          <input
            value={data.name}
            onChange={(event) => setData({ ...data, name: event.target.value })}
            aria-invalid={Boolean(errors.name)}
            placeholder="Your full name"
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <fieldset>
          <legend>Will you be joining us?</legend>
          <div className="choice-grid two">
            {[
              ["yes", "Joyfully attending"],
              ["no", "Sending our wishes"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`choice ${data.attendance === value ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value={value}
                  checked={data.attendance === value}
                  onChange={() =>
                    setData({
                      ...data,
                      attendance: value as "yes" | "no",
                      ...(value === "no" ? { guests: "1", celebrations: [], dietary: "" } : {}),
                    })
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <AnimatePresence initial={false}>
          {attending && (
            <motion.div
              className="attending-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="field">
                <span>Number of guests, including yourself</span>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={data.guests}
                  onChange={(event) => setData({ ...data, guests: event.target.value })}
                  aria-invalid={Boolean(errors.guests)}
                />
                {errors.guests && <small className="error">{errors.guests}</small>}
              </label>
              <fieldset>
                <legend>Celebrations attending</legend>
                <div className="choice-grid">
                  {config.celebrations.map((event) => (
                    <label
                      className={`choice ${data.celebrations.includes(event.shortName) ? "selected" : ""}`}
                      key={event.id}
                    >
                      <input
                        type="checkbox"
                        checked={data.celebrations.includes(event.shortName)}
                        onChange={() => toggleCelebration(event.shortName)}
                      />
                      <span>{event.shortName}</span>
                      {data.celebrations.includes(event.shortName) && <Check />}
                    </label>
                  ))}
                </div>
                {errors.celebrations && <small className="error">{errors.celebrations}</small>}
              </fieldset>
              <label className="field">
                <span>
                  Dietary requirements <em>Optional</em>
                </span>
                <input
                  value={data.dietary}
                  onChange={(event) => setData({ ...data, dietary: event.target.value })}
                  placeholder="Please share any requirements"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <label className="field">
          <span>
            Message for Amit & Ankita <em>Optional</em>
          </span>
          <textarea
            rows={4}
            value={data.message}
            onChange={(event) => setData({ ...data, message: event.target.value })}
            placeholder="Leave a note for the couple"
          />
        </label>
        <button className="button button-submit focus-ring" type="submit">
          <Send /> Prepare RSVP
        </button>
        <p className="form-note">Your message opens in WhatsApp for you to review and send.</p>
      </form>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Close className="dialog-close focus-ring">
              <X />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            <Dialog.Title>Review your RSVP</Dialog.Title>
            <Dialog.Description>
              {config.optional.whatsappHostNumber
                ? "Review your message, then continue to WhatsApp. You will send it yourself."
                : "No host number is configured yet. Copy this demo message to share it manually."}
            </Dialog.Description>
            <pre>{preview}</pre>
            {config.optional.whatsappHostNumber ? (
              <button
                type="button"
                className="button button-submit focus-ring"
                onClick={sendWhatsApp}
              >
                <Send /> Continue to WhatsApp
              </button>
            ) : (
              <button
                type="button"
                className="button button-submit focus-ring"
                onClick={copyMessage}
              >
                {copied ? <Check /> : <Clipboard />}
                {copied ? "Copied" : "Copy message"}
              </button>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default function App() {
  const [opened, setOpened] = useState(() => localStorage.getItem(INTRO_STORAGE_KEY) === "true");
  const [interacted, setInteracted] = useState(opened);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const parentsPresent =
    Boolean(config.couple.firstParents) || Boolean(config.couple.secondParents);
  const optionalDetails = Object.entries({
    Travel: config.optional.travel,
    Stay: config.optional.stay,
    Contact: config.optional.contact,
  }).filter(([, value]) => Boolean(value));

  return (
    <div className="invitation">
      <AnimatePresence>
        {!opened && (
          <Opening onInteraction={() => setInteracted(true)} onComplete={() => setOpened(true)} />
        )}
      </AnimatePresence>
      <Navigation
        onReplay={() => {
          localStorage.removeItem(INTRO_STORAGE_KEY);
          setOpened(false);
        }}
      />
      <MusicControl canPlay={interacted} />
      <main>
        <section className="hero" id="our-wedding">
          <div className="paper-grain" />
          <div className="hero-botanical botanical-left" aria-hidden="true" />
          <div className="hero-botanical botanical-right" aria-hidden="true" />
          <motion.div
            className="hero-inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 24 }}
            transition={{ delay: 0.35, duration: 1 }}
          >
            <Monogram className="hero-monogram" />
            <p className="eyebrow">The wedding celebrations of</p>
            <h1>
              {config.couple.first}
              <span>&</span>
              {config.couple.second}
            </h1>
            {parentsPresent && (
              <div className="parent-lines">
                {config.couple.firstParents && <p>{config.couple.firstParents}</p>}
                {config.couple.secondParents && <p>{config.couple.secondParents}</p>}
              </div>
            )}
            <div className="hero-date">{config.weddingLabel}</div>
          </motion.div>
          <div className="hero-palace">
            <Palace />
          </div>
        </section>

        <section className="family-section" id="invitation">
          <div className="edge-flower edge-flower-left" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="script-accent">With joyful hearts</span>
            <p>{config.invitationLine}</p>
            <Monogram />
          </motion.div>
        </section>

        <section className="countdown-section">
          <SectionHeading eyebrow="Until we celebrate">Our forever begins in</SectionHeading>
          <Countdown />
        </section>

        <section className="celebrations-section" id="celebrations">
          <SectionHeading eyebrow="One link · All celebrations">The festivities</SectionHeading>
          <div className="events">
            {config.celebrations.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section className="venue-section" id="venue">
          <div className="venue-arch">
            <SectionHeading eyebrow="Where we gather">The venue</SectionHeading>
            <MapPin className="venue-pin" />
            <h3>{config.venue.name}</h3>
            <p>{config.venue.address}</p>
            <a
              className="button button-solid focus-ring"
              href={config.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin /> Open in Google Maps
            </a>
            <small>A venue search link is used until an exact map pin is supplied.</small>
          </div>
        </section>

        {optionalDetails.length > 0 && (
          <section className="optional-section">
            {optionalDetails.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <p>{value}</p>
              </div>
            ))}
          </section>
        )}

        <footer>
          <Monogram />
          <span>With love,</span>
          <strong>
            {config.couple.first} & {config.couple.second}
          </strong>
          <p>Indore · November 2026</p>
        </footer>
      </main>
    </div>
  );
}
