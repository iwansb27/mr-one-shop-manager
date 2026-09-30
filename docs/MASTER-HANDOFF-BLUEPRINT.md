# MASTER HANDOFF BLUEPRINT — MR.ONE SHOP MANAGER

**Status:** MASTER / LOCKED ARCHITECTURE

## 1. Purpose

MR.ONE Shop Manager is a lightweight control center for managing **final digital product assets** and their distribution. It is not a production studio.

Core operation:

**RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE**

Production happens outside the Shop Manager.

---

## 2. Locked Core Architecture

```
                         GPT
                          │
                          ▼
                 MR.ONE AGENT
                  ORCHESTRATOR
                          │
                      CLOUDINARY
                     /          \
                    /            \
                   ▼              ▼
           MARKETING ASSETS   PRODUCT ASSETS
                   │              │
                   ▼              ▼
               CONSOLE 2       CONSOLE 1
               MARKETING          SHOP
                   │              │
                   ▼              ▼
             BUFFER PREVIEW     PREVIEW
                   │              │
                 APPROVE        APPROVE
                   │              │
                   ▼              ▼
                BUFFER        STORLAUNCH
                / | \
            TikTok FB YouTube
```

### Non-negotiable architecture rules

1. Cloudinary is the central **FINAL MASTER ASSET warehouse**.
2. Cloudinary is not a production workspace, editor, or experimentation area.
3. Production happens outside MR.ONE Shop Manager.
4. QC-1 happens outside Shop Manager before a final asset enters Cloudinary.
5. MR.ONE Agent / Orchestrator sits between GPT and the two lanes.
6. The Agent is not a third lane, storage system, or production engine.
7. Marketing and Product lanes remain completely separate.
8. QC-2 happens inside the relevant console before execution.
9. Product assets go directly to Storlaunch after approval.
10. Marketing assets use Buffer for scheduling/distribution.
11. Temporary marketing distribution copies may be cleaned after 24 hours.
12. Cloudinary master assets must never be automatically deleted.
13. Do not add unnecessary databases, APIs, or architecture without a real requirement.
14. **Free-first / zero-rupiah-first** is the default principle.

---

## 3. Production Boundary

Production is intentionally outside MR.ONE Shop Manager:

**Iwan + GPT + external production engine → Production Result → QC-1 → Final Asset → Cloudinary**

Shop Manager must NOT contain:

- production editor
- production engine
- production upload module
- draft production workspace
- production experimentation center

The Shop Manager manages final assets and distribution only.

---

## 4. Cloudinary — Final Master Repository

Cloudinary stores final assets only.

Each asset should have deterministic identity and metadata:

- Product ID
- Asset ID
- Domain: PRODUCT / MARKETING
- Asset role/type
- Version
- Status
- Tags / metadata
- Platform/context where relevant

Examples:

```
MRONE-001-PRODUCT-01-V1.pdf
MRONE-001-MARKETING-01-V1.mp4
```

Structured metadata example:

```
Product ID: MRONE-001
Asset ID: MRONE-001-MKT-VID-01
Domain: MARKETING
Role: PROMO_VIDEO
Version: V1
Status: FINAL
```

The Agent retrieves assets deterministically by Product ID, Asset ID, name, metadata, or tags.

---

## 5. MR.ONE Agent / Orchestrator

The Agent is intentionally lightweight.

Responsibilities:

- detect intent
- retrieve the correct Cloudinary asset
- validate identity and metadata
- route to PRODUCT or MARKETING
- send selected asset/data to the correct console
- create/track a lightweight Job ID
- return execution status

Examples:

```
Ambil MRONE-001 PDF untuk Shop
```

→ Product / Console 1

```
Ambil MRONE-001 video 02 untuk marketing TikTok
```

→ Marketing / Console 2

If identity is ambiguous, the Agent must stop rather than guess.

---

## 6. PRODUCT LANE — CONSOLE 1

Flow:

**Product Assets → Console 1 → Preview → QC-2 → Approve → Storlaunch**

Rules:

- transactional/store-oriented
- no scheduling layer
- after QC-2 approval, publish directly to Storlaunch
- no Buffer in this lane

Possible product assets:

- PDF
- ZIP
- cover
- preview representation
- main digital product file
- listing-support data

---

## 7. MARKETING LANE — CONSOLE 2

Flow:

**Marketing Assets → Console 2 → Buffer Preview → QC-2 → Schedule → Buffer → TikTok/Facebook/YouTube**

Each marketing package should include:

- media
- title
- description/caption
- CTA
- product link where applicable
- target platform
- target channel/account
- channel ID
- schedule/date/time

Preview must show metadata, not only the media.

Marketing supports large assets such as video.

Temporary distribution copies may be automatically deleted after 24 hours. The Cloudinary master remains untouched.

**Instagram is not part of this Buffer lane for now.**

---

## 8. Buffer Channel Verification

Console 2 must verify actual destinations, not merely report that an API is connected.

After Buffer connection:

1. Detect channels/accounts.
2. Identify platform.
3. Show channel/page name.
4. Show channel ID.
5. Verify the intended destination.
6. Block publishing if the channel is missing, ambiguous, or mismatched.

Target platforms:

- TikTok
- Facebook
- YouTube

---

## 9. QC SYSTEM

### QC-1 — Production QC

Performed outside Shop Manager.

Check:

- content correctness
- visual correctness
- file correctness
- format
- version
- completeness

Only approved final assets enter Cloudinary.

### QC-2 — Distribution QC

Performed inside the relevant console before execution.

Check:

- Product ID
- Asset ID
- selected asset
- route/domain
- destination
- platform
- channel
- channel ID
- title
- description
- CTA
- product link
- marketing schedule

QC-2 is the second safety filter against Agent routing mistakes.

---

## 10. Minimum API / Connector Set

Minimum required integrations:

- Cloudinary API / connector
- Storlaunch API
- Buffer API

AI model gateways/providers are not mandatory for the Shop Manager foundation.

Do not add unnecessary integrations before a real requirement exists.

Secrets/API keys must remain server-side where applicable.

---

## 11. Job ID / Audit

Use a lightweight audit record.

Example:

```
JOB-00027
Intent: Marketing
Product: MRONE-001
Asset: MKT-VID-02
Platform: TikTok
Channel ID: xxxx
Schedule: 2026-10-03 19:00
QC-2: APPROVED
Buffer: SCHEDULED
Status: SUCCESS
```

Recommended fields:

- Job ID
- Product ID
- Asset ID
- intent
- source
- destination
- timestamp
- QC-2 status
- execution status
- result/error

---

## 12. Safety / Error Rules

- Asset not found → **STOP**
- Product ID ambiguous → **STOP**
- Platform mismatch → **STOP**
- Channel ID not detected → **STOP**
- API failure → do not claim success
- Duplicate publish → use idempotency/duplicate protection where supported
- Never automatically delete a Cloudinary master
- Temporary marketing copies may be cleaned after 24 hours
- Retry only when safe
- Validate routing before execution

---

## 13. Shop Manager UI Philosophy

The interface should remain simple.

Primary interface:

**One natural-language command/prompt field**

Optional:

- Console 1 shortcut
- Console 2 shortcut
- result/distribution preview panel

Shop Manager should NOT require:

- manual file upload
- production editor
- production preview workspace
- production engine selection

Example command:

```
Ambil MRONE-001 product PDF dan siapkan untuk Console 1.
```

```
Ambil MRONE-001 marketing video 02 untuk TikTok,
tampilkan channel ID dan preview sebelum saya approve.
```

---

# 14. Build Phases

## PHASE 0 — FREEZE ARCHITECTURE

Lock:

- two lanes
- Cloudinary final-only
- Agent in the middle
- production outside
- QC-1 and QC-2
- Product → Storlaunch
- Marketing → Buffer
- marketing scheduling
- 24-hour temporary cleanup

Do not add architecture before the foundation is stable.

## PHASE 1 — ASSET CONTRACT

Define:

- Product ID
- Asset ID
- naming convention
- folder structure
- tags
- metadata
- domain
- asset role
- version
- final status

## PHASE 2 — CLOUDINARY FOUNDATION

Implement:

- folder structure
- final asset management
- search/list/get details
- metadata
- secure delivery URLs
- master protection
- deterministic retrieval

## PHASE 3 — SHOP SHELL

Implement:

- one command/prompt field
- result/preview panel
- no production center
- no production engine
- no production upload module

## PHASE 4 — MR.ONE AGENT

Implement:

- intent detection
- asset retrieval
- validation
- destination routing
- PRODUCT / MARKETING separation

## PHASE 5 — CONSOLE 1

Implement:

**Cloudinary → Product Asset → Console 1 → Preview → QC-2 → Approve → Storlaunch**

No scheduling.

## PHASE 6 — CONSOLE 2

Implement:

**Cloudinary → Marketing Asset → Console 2 → Marketing Distribution Package → Preview → QC-2 → Schedule → Buffer**

## PHASE 7 — BUFFER CHANNEL VERIFICATION

Implement:

- connection
- channel detection
- platform
- channel name
- channel ID
- destination verification
- blocking invalid destinations

## PHASE 8 — 24-HOUR CLEANUP

Only temporary marketing distribution copies may be cleaned.

Never delete the Cloudinary master.

## PHASE 9 — ERROR & AUDIT

Implement:

- Job ID
- execution status
- retry rules
- duplicate protection
- routing validation
- channel validation
- error logs
- publish confirmation

## PHASE 10 — END-TO-END TEST

### Product test

Cloudinary → Console 1 → Preview → QC-2 → Approve → Storlaunch

### Marketing test

Cloudinary → Console 2 → Preview → QC-2 → Schedule → Buffer → channel → cleanup

### Failure tests

- wrong Product ID
- missing asset
- wrong console
- wrong channel ID
- channel undetected
- duplicate publish
- API error
- schedule failure

---

# 15. Operational Workflow

1. Produce externally using GPT + the selected production engine.
2. Perform QC-1.
3. Put the final approved asset into Cloudinary.
4. Give a natural-language command to MR.ONE Agent.
5. Agent retrieves and routes the asset.
6. Review QC-2.
7. Product → approve → direct Storlaunch publication.
8. Marketing → approve → schedule → Buffer → TikTok/Facebook/YouTube.
9. Clean temporary marketing distribution copies after 24 hours.
10. Preserve the Cloudinary master.

---

# 16. Scope Boundary — Not Defined Yet

This blueprint intentionally does NOT define:

- product types
- digital product strategy
- production engine
- production prompt system
- video engine
- ebook/PDF/template production workflow
- AI model/provider selection
- external production tool stack

Those belong to the next design discussion.

The Shop Manager architecture remains the locked foundation.

---

# 17. Master Rule

**MR.ONE Shop Manager is a lightweight final-asset and distribution control center — not a production studio.**

Its job is:

**RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE**

The two lanes remain separate:

**PRODUCT → CONSOLE 1 → QC-2 → STORLAUNCH**

**MARKETING → CONSOLE 2 → QC-2 → SCHEDULE → BUFFER → TIKTOK / FACEBOOK / YOUTUBE**

Cloudinary remains the protected final master repository.
