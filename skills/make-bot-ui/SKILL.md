---
name: make-bot-ui
description: Use when creating a page or dashboard whose controls invoke an agent or bot through an authenticated webhook.
---

# Make a bot UI

Read the [runtime contract](../simplicit/references/runtime.md). Build a browser UI backed by a local server. The server calls the configured webhook; the browser never receives its sender secret.

## Establish the real integration

Discover the selected provider's available connector or documented API. Identify the routine, request schema, URL, authentication headers, response semantics, and permitted actions from that provider. A Codex skill is not a webhook receiver. If no webhook-capable runtime exists, build and test a local mock boundary, report the missing integration, and do not claim the bot wakes.

Create or update a routine only within the user's authorized scope. Reuse an existing routine when requested. Treat the event body as data with an explicit action allowlist and validated fields, not instructions that grant new authority. Use the provider's documented secret manager or a local environment variable; never ask the user to paste a secret into chat, embed it in browser assets, print it, or commit it.

## Build the bridge

Keep the UI fields small and consistent with the receiver's schema. Buttons POST to the local server, which validates action and payload, reads the secret server-side, and sends JSON to the observed endpoint. Use the provider's actual authentication contract; do not guess headers from another product.

Use a bounded timeout and one attempt by default. A timeout may mean the receiver acted; do not blindly replay a non-idempotent action. If durable retries are requested, use a deduplication key, authenticated queue and defined retention, then test repeated delivery. Show useful pending, success and failure states. Keep credentials and sensitive payloads out of logs.

Bind locally by default. For requested remote access, use the user's chosen authenticated network or hosting setup. Confirm network exposure and access control before widening the bind. Reuse an existing Tailscale node if that is the chosen network; obtain its actual status and address, never invent a hostname. Installing or changing network configuration is separate from writing the UI.

## Verify and deliver

Test the browser-to-server path, payload rejection, missing credentials, timeout, and duplicate-click behavior against a mock receiver. With authorization for the external effect, send one harmless documented test event and read back evidence that the intended routine received it. A server HTTP 200 alone does not prove the bot performed its task.

Report the local URL, observed remote URL when applicable, where secrets must be configured, tested paths, remaining dependencies, and cleanup/start instructions. Do not claim live operation for a mock-only build.
