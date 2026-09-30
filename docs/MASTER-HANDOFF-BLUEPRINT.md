# MASTER HANDOFF BLUEPRINT — MR.ONE SHOP MANAGER

**Status:** MASTER / LOCKED ARCHITECTURE — PRODUCT ENGINE REVISION

## 1. Purpose

MR.ONE Shop Manager is a lightweight control center for production assets and marketing distribution.

Core control operation:

**RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE**

Production may be automated, semi-automated, or manual/external depending on verified tool/API capability.

## 2. Locked Two-Lane Architecture

```
                         GPT
                          │
                          ▼
                 MR.ONE AGENT
                  ORCHESTRATOR
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        CONSOLE 1                 CONSOLE 2
      PRODUCT ENGINE             MARKETING
              │                       │
        ┌─────┴─────┐          Preview / Package
        ▼           ▼                  │
   A — DIGITAL   B — DIGITAL           ▼
     PRODUCT       CONTENT          QC-2 / APPROVE
        │           │                  │
        └─────┬─────┘                  ▼
              ▼                      BUFFER
          QC-1 / FINAL                 │
              │                 TikTok / Facebook /
              ▼                      YouTube
          CLOUDINARY
         MASTER ASSETS
```

**Console 1 and Console 2 are separate operational lanes.**

Console 1 does **not** publish products to a marketplace.

Console 2 does **not** create the master content.

The only functional relationship is:

**Console 2 → references B master → uses live Cloudinary URL/reference → marketing distribution.**

The master file remains in Cloudinary.

## 3. Console 1 — PRODUCT ENGINE

The previous Store/Shop Console 1 is removed as an operational concept.

Console 1 becomes:

# PRODUCT ENGINE

It has two paired components:

### A — DIGITAL PRODUCT

The permanent master product intended for sale or later manual delivery.

Possible types:

- PDF / ebook
- XLSX / spreadsheet
- ZIP package
- planner / journal
- Canva/business/content template
- niche template
- CapCut/video template when a valid production and delivery method is available

### B — DIGITAL CONTENT

The permanent marketing-content master belonging to A.

Initial final output:

**SHORT-FORM VIDEO / MP4**

Default target:

**15–25 seconds**, dynamically adapted to the product/channel.

Images may be used as source material during production, but B's primary final marketing asset is video.

## 4. A ↔ B Pairing Contract

Every product has one stable Product ID.

Example:

```
PRODUCT 001

001-A
DIGITAL PRODUCT MASTER
Budget Planner.pdf

001-B
DIGITAL CONTENT MASTER
Budget Planner Marketing.mp4
```

Identity:

```
Product ID: MRONE-001
A Asset ID: MRONE-001-A
B Asset ID: MRONE-001-B

PAIR: MRONE-001-A ↔ MRONE-001-B
```

The shared Product ID is the deterministic pairing key.

For multiple marketing videos:

```
MRONE-001-B-VID-01-V1.mp4
MRONE-001-B-VID-02-V1.mp4
```

All remain paired to **MRONE-001-A**.

## 5. Production Modes

Each A or B production job uses one of four modes:

| Mode | Meaning |
|---|---|
| **AUTO** | Verified automated generation is available |
| **SEMI-AUTO** | Automation prepares/executes part of production and an external/manual step completes it |
| **MANUAL** | Production happens outside the app; final result is registered and stored in Product Engine |
| **NOT AVAILABLE** | No reliable route exists; do not force an integration |

Manual does **not** mean the user must build the editor inside Console 1.

Example:

```
PRODUCT ENGINE
      │
      │ MANUAL
      ▼
External tool
(CapCut / Canva / other)
      │
      ▼
Final result
      │
      ▼
QC-1
      │
      ▼
Cloudinary MASTER
```

No fake editor, fake API, or unverified automation.

## 6. Console 1 UI / Control Contract

Console 1 is a **production control layer**, not a collection of third-party editors.

### A — DIGITAL PRODUCT panel

- Create Product
- Product ID
- Product Name
- Product Category
- Product Type
- Production Mode
- Production Status
- Version
- Master Asset
- QC-1 Status
- Cloudinary Status
- Linked B Content

### B — DIGITAL CONTENT panel

- Create Content
- Content ID
- Linked Product ID
- Content Type: VIDEO
- Production Mode
- Production Status
- Version
- Master Video
- QC-1 Status
- Cloudinary Status
- Console 2 Availability

### Control states

**AUTO → RUN → RESULT → QC-1 → SAVE MASTER**

**SEMI-AUTO → PREPARE → ASSISTED/EXTERNAL STEP → RESULT → QC-1 → SAVE MASTER**

**MANUAL → REGISTER RESULT → QC-1 → SAVE MASTER**

**NOT AVAILABLE → STOP**

## 7. Autonomous Production Boundary

Where a verified free/available API or built-in engine exists, Product Engine may call it.

Where no reliable API exists, Product Engine uses the external/manual path and registers the finished result.

Production tools are replaceable adapters. Product Engine owns:

- production job
- Product ID
- Asset ID
- A/B pairing
- status
- version
- QC-1
- Cloudinary master registration

It does not need to own the vendor's editor.

## 8. Cloudinary — Permanent Master Repository

Cloudinary is the permanent master warehouse for A and B.

**A master: NEVER AUTO-DELETE**

**B master: NEVER AUTO-DELETE**

Console 2 uses the live Cloudinary URL/reference for B. It does not move, duplicate, or delete the master unless a later explicit architecture requires a separate temporary distribution copy.

Any temporary distribution copy may be cleaned according to its retention policy.

## 9. Console 2 — PRESERVE EXISTING ARCHITECTURE

Console 2 is not redesigned in this revision.

Its existing marketing package remains:

- media/reference
- title
- description/caption
- CTA
- product link where applicable
- target platform
- target channel/account
- channel ID
- schedule

Operational flow:

**B master reference → Preview → QC-2 → Approve → Schedule → Buffer → TikTok / Facebook / YouTube**

Console 2 requests B by Product ID / Asset ID and receives the live Cloudinary URL/reference.

Console 2 is the marketing/distribution lane; it is not the production lane.

## 10. QC

### QC-1 — Production QC

Before an asset becomes a master:

- content correctness
- visual correctness
- file correctness
- format
- version
- completeness
- A/B pairing

### QC-2 — Distribution QC

Console 2 retains its existing checks:

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
- schedule

Do not redesign Console 2 without a new verified requirement.

## 11. Asset Naming

Recommended:

```
MRONE-001-A-PRODUCT-V1.pdf
MRONE-001-B-CONTENT-V1.mp4
```

Multiple B assets:

```
MRONE-001-B-VID-01-V1.mp4
MRONE-001-B-VID-02-V1.mp4
```

## 12. Agent Routing

```
Buat produk digital MRONE-001
→ Console 1 / A

Buat video marketing untuk MRONE-001
→ Console 1 / B

Ambil video marketing MRONE-001 untuk TikTok
→ Console 2 receives B live URL/reference
```

Ambiguous identity → **STOP**, never guess.

## 13. Safety / Free-First

- Missing Product ID → STOP
- Missing asset → STOP
- A/B mismatch → STOP
- Unsupported integration → MANUAL or NOT AVAILABLE
- API failure → never claim success
- Cloudinary master → never auto-delete
- Console 2 must not delete the master
- No unnecessary database/API
- Free / zero-rupiah first

## 14. Current Product Scope

Initial A candidates:

- budget/financial planners
- financial trackers
- UMKM bookkeeping templates
- life planners
- journals
- Canva templates
- business/content templates
- ebooks/guides
- spreadsheets
- niche templates
- CapCut/video templates where a valid method is available

Initial B:

**short-form marketing video / MP4**

Target duration: **15–25 seconds**, adapted per product/channel.

CTA, caption, description, platform, channel and scheduling remain Console 2 responsibilities.

## 15. Implementation Boundary

The repository currently contains the architecture/documentation foundation, not a complete application source tree. Therefore this change establishes the Product Engine contract and build specification first.

Actual production-tool connectors are added only after their capability/API is verified.

Final target:

**CONSOLE 1 = PRODUCT ENGINE**

**A = DIGITAL PRODUCT MASTER**

**B = DIGITAL CONTENT MASTER**

**CONSOLE 2 = MARKETING DISTRIBUTION**

**CLOUDINARY = PERMANENT MASTER REPOSITORY**

A and B remain permanently stored and paired by Product ID.


## 17. PRODUCTION CONTROL CORRECTION — LOCKED

**Important correction:** Console 1 is an **agentic control/orchestration layer**, not a production editor.

Actual production of A and B happens outside Console 1. Console 1 only:
- decides the production route;
- prepares brief/prompt/input;
- calls a verified production adapter when the runtime can actually call it;
- receives/registers the finished result;
- performs/records QC-1;
- pairs A ↔ B by Product ID;
- stores the permanent master reference in Cloudinary;
- reports status.

### Tool capability map

| Tool | Role | API/tool capability | Status for autonomous use |
|---|---|---|---|
| Canva | A design/template production | Official Connect REST API; ChatGPT Canva tool available | **Adapter path NOT YET VERIFIED** |
| Cloudinary | A/B permanent master storage | Upload/Admin API; ChatGPT Cloudinary tool available | **Storage control available in ChatGPT; repo-agent bridge NOT YET VERIFIED** |
| Descript | B video production/editing | ChatGPT tool available | **Repo-agent execution NOT YET VERIFIED** |
| HeyGen | B video generation | ChatGPT tool available | **Repo-agent execution NOT YET VERIFIED** |
| ElevenLabs | B media generation | API + ChatGPT tools; current Image/Video API requires Pro+ | **Do not hard-wire under Free-First** |
| Magnific | A/B visual generation/editing | ChatGPT tool available | **Repo-agent execution NOT YET VERIFIED** |
| Adobe Express | A design production | ChatGPT tool available | **Repo-agent execution NOT YET VERIFIED** |
| AI Video Maker | B video generation | ChatGPT tool available | **ChatGPT-side only until repo-agent bridge is verified** |
| CapCut | A template / B video production | No verified usable API path for this architecture | **EXTERNAL-MANUAL** |
| Buffer | Console 2 distribution | Public GraphQL API | **Console 2 only; not a Console 1 production tool** |

**Critical rule:** a tool being available to ChatGPT does not automatically make it callable by the Shop Manager repository's agent. The repository agent needs its own API, MCP/tool bridge, authenticated runtime access, or equivalent verified execution path.

Therefore:

**Console 1 = control plane.**  
**External tools = production plane.**  
**Cloudinary = permanent master plane.**  
**Console 2 = marketing/distribution plane.**

If no verified autonomous execution path exists, the status is **EXTERNAL-MANUAL**, never fake AUTO.

This correction does not redesign Console 2.
