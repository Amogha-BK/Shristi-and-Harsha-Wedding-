import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Clipboard,
  Flower2,
  MapPin,
  Menu,
  Music,
  Pause,
  Pointer,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { Celebration, invitationConfig as config } from "./invitationConfig";
import { getCountdownParts } from "./countdown";

const indiaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: config.calendar.timezone,
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

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

function InvitationOpening({ onOpen }: { onOpen: () => void }) {
  const reducedMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const moveSeal = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch" || !isPresent) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--seal-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
    event.currentTarget.style.setProperty("--seal-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 12}px`);
  };
  return (
    <motion.section
      className="invitation-opening"
      aria-label="Open Shristi and Harsh’s wedding invitation"
      initial={{ opacity: 1 }}
      exit={{ opacity: reducedMotion ? 0 : [1, 1, 0] }}
      transition={{ duration: reducedMotion ? 0.15 : 1.65, times: [0, 0.9, 1], ease: "easeInOut" }}
      onPointerMove={moveSeal}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--seal-x", "0px");
        event.currentTarget.style.setProperty("--seal-y", "0px");
      }}
    >
      {[-1, 1].map((direction) => (
        <motion.div
          key={direction}
          className={`opening-gate ${direction < 0 ? "opening-gate-left" : "opening-gate-right"}`}
          aria-hidden="true"
          exit={reducedMotion ? { opacity: 0 } : { x: `${direction * 104}%` }}
          transition={{ duration: reducedMotion ? 0.15 : 1.15, delay: reducedMotion ? 0 : 0.3, ease: [0.65, 0, 0.2, 1] }}
        />
      ))}
      <motion.div className="opening-floral-backdrop" aria-hidden="true" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
      <motion.div className="paper-grain" aria-hidden="true" exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
      <motion.div className="opening-stationery-frame" aria-hidden="true" exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }} transition={{ duration: 0.45 }} />
      <motion.div className="opening-sparkles" aria-hidden="true" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </motion.div>
      <div className="opening-welcome">
        <motion.div exit={{ opacity: 0, y: reducedMotion ? 0 : -18 }} transition={{ duration: 0.35 }}>
        <Flower2 className="opening-flower" strokeWidth={1} aria-hidden="true" />
        <p className="opening-kicker">A celebration of love &amp; togetherness</p>
        </motion.div>
        <h1 className="opening-names">
          <motion.span exit={{ opacity: 0, x: reducedMotion ? 0 : -45 }} transition={{ duration: 0.45 }}>{config.couple.first}</motion.span>
          <motion.button
            type="button"
            className="opening-logo-button focus-ring"
            onClick={onOpen}
            disabled={!isPresent}
            autoFocus
            aria-label="Open Shristi and Harsh’s wedding invitation"
            whileHover={reducedMotion ? undefined : { scale: 1.09, rotate: -3 }}
            whileTap={reducedMotion ? undefined : { scale: 0.9, rotate: 2 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: [1, 0.92, 1.18], opacity: [1, 1, 0], rotate: [0, -5, 3] }}
            transition={{ duration: reducedMotion ? 0.15 : 0.6 }}
          >
            <span className="opening-logo-glow" aria-hidden="true" />
            <span className="opening-logo-orbit" aria-hidden="true" />
            <img src={config.monogram} alt="" width={180} height={180} fetchPriority="high" />
            {!reducedMotion && <span className="opening-petal-burst" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <motion.i
                  key={index}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                  exit={{
                    x: Math.cos(index * Math.PI / 9) * (130 + index % 3 * 35),
                    y: Math.sin(index * Math.PI / 9) * (140 + index % 4 * 25),
                    rotate: index * 47,
                    scale: [0.3, 1, 0.7],
                    opacity: [0, 0.95, 0],
                  }}
                  transition={{ duration: 1.2, delay: index * 0.012, ease: "easeOut" }}
                />
              ))}
            </span>}
          </motion.button>
          <motion.span exit={{ opacity: 0, x: reducedMotion ? 0 : 45 }} transition={{ duration: 0.45 }}>{config.couple.second}</motion.span>
        </h1>
        <motion.div exit={{ opacity: 0, y: reducedMotion ? 0 : 14 }} transition={{ duration: 0.3 }}>
        <Pointer className="opening-tap-hint" strokeWidth={1.2} aria-hidden="true" />
        <p className="opening-instruction">Tap the monogram</p>
        <p className="opening-whisper">to open our invitation</p>
        <p className="opening-song-note"><Music size={11} aria-hidden="true" /> Opens with Kudmayi</p>
        <div className="opening-date-line"><span />10 December 2026<span /></div>
        <p className="opening-location">Indirapuram</p>
        </motion.div>
      </div>
    </motion.section>
  );
}


function MusicControl({ canPlay, audio }: { canPlay: boolean; audio: React.RefObject<HTMLAudioElement | null> }) {
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
  }, [canPlay, hasMusic, audio]);

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

function Countdown() {
  const target = Date.parse(config.countdownTarget);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  if (!Number.isFinite(target)) return null;
  const remaining = getCountdownParts(target, now);
  const values = [
    ["Days", remaining.days],
    ["Hours", remaining.hours],
    ["Minutes", remaining.minutes],
    ["Seconds", remaining.seconds],
  ];
  return (
    <div>
      <p className="countdown-label">{remaining.complete ? "Our wedding day is here!" : "Counting down to our wedding day"}</p>
      <p className="countdown-target"><time dateTime={config.countdownTarget}>10 December 2026 · 12:00 a.m. IST</time></p>
      <div className="countdown" role="timer" aria-label="Time remaining until midnight at the start of 10 December 2026, Indian Standard Time">
        {values.map(([label, value]) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-clock">Current time: <time dateTime={new Date(now).toISOString()}>{indiaClock.format(now)} IST</time></p>
    </div>
  );
}

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="section-heading">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{children}</h2>
      <div className="botanical-rule" aria-hidden="true">
        <i />
        <Flower2 strokeWidth={1} />
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
      <div className="event-portrait">
      <img src={event.image} alt="" loading="lazy" width={1024} height={1536} />
      <div className="event-content">
        <span className="event-number">Shristi &amp; Harsh · Celebration {String(index + 1).padStart(2, "0")}</span>
        <h3>{event.shortName}</h3>
        <p className="event-subtitle">{event.title.split(" — ")[1]}</p>
        <div className="event-details">
          <strong>{event.dateLabel}</strong>
          <span>{event.timeLabel}</span>
          {event.phereTime && <span>Phere: {event.phereTime}</span>}
          <span className="event-venue">{event.venue}</span>
          <span className="event-address">{event.address}</span>
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
      </div>
      <p className="event-line">{event.supportingLine}</p>
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
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const invitationHeading = useRef<HTMLHeadingElement>(null);
  const weddingAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (revealed) invitationHeading.current?.focus({ preventScroll: true });
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [revealed]);

  const openInvitation = () => {
    if (opened) return;
    // Start in the tap handler so mobile browsers retain user activation.
    if (weddingAudio.current) {
      weddingAudio.current.volume = 0.35;
      void weddingAudio.current.play().catch(() => {
        // The music control can retry if playback is unavailable or blocked.
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpened(true);
  };

  const parentsPresent =
    Boolean(config.couple.firstParents) || Boolean(config.couple.secondParents);
  const optionalDetails = Object.entries({
    Travel: config.optional.travel,
    Stay: config.optional.stay,
    Contact: config.optional.contact,
  }).filter(([, value]) => Boolean(value));

  return (
    <>
    <AnimatePresence onExitComplete={() => setRevealed(true)}>
      {!opened && <InvitationOpening key="opening" onOpen={openInvitation} />}
    </AnimatePresence>
    <div className="invitation" inert={!revealed} aria-hidden={!revealed}>
      <Navigation />
      <MusicControl canPlay={opened} audio={weddingAudio} />
      <main>
        <section className="hero" id="our-wedding">
          <div className="paper-grain" />
          <div className="hero-inner">
            <p className="ganesh-invocation">॥ Shri Ganeshaya Namah ॥</p>
            <Monogram className="hero-monogram" />
            <p className="eyebrow">The wedding celebrations of</p>
            <h1 ref={invitationHeading} tabIndex={-1}>
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
            <p className="ganesh-invocation family-invocation">॥ Shri Ganeshaya Namah ॥</p>
            <p className="family-memory">{config.memorialLine}</p>
            <p>{config.invitationLine}</p>
            <div className="invitation-families" aria-label="The couple and their families">
              <div>
                <h2>{config.couple.first}</h2>
                <p>{config.couple.brideParents}</p>
              </div>
              <span className="family-weds">weds</span>
              <div>
                <h2>{config.couple.second}</h2>
                <p>{config.couple.groomGrandparents}</p>
                <p>{config.couple.groomParents}</p>
              </div>
            </div>
            <p className="family-blessing">{config.blessingLine}</p>
            <div className="invitation-regards">
              <div><h3>R.S.V.P.</h3><p>{config.rsvp}</p></div>
              <div><h3>With best wishes from:</h3><p>{config.wishesFrom}</p></div>
            </div>
            <Monogram />
          </motion.div>
        </section>

        <section className="countdown-section">
          <SectionHeading eyebrow="Until we celebrate">Our forever begins in</SectionHeading>
          <Countdown />
        </section>

        <section className="celebrations-section" id="celebrations">
          <Monogram className="celebrations-monogram" />
          <p className="programme-invocation">॥ Shri Ganeshaya Namah ॥</p>
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
            <span>From:</span>
            <p className="closing-message">
              {config.hosts}
            </p>
            <p>{config.homeAddress}</p>
            <div className="family-contacts">
              <div className="contact-numbers" aria-label="Family contact numbers">
                <span className="contact-label">Contact:</span>
                {config.contacts.map((number, index) => (
                  <span key={number} className="contact-number">
                    {index > 0 && <span className="contact-separator" aria-hidden="true">·</span>}
                    {number.length === 10 ? (
                      <a className="focus-ring" href={`tel:+91${number}`}>{number}</a>
                    ) : number}
                  </span>
                ))}
              </div>
            </div>
            <div className="closing-rule" aria-hidden="true" />
            <p>Our celebration is complete with you.</p>
          </div>
        </footer>
      </main>
    </div>
    </>
  );
}
