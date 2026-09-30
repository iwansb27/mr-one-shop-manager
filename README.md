# MR.ONE Shop Manager

Master architecture and development foundation for MR.ONE Shop Manager.

## Core principle

MR.ONE Shop Manager is a lightweight control center for production assets and marketing distribution.

**RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE**

## Current architecture

### Console 1 — MASTER ASSET STORAGE

Two paired master-asset components:

- **A — Digital Product Master**
- **B — Digital Content Master (short-form video)**

A and B share the same Product ID and remain permanently stored in Cloudinary.

Production is **outside Console 1**. Console 1 registers finished results, performs QC-1, maintains A/B pairing, and stores the permanent master in Cloudinary.

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

## Storage / registration boundary

Console 1 is **not a production engine**. Actual production happens outside the console. Console 1 only registers the finished A/B assets, performs QC-1, maintains pairing, and stores the permanent master in Cloudinary. No fake or unverified production integration.

See [MASTER HANDOFF BLUEPRINT](docs/MASTER-HANDOFF-BLUEPRINT.md).
