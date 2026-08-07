+++
title = "Donate"
date = 2026-08-07
path = "/donate"
+++

Support my work by donating to my Solana wallet:

<div class="donate-wallet">
  <code id="wallet-address">Ct8DxsdKKJvNncrX4cLZ2RYzh6dz84R6ewxPzB7y54p7</code>
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
