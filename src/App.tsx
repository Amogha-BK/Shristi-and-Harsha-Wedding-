import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Clipboard,
  MapPin,
  Menu,
  Music,
  Pause,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Celebration, invitationConfig as config } from "./invitationConfig";

const navItems = [
  ["Our Wedding", "our-wedding"],
  ["Celebrations", "celebrations"],
  ["Venue", "venue"],
  ["Contact", "contact"],
] as const;


function Monogram({ className = "" }: { className?: string }) {
  return (
    <img
      className={`monogram ${className}`}
      src={config.monogram}
      alt="S and H wedding monogram for Shristi and Harsh"
    />
  );
}


function MusicControl({ canPlay }: { canPlay: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const userControlled = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const hasMusic = Boolean(config.optional.musicUrl);

  useEffect(() => {
    const player = audio.current;
    if (!player || !canPlay || !hasMusic) return;
    let disposed = false;
    player.volume = 0.35;

    const removeListeners = () => {
      document.removeEventListener("pointerdown", startOnInteraction, true);
      document.removeEventListener("touchend", startOnInteraction, true);
      document.removeEventListener("keydown", startOnInteraction, true);
      window.removeEventListener("pageshow", tryAutoplay);
    };
    const tryAutoplay = () => {
      if (disposed || userControlled.current) return;
      void player.play().then(() => {
        if (!disposed) removeListeners();
      }).catch(() => {
        // If audible autoplay is blocked, retry on the first interaction.
      });
    };
    const startOnInteraction = (event: Event) => {
      if (userControlled.current) {
        removeListeners();
        return;
      }
      if (event.target instanceof Element && event.target.closest(".music-controls")) return;
      tryAutoplay();
    };

    document.addEventListener("pointerdown", startOnInteraction, true);
    document.addEventListener("touchend", startOnInteraction, true);
    document.addEventListener("keydown", startOnInteraction, true);
    window.addEventListener("pageshow", tryAutoplay);
    tryAutoplay();
    return () => {
      disposed = true;
      removeListeners();
    };
  }, [canPlay, hasMusic]);

  const togglePlay = async () => {
    if (!audio.current || !canPlay || !hasMusic) return;
    userControlled.current = true;
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
        <audio
          ref={audio}
          src={config.optional.musicUrl}
          autoPlay
          preload="auto"
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={() => setMuted(Boolean(audio.current?.muted))}
          onError={() => setPlaying(false)}
        />
      )}
      <button
        type="button"
        className="icon-button focus-ring"
        onClick={togglePlay}
        disabled={!hasMusic}
        aria-label={hasMusic ? (playing ? "Pause music" : "Play music") : "Music is not configured"}
        aria-pressed={playing}
        title={playing ? "Pause music" : "Play music"}
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
          aria-pressed={muted}
          title={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      )}
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav" aria-label="Invitation navigation">
      <a className="nav-mark focus-ring" href="#our-wedding" aria-label="Home">
        S <span>&</span> H
      </a>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {navItems.map(([label, id]) => (
          <a key={id} className="focus-ring" href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
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
    const wedding = config.celebrations.find((event) => event.id === "wedding");
    return wedding
      ? { ...wedding, timestamp: localEventToDate(wedding.start).getTime() }
      : null;
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

  if (!target || remaining === 0)
    return <p className="countdown-complete">Our wedding day is here.</p>;
  const values = [
    ["Days", Math.floor(remaining / 86400000)],
    ["Hours", Math.floor((remaining / 3600000) % 24)],
    ["Minutes", Math.floor((remaining / 60000) % 60)],
    ["Seconds", Math.floor((remaining / 1000) % 60)],
  ];
  return (
    <div>
      <p className="countdown-label">Counting down to our wedding day</p>
      <div className="countdown" aria-label="Countdown to our wedding day">
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

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="section-heading">
      {eyebrow && <span>{eyebrow}</span>}
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
      <div className="event-content">
        <span className="event-number">Celebration {String(index + 1).padStart(2, "0")} · {event.shortName}</span>
        <h3>{event.title}</h3>
        <p className="event-line">{event.supportingLine}</p>
        <div className="event-details">
          <strong>{event.dateLabel}</strong>
          <span>{event.timeLabel}</span>
          {event.phereTime && <span>Phere: {event.phereTime}</span>}
          <span>{event.venue}</span>
          <span>{event.address}</span>
        </div>
        <div className="event-actions">
          <a
            className="button button-outline focus-ring"
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin /> Directions
          </a>
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
      `RSVP for ${config.couple.first} & ${config.couple.second}`,
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
    const number = String(config.optional.whatsappHostNumber).replace(/\D/g, "");
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
            Message for Shristi &amp; Harsh <em>Optional</em>
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
  const parentsPresent =
    Boolean(config.couple.firstParents) || Boolean(config.couple.secondParents);
  const optionalDetails = Object.entries({
    Travel: config.optional.travel,
    Stay: config.optional.stay,
    Contact: config.optional.contact,
  }).filter(([, value]) => Boolean(value));

  return (
    <div className="invitation">
      <Navigation />
      <MusicControl canPlay />
      <main>
        <section className="hero" id="our-wedding">
          <div className="paper-grain" />
          <div className="hero-inner">
            <p className="ganesh-invocation">॥ Shri Ganeshaya Namah ॥</p>
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
          </div>
          <div className="hero-artwork" aria-hidden="true">
            <img src={config.artwork} alt="" fetchPriority="high" />
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
            <p className="grandparents-line">Harsh, grandson of Smt. Kamla Devi &amp; Sh. Pramveer Singh</p>
            <p className="family-blessing">Let us shower the couple with blessings as they begin their forever.</p>
            <Monogram />
          </motion.div>
        </section>

        <section className="countdown-section">
          <SectionHeading eyebrow="Until we celebrate">Our forever begins in</SectionHeading>
          <Countdown />
        </section>

        <section className="celebrations-section" id="celebrations">
          <Monogram className="celebrations-monogram" />
          <SectionHeading eyebrow="9–10 December 2026">Three celebrations, a lifetime of love</SectionHeading>
          <div className="events">
            {config.celebrations.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section className="venue-section" id="venue">
          <div className="venue-content">
            <SectionHeading eyebrow="Where we gather for the wedding">The wedding venue</SectionHeading>
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

        <footer id="contact">
          <div className="closing-copy">
            <Monogram />
            <span>With love,</span>
            <p className="closing-message">
              Mrs. &amp; Mr. Jagat Singh Chauhan, together with all relatives and friends,
              invite you to bless Shristi &amp; Harsh as they begin a beautiful forever.
            </p>
            <p>26 C, Heritage Divine, Gyan Khand 2, Indirapuram</p>
            <div className="family-contacts">
              <span>R.S.V.P. · Smt. Asha Devi &amp; Sh. Jagat Singh Chauhan</span>
              <a className="focus-ring" href="tel:+919582317003">95823 17003</a>
              <a className="focus-ring" href="tel:+919899012987">98990 12987</a>
              <small>Additional number as printed: {config.contacts[0]}</small>
            </div>
            <div className="closing-rule" aria-hidden="true" />
            <p>Our celebration is complete with you.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
