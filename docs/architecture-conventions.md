# Architecture Conventions

## Core Concept: Bring Your Own Keys (BYOK)
- **Direct API Credentials Modal**: Instead of OAuth redirects, each platform card (Twitter/X, LinkedIn, Instagram, Facebook, Threads, TikTok, etc.) provides a "Connect" button that opens a dialog modal.
- **Connection Flow**: Users input their platform-specific API credentials (e.g., API Key, API Secret, Access Token, Client ID, Account ID).
- **Connection Status**: Accounts switch between `Disconnected` (prompt to enter keys) and `Connected` (keys saved, active for cross-posting, can disconnect/re-configure).

## Multi-Platform Composer & Caption Flow
- **Global / Default Caption**: Central composer input serving as the primary text for all active accounts.
- **Platform Overrides**: Optional per-platform text fields.
- **Resolution Strategy**:
  `Published Caption = (Platform Override text trimmed !== "") ? Platform Override : Default Caption`
- **Publishing Pipeline**: Iterates through selected connected platforms, dispatches post payloads with resolved captions & attachments via the stored API credentials.

## State & Data Flow
- Unified state management for connected accounts, composer contents (default + overrides + media), and dispatch status.
