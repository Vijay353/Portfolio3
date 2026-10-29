import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { projects } from "./projects.ts";
import { featuredEntry, matchesLens, section } from "./query.ts";
import type { ProjectEntry } from "./types";
import { assertValidProjects, normalizeEntry, validateProjects } from "./validate.ts";

const publicDir = path.join(import.meta.dirname, "..", "..", "public");
const assetExists = (p: string) => fs.existsSync(path.join(publicDir, p.replace(/^\//, "")));

const base: ProjectEntry = {
  id: "example",
  kind: "agent",
  status: "published",
  eyebrow: "Agentic AI · Example",
  title: "Example — does a thing",
  lenses: ["agentic"],
  verification: { state: "verified", source: "test" },
};
const errorsFor = (entries: ProjectEntry[]) =>
  validateProjects(entries, { assetExists }).filter((i) => i.level === "error").map((i) => i.message);
const errors = (patch: Partial<ProjectEntry> | Record<string, unknown>) => errorsFor([{ ...base, ...patch } as ProjectEntry]);

describe("projects.ts", () => {
  it("passes the gate", () => {
    assert.deepEqual(errorsFor(projects), []);
  });

  it("ships the five agents, four case studies, and the archive", () => {
    assert.deepEqual(section(projects, "agent").map((e) => e.id), ["refund-assurance", "matchpoint", "business-impact-gate", "marginpulse", "genai-agentic-rag"]);
    assert.deepEqual(section(projects, "case-study").map((e) => e.id), ["configit-quote-to-order", "third-estate-property-data", "ub-product-discovery", "ai-contract-analyzer"]);
    assert.equal(section(projects, "archive").length, 15);
  });

  it("keeps deferred systems as unverified drafts", () => {
    for (const id of ["three-way-match", "soc-issue-solver", "quote-to-order", "agentforce-project"]) {
      const e = projects.find((p) => p.id === id);
      assert.equal(e?.status, "draft", id);
      assert.equal(e?.verification?.state, "unverified", id);
    }
  });
});

describe("identity", () => {
  it("rejects duplicate ids", () => assert.match(errorsFor([base, base]).join(), /duplicate id/));
  it("rejects malformed ids", () => assert.match(errors({ id: "Not A Slug" }).join(), /lowercase slug/));
  it("rejects unknown kinds", () => assert.match(errors({ kind: "widget" }).join(), /unknown kind/));
  it("rejects unknown statuses", () => assert.match(errors({ status: "live" }).join(), /unknown status/));
  it("treats empty strings as missing", () => assert.match(errors({ eyebrow: "   " }).join(), /missing required field "eyebrow"/));
});

describe("lenses", () => {
  it("rejects unknown lens values", () => assert.match(errors({ lenses: ["product", "agentic"] }).join(), /unknown lens "product"/));
  it("adds case-studies to case-study entries", () => {
    assert.deepEqual(normalizeEntry({ ...base, kind: "case-study", lenses: ["data-ai"] }).lenses, ["data-ai", "case-studies"]);
  });
});

describe("verification gate", () => {
  it("rejects published entries without verification", () => assert.match(errors({ verification: undefined }).join(), /need verification/));
  it("rejects published unverified entries", () => assert.match(errors({ verification: { state: "unverified" } }).join(), /need verification/));
  it("rejects published entries with flags", () =>
    assert.match(errors({ verification: { state: "verified", flags: ["metric-source-pending"] } }).join(), /open verification flags/));
  it("allows unverified drafts", () => assert.deepEqual(errors({ status: "draft", verification: { state: "unverified", flags: ["x"] } }), []));
  for (const marker of ["[pending]", "[verify] check this", "[fill]", "[CONTENT PENDING]", "[link pending]"]) {
    it(`rejects placeholder ${marker}`, () => assert.match(errors({ positioning: `Text ${marker}` }).join(), /placeholder text/));
  }
  it("rejects placeholders in drafts too", () => assert.match(errors({ status: "draft", problem: "[TBD]" }).join(), /placeholder text/));
  it("rejects placeholders in nested fields", () =>
    assert.match(errors({ proofStack: [{ value: "1", caption: "[pending] metric" }] }).join(), /placeholder text in proofStack\[0\]\.caption/));
});

describe("links", () => {
  it("rejects a Live demo pointing at a repo", () =>
    assert.match(errors({ links: [{ label: "Live demo", href: "https://github.com/me/app" }] }).join(), /real https deployment/));
  it("rejects a Live demo on localhost", () =>
    assert.match(errors({ links: [{ label: "Live demo", href: "http://localhost:3000" }] }).join(), /real https deployment/));
  it("rejects a deployed label without a URL", () => assert.match(errors({ links: [{ label: "Deployed app", href: "TBD" }] }).join(), /absolute http/));
  it("accepts a real Live demo", () => assert.deepEqual(errors({ links: [{ label: "Live demo", href: "https://app.example.com" }] }), []));
  it("accepts Run locally with a repo", () => assert.deepEqual(errors({ links: [{ label: "Run locally →", repo: "https://github.com/me/app" }] }), []));
  it("rejects a repo link with another label", () =>
    assert.match(errors({ links: [{ label: "Live demo", repo: "https://github.com/me/app" }] }).join(), /Run locally/));
});

describe("slots", () => {
  it("warns, not fails, outside the proof/architecture/stack ranges", () => {
    const issues = validateProjects([{ ...base, proofStack: Array(4).fill({ value: "1", caption: "x" }), architecture: [{ label: "a" }], stack: ["a"] }]);
    assert.deepEqual(issues.filter((i) => i.level === "error"), []);
    assert.equal(issues.filter((i) => i.level === "warning").length, 3);
  });
  it("rejects half a beforeAfter", () => assert.match(errors({ beforeAfter: { before: "x", after: "" } }).join(), /both before and after/));
  it("requires glimpse alt text", () => assert.match(errors({ glimpse: { type: "image", src: "https://cdn.example.com/a.png", alt: "" } }).join(), /alt text/));
  it("requires local glimpse files to exist", () =>
    assert.match(errors({ glimpse: { type: "image", src: "/images/projects/nope.png", alt: "x" } }).join(), /not found/));
  it("requires archive eyebrows to be a known group", () => assert.match(errors({ kind: "archive", eyebrow: "Misc" }).join(), /archive eyebrow/));
  it("allows one featured entry per section", () =>
    assert.match(errorsFor([{ ...base, featured: true }, { ...base, id: "other", featured: true }]).join(), /more than one featured/));
});

describe("selection", () => {
  const entries: ProjectEntry[] = [
    { ...base, id: "a" },
    { ...base, id: "b", order: 1 },
    { ...base, id: "c", status: "draft", verification: { state: "unverified" } },
  ];
  it("excludes drafts and honours order", () => assert.deepEqual(section(entries, "agent").map((e) => e.id), ["b", "a"]));
  it("drafts never shift lens counts", () => assert.equal(section(entries, "agent").filter((e) => matchesLens(e, "agentic")).length, 2));
  it("falls back to the first entry when none is featured", () => assert.equal(featuredEntry(section(entries, "agent"))?.id, "b"));
  it("assertValidProjects throws with every error listed", () =>
    assert.throws(() => assertValidProjects([{ ...base, id: "Bad" }, { ...base, lenses: ["nope" as never] }]), /lowercase slug[\s\S]*unknown lens/));
});
