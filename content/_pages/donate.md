+++
title = "支持我的開源工作"
path = "/donate"
+++

## 支持我的開源工作

我在做讓開發流程更順、除錯更清楚、自動化少一點痛苦的工具，像是 [graphify](https://github.com/cawa0505/graphify) 和 [statemachine-mcp](https://github.com/cawa0505/statemachine-mcp)。它們先解決我自己的問題，再開源分享出去。

你的贊助會用在：

- 持續投入開發與維護開源工具。
- 網站、網域、CI/CD 與測試環境等基礎成本。
- 上游修正、文件與我所依賴函式庫的維護。

沒有廣告，也沒有付費牆；只有持續變好的工具。

### 贊助方式

**PayPal**

<div class="donate-wallet">
  <a href="https://www.paypal.me/jimmyyen55" target="_blank" rel="noopener noreferrer">前往 PayPal 贊助</a>
  <p class="donate-hint">PayPal: zeng.tw@gmail.com</p>
</div>

**Solana (SOL)**

<div class="donate-wallet">
  <code data-copy>4pb8p2cTHdQb9WmU68n6AtQ3rrEHEzkQoESAXADzwKSF</code>
  <p class="donate-hint">Solana 網路，點擊地址複製</p>
</div>

---

## Support My Open-Source Work

I build tools that make development workflows smoother, debugging clearer, and automation less painful, including [graphify](https://github.com/cawa0505/graphify) and [statemachine-mcp](https://github.com/cawa0505/statemachine-mcp). They start by solving problems I have, then I share them as open source.

Your support funds continued development and maintenance, infrastructure such as hosting, domains, CI/CD, and test environments, plus upstream fixes and documentation.

No ads. No paywalls. Just tools that keep getting better.

### Donate

**PayPal**

<div class="donate-wallet">
  <a href="https://www.paypal.me/jimmyyen55" target="_blank" rel="noopener noreferrer">Donate with PayPal</a>
  <p class="donate-hint">PayPal: zeng.tw@gmail.com</p>
</div>

**Solana (SOL)**

<div class="donate-wallet">
  <code data-copy>4pb8p2cTHdQb9WmU68n6AtQ3rrEHEzkQoESAXADzwKSF</code>
  <p class="donate-hint">Solana network, click the address to copy</p>
</div>

<script>
document.querySelectorAll('[data-copy]').forEach(function (element) {
  element.addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(this.textContent.trim());
      this.classList.add('copied');
      setTimeout(() => this.classList.remove('copied'), 1500);
    } catch (e) {}
  });
});
</script>
