+++
title = "Donate"
path = "/donate"
+++

## Why Donate?

I build tools that make workflows faster, debugging clearer, and automation less painful. Every project on this site is a direct result of scratching my own itch — and sharing the solution.

Donations fund:
- **Time to build sicker tools than yesterday.** More experiments, deeper dives, cleaner abstractions.
- **Infrastructure costs.** Hosting, domains, CI/CD minutes, cloud credits for testing distributed systems.
- **Open-source contributions.** Upstream fixes, documentation, and maintaining the libraries I rely on.

No ads. No paywalls. Just tools that work and the commitment to keep improving them.

---

## How to Donate

Support this work via Solana:

<div class="donate-wallet">
  <code id="wallet-address">4pb8p2cTHdQb9WmU68n6AtQ3rrEHEzkQoESAXADzwKSF</code>
  <p class="donate-hint">Solana (SOL) network &middot; click to copy</p>
</div>

<script>
document.getElementById('wallet-address').addEventListener('click', async function () {
  try {
    await navigator.clipboard.writeText(this.textContent.trim());
    this.classList.add('copied');
    setTimeout(() => this.classList.remove('copied'), 1500);
  } catch (e) {}
});
</script>
