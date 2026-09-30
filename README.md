# MR.ONE Shop Manager

Master architecture and development foundation for MR.ONE Shop Manager.

## Core principle

MR.ONE Shop Manager is a lightweight control center for production assets and marketing distribution.

**RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE**

## Current architecture

### Console 1 — PRODUCT ENGINE

Two paired production components:

- **A — Digital Product Master**
- **B — Digital Content Master (short-form video)**

A and B share the same Product ID and remain permanently stored in Cloudinary.

Production modes:

**AUTO / SEMI-AUTO / MANUAL / NOT AVAILABLE**

Manual production may use external tools; the finished result is registered, QC-1 checked, and stored in Cloudinary.

### Console 2 — MARKETING

Console 2 remains the separate marketing/distribution lane:

**B master reference → Preview → QC-2 → Approve → Schedule → Buffer → TikTok / Facebook / YouTube**

Console 2 uses the live Cloudinary URL/reference for B. It does not take ownership of the master.

## A/B pairing

Example:

```
MRONE-001-A → Digital Product Master
MRONE-001-B → Marketing Video Master

PAIR: MRONE-001-A ↔ MRONE-001-B
```

## Master storage

**Cloudinary = permanent master repository.**

A and B masters are never automatically deleted.

Temporary distribution copies, if created, may be cleaned according to their retention policy.

## Production boundary

Production tools are replaceable. Where a verified API/engine exists, Product Engine may automate it. Where it does not, production can happen externally/manual and the final result is registered back into Product Engine.

No fake or unverified integrations.

See [MASTER HANDOFF BLUEPRINT](docs/MASTER-HANDOFF-BLUEPRINT.md).
