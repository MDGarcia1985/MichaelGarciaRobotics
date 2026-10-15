/**
 * File: scripts/check-navigation.cjs — browser regression for shared navigation.
 * Owner: Michael Garcia; contributor: Codex. Contact: michael@mandedesign.studio.
 * License: Pending confirmation. Related decision: DEV-2026-10-15-002.
 * Run after npm run build; optional argv[2] supplies an installed Playwright module.
 * Uses a temporary localhost server and isolated headless Chrome context.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '../dist');
const evidence = path.resolve(__dirname, '../docs/verification');

/** Purpose: Serve only built project files. Design: Restrict reads to dist.
 * Workflow: Local browser requests. Data Handoff: HTTP content or 404. */
async function serve(request, response) {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + path.sep)) throw new Error('Outside build directory');
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(await fs.readFile(file));
  } catch {
    response.writeHead(404);
    response.end();
  }
}

/** Purpose: Verify requested navigation and title behavior in a real browser.
 * Design: Exercise public DOM interactions at desktop/narrow widths and all routes.
 * Workflow: Run against a fresh production build with installed Playwright/Chrome.
 * Data Handoff: Writes screenshots/report; closes server/browser even on failure. */
async function main() {
  const server = http.createServer(serve);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem('mgr-engagement-complete', 'wander'));
    await page.goto(url);
    const trigger = page.getByRole('button', { name: 'Navigation', exact: true });
    const dropdown = page.locator('.navigation-dropdown');
    assert.equal(await dropdown.isVisible(), false);
    const box = await trigger.boundingBox();
    assert.equal(box.width, 40);
    assert.equal(box.height, 40);
    const appearance = await trigger.evaluate(el => ({
      background: getComputedStyle(el).backgroundColor,
      bar: getComputedStyle(el.querySelector('.navigation-icon-bar')).backgroundColor,
      shadow: getComputedStyle(el).boxShadow,
    }));
    assert.equal(appearance.background, 'rgb(18, 10, 7)');
    assert.equal(appearance.bar, 'rgb(232, 168, 11)');
    assert.equal(appearance.shadow, 'rgb(86, 22, 29) 0px 2px 6px 0px');
    results.push(`YAML appearance: ${JSON.stringify(appearance)}`);
    await trigger.hover();
    assert.equal(await dropdown.isVisible(), false);
    await trigger.click();
    assert.deepEqual(await dropdown.locator('a').allTextContents(), ['Home', 'About', 'Contact']);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await fs.mkdir(evidence, { recursive: true });
    await page.screenshot({ path: path.join(evidence, 'navigation-desktop.png'), fullPage: true });
    await trigger.click();
    assert.equal(await dropdown.isVisible(), false);
    await trigger.focus();
    await page.keyboard.press('Enter');
    assert.equal(await dropdown.isVisible(), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(), 'Home');
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
    assert.equal(await dropdown.isVisible(), false);
    await page.keyboard.press('Space');
    assert.equal(await dropdown.isVisible(), true);
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator(':focus').textContent(), 'Home');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    assert.equal(await dropdown.isVisible(), false);
    await trigger.click();
    await page.locator('h1').click();
    assert.equal(await dropdown.isVisible(), false);
    results.push('T1: 40x40; no hover opening; click toggle; Enter/Space; Tab; ArrowDown; Escape; outside click');

    for (const [label, route] of [['About', 'about'], ['Contact', 'contact'], ['Home', '']]) {
      await trigger.click();
      await dropdown.getByRole('link', { name: label, exact: true }).click();
      await page.waitForURL(`${url}/#/${route}`);
      assert.equal(await dropdown.isVisible(), false);
      assert.equal(await trigger.count(), 1);
    }
    for (const route of ['', 'robotics_projects', 'software_projects', 'design_projects', 'about', 'contact']) {
      await page.goto(`${url}/#/${route}`);
      assert.equal(await trigger.count(), 1);
      assert.equal(await page.locator('.site-header > button, .site-footer a, .site-footer button').count(), 0);
      await trigger.click();
      assert.deepEqual(await dropdown.locator('a').allTextContents(), ['Home', 'About', 'Contact']);
      await page.keyboard.press('Escape');
      assert.equal(await dropdown.isVisible(), false);
    }
    results.push('T2: YAML labels/routes integrated; shared dropdown on all six pages; legacy header/footer actions removed');

    await page.goto(url);
    for (const width of [1440, 1024, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const title = await page.locator('h1').evaluate(el => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return { fontSize: getComputedStyle(el).fontSize, lines: range.getClientRects().length,
          left: el.getBoundingClientRect().left, width: el.getBoundingClientRect().width };
      });
      assert.equal(title.fontSize, '150px');
      assert.equal(title.lines, 1);
      assert.ok(title.left >= 0, 'The beginning of the title must remain reachable');
      assert.ok(await page.locator('.homepage').evaluate(el =>
        el.getBoundingClientRect().width >= document.documentElement.scrollWidth - 1),
        'Page background must extend behind horizontally overflowing title');
      results.push(`Title at ${width}px viewport: ${JSON.stringify(title)}`);
    }
    await trigger.click();
    await page.screenshot({ path: path.join(evidence, 'navigation-narrow.png'), fullPage: true });
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const label of ['Robotics', 'Software', 'Design']) {
      await page.goto(url);
      await page.getByRole('button', { name: label, exact: true }).click();
      assert.equal(await page.locator('h1').textContent(), label);
    }
    await page.goto(url);
    await trigger.click();
    await dropdown.getByRole('link', { name: 'About', exact: true }).click();
    await page.goBack();
    assert.equal(await page.locator('h1').textContent(), 'Michael Garcia');
    await page.goForward();
    assert.equal(await page.locator('h1').textContent(), 'About');
    await page.reload();
    assert.equal(await page.locator('h1').textContent(), 'About');

    const fresh = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const home = await fresh.newPage();
    await home.goto(url);
    await home.getByRole('dialog').waitFor({ timeout: 10000 });
    await home.getByRole('button', { name: 'Just looking', exact: true }).click();
    assert.equal(await home.getByRole('dialog').count(), 0);
    await home.reload();
    await home.waitForTimeout(6500);
    assert.equal(await home.getByRole('dialog').count(), 0);
    assert.deepEqual(errors, []);
    results.push('T3: discipline navigation; back/forward/refresh; current 6-second session-only engagement; no page errors');
    await fs.writeFile(path.join(evidence, 'navigation-report.json'), JSON.stringify({ results }, null, 2));
    console.log(results.join('\n'));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
