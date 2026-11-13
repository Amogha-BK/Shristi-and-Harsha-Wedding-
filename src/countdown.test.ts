import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownParts } from "./countdown.ts";
import { invitationConfig } from "./invitationConfig.ts";

const wedding = invitationConfig.celebrations.find(event => event.id === "wedding")!;
const target = Date.parse(wedding.start);

test("wedding ceremony is 10 December 2026, 7 p.m. IST", () => {
  assert.equal(new Date(target).toISOString(), "2026-12-10T13:30:00.000Z");
});

test("counts down across November and December in IST", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2026-11-13T14:26:50+05:30")), {
    days: 27, hours: 4, minutes: 33, seconds: 10, complete: false,
  });
});

test("equivalent international clock readings give the same countdown", () => {
  const ist = Date.parse("2026-12-09T19:00:00+05:30");
  const utc = Date.parse("2026-12-09T13:30:00Z");
  const newYork = Date.parse("2026-12-09T08:30:00-05:00");
  const expected = { days: 1, hours: 0, minutes: 0, seconds: 0, complete: false };
  for (const now of [ist, utc, newYork]) assert.deepEqual(getCountdownParts(target, now), expected);
});

test("midnight on the wedding date still has 19 hours remaining", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2026-12-10T00:00:00+05:30")), {
    days: 0, hours: 19, minutes: 0, seconds: 0, complete: false,
  });
});

test("does not finish a fraction of a second before the ceremony", () => {
  assert.deepEqual(getCountdownParts(target, target - 1), {
    days: 0, hours: 0, minutes: 0, seconds: 1, complete: false,
  });
});

test("finishes at the ceremony and never shows negative values", () => {
  for (const now of [target, target + 86400000]) {
    assert.deepEqual(getCountdownParts(target, now), {
      days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
    });
  }
});
