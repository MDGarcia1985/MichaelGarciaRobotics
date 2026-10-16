/*
 * File: scripts/check-navigation.cjs — browser regression for shared navigation.
 * Owner: Michael Garcia; contributor: Codex. Contact: michael@mandedesign.studio.
 * License: Pending confirmation.
 * Related decisions: DEV-2026-10-15-002, DEV-2026-10-16-001.
 * Run after npm run build; optional argv[2] supplies an installed Playwright module.
 * Uses a temporary localhost server and isolated headless Chrome context.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.argv[2] || 'playwright');

const BUILD_ROOT = path.resolve(__dirname, '../dist');
const EVIDENCE_DIR = path.resolve(__dirname, '../docs/verification');
const HOST = '127.0.0.1';
const MIME_TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const DESKTOP = { width: 1440, height: 900 };
const HEADER_WIDTHS = [1440, 390];
const TITLE_WIDTHS = [1440, 1024, 390];
const ROUTES = ['', 'robotics_projects', 'software_projects', 'design_projects', 'about', 'contact'];
const MENU_LABELS = ['Home', 'About', 'Contact'];
const MENU_DESTINATIONS = [['About', 'about'], ['Contact', 'contact'], ['Home', '']];
const DISCIPLINES = ['Robotics', 'Software', 'Design'];
const SESSION_KEY = 'mgr-engagement-complete';
const ENGAGEMENT_TIMEOUT_MS = 10000;
const ENGAGEMENT_RECHECK_MS = 6500;
const EXPECTED = {
  menu: { x: 14, y: 20, size: 40 },
  appearance: {
    background: 'rgb(18, 10, 7)',
    bar: 'rgb(232, 168, 11)',
    shadow: 'rgb(86, 22, 29) 0px 2px 6px 0px',
  },
  name: 'Michael Garcia',
  brandGap: 12,
  copyright: '© Michael Garcia',
  copyrightSize: '10px',
  copyrightInset: 10,
  titleSize: '150px',
};

/* Purpose: Serve built files. 
 * Design: Restrict reads to BUILD_ROOT.
 * Workflow: HTTP callback, the sole helper with Node's required request/response signature.
 * Data Handoff: Returns local build content or a 404 response. 
 */
async function serve(request, response) {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${HOST}`).pathname);
    const file = path.resolve(BUILD_ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(BUILD_ROOT + path.sep)) throw new Error('Outside build directory');
    response.setHeader('Content-Type', MIME_TYPES[path.extname(file)] || 'application/octet-stream');
    response.end(await fs.readFile(file));
  } catch {
    response.writeHead(404);
    response.end();
  }
}

/* Purpose: Acquire shared test resources. 
 * Design: Register each resource before the next await.
 * Workflow: Called inside main's try, so partial setup also reaches teardown.
 * Data Handoff: Populates context with server, URL, browser, page, and live locators. 
 */
async function setup(context) {
  context.server = http.createServer(serve);
  await new Promise((resolve, reject) => {
    context.server.once('error', reject);
    context.server.listen(0, HOST, resolve);
  });
  context.url = `http://${HOST}:${context.server.address().port}`;
  context.browser = await chromium.launch({ headless: true, channel: 'chrome' });
  context.page = await context.browser.newPage({ viewport: DESKTOP });
  context.page.on('pageerror', error => context.errors.push(error.message));
  await context.page.addInitScript(key => sessionStorage.setItem(key, 'wander'), SESSION_KEY);
  context.trigger = context.page.getByRole('button', { name: 'Navigation', exact: true });
  context.dropdown = context.page.locator('.navigation-dropdown');
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
}

/* Purpose: Start a verification at a known route/viewport. 
 * Design: Preserve test-session storage.
 * Workflow: Verifications pass the shared context and optional navigation settings.
 * Data Handoff: Updates the existing page; its locators remain reusable. 
 */
async function visit(context, { route = '', width = DESKTOP.width } = {}) {
  await context.page.setViewportSize({ width, height: DESKTOP.height });
  await context.page.goto(`${context.url}/#/${route}`);
}

/* Purpose: Save visual evidence. 
 * Design: Centralize output location and full-page capture.
 * Workflow: Called after the verification establishes the desired UI state.
 * Data Handoff: Writes the named screenshot into EVIDENCE_DIR. 
 */
async function screenshot(context, filename) {
  await context.page.screenshot({ path: path.join(EVIDENCE_DIR, filename), fullPage: true });
}

/* Purpose: Release all acquired resources. 
 * Design: Server cleanup survives browser-close errors.
 * Workflow: Called from main's finally after success, assertion failure, or partial setup.
 * Data Handoff: Closes the browser/contexts and the temporary listening server. 
 */
async function teardown(context) {
  try {
    if (context.browser) await context.browser.close();
  } finally {
    if (context.server?.listening) {
      await new Promise((resolve, reject) => context.server.close(error => error ? reject(error) : resolve()));
    }
  }
}

/* Purpose: Verify YAML-driven icon appearance. 
 * Design: Compare actual browser-computed styles.
 * Workflow: Starts on Home. 
 * Data Handoff: Adds geometry/style evidence to context.results. 
 */
async function verifyIconAppearance(context) {
  await visit(context);
  const { trigger, dropdown, results } = context;
  assert.equal(await dropdown.isVisible(), false);
  const box = await trigger.boundingBox();
  assert.equal(box.width, EXPECTED.menu.size);
  assert.equal(box.height, EXPECTED.menu.size);
  const appearance = await trigger.evaluate(el => ({
    background: getComputedStyle(el).backgroundColor,
    bar: getComputedStyle(el.querySelector('.navigation-icon-bar')).backgroundColor,
    shadow: getComputedStyle(el).boxShadow,
  }));
  assert.deepEqual(appearance, EXPECTED.appearance);
  results.push(`YAML appearance: ${JSON.stringify(appearance)}`);
}

/* Purpose: Verify disclosure controls. 
 * Design: Exercise pointer and native keyboard behavior.
 * Workflow: Starts with Home's closed dropdown. 
 * Data Handoff: Saves screenshot and T1 results. 
 */
async function verifyMenuInteractions(context) {
  await visit(context);
  const { page, trigger, dropdown, results } = context;
  await trigger.hover();
  assert.equal(await dropdown.isVisible(), false);
  await trigger.click();
  assert.deepEqual(await dropdown.locator('a').allTextContents(), MENU_LABELS);
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  await screenshot(context, 'navigation-desktop.png');
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
  for (let index = 0; index < MENU_LABELS.length; index++) await page.keyboard.press('Tab');
  assert.equal(await dropdown.isVisible(), false);
  await trigger.click();
  await page.locator('h1').click();
  assert.equal(await dropdown.isVisible(), false);
  results.push('T1: 40x40; no hover opening; click toggle; Enter/Space; Tab; ArrowDown; Escape; outside click');
}

/* Purpose: Verify dropdown destinations and shared installation. 
 * Design: Cover all registered pages.
 * Workflow: Starts on Home, then follows links and directly loads each route.
 * Data Handoff: Adds route integration results to the shared report. 
 */
async function verifyMenuRoutes(context) {
  await visit(context);
  const { page, trigger, dropdown, url, results } = context;
  for (const [label, route] of MENU_DESTINATIONS) {
    await trigger.click();
    await dropdown.getByRole('link', { name: label, exact: true }).click();
    await page.waitForURL(`${url}/#/${route}`);
    assert.equal(await dropdown.isVisible(), false);
    assert.equal(await trigger.count(), 1);
  }
  for (const route of ROUTES) {
    await visit(context, { route });
    assert.equal(await trigger.count(), 1);
    assert.equal(await page.locator('.site-header > button, .site-footer a, .site-footer button').count(), 0);
    await trigger.click();
    assert.deepEqual(await dropdown.locator('a').allTextContents(), MENU_LABELS);
    await page.keyboard.press('Escape');
    assert.equal(await dropdown.isVisible(), false);
  }
  results.push('T2: YAML labels/routes integrated; shared dropdown on all six pages; legacy header/footer actions removed');
}

/* Purpose: Verify consistent header/footer geometry. 
 * Design: Cover desktop and narrow widths.
 * Workflow: Loads each route independently. 
 * Data Handoff: Saves About screenshot and measurements. 
 */
async function verifySharedHeaderFooter(context) {
  const { page, trigger, results } = context;
  for (const width of HEADER_WIDTHS) {
    for (const route of ROUTES) {
      await visit(context, { route, width });
      const buttonBox = await trigger.boundingBox();
      assert.equal(buttonBox.x, EXPECTED.menu.x);
      assert.equal(buttonBox.y, EXPECTED.menu.y);
      assert.equal(buttonBox.width, EXPECTED.menu.size);
      assert.equal(buttonBox.height, EXPECTED.menu.size);
      assert.equal(await page.locator('.site-brand').textContent(), EXPECTED.name);
      const brandBox = await page.locator('.site-brand').boundingBox();
      assert.equal(brandBox.x, buttonBox.x + buttonBox.width + EXPECTED.brandGap);
      assert.equal(brandBox.y + brandBox.height / 2, buttonBox.y + buttonBox.height / 2);
      assert.equal(await page.locator('.site-copyright').textContent(), EXPECTED.copyright);
      const footer = await page.locator('.site-copyright').evaluate(el => ({
        fontSize: getComputedStyle(el).fontSize,
        x: el.getBoundingClientRect().x,
        bottomGap: document.querySelector('.page').getBoundingClientRect().bottom - el.getBoundingClientRect().bottom,
      }));
      assert.equal(footer.fontSize, EXPECTED.copyrightSize);
      assert.equal(footer.x, EXPECTED.copyrightInset);
      assert.equal(footer.bottomGap, EXPECTED.copyrightInset);
    }
  }
  results.push('Shared chrome: all six pages at 1440/390px have menu at (14,20), adjacent centered name, and 10px copyright inset 10px from bottom/left');
  await visit(context, { route: 'about' });
  await screenshot(context, 'shared-header-about.png');
}

/* Purpose: Verify fixed-size single-line title. 
 * Design: Measure text lines and overflow coverage.
 * Workflow: Loads Home at three widths. 
 * Data Handoff: Adds measurements and narrow screenshot. 
 */
async function verifyTitleLayout(context) {
  const { page, trigger, results } = context;
  for (const width of TITLE_WIDTHS) {
    await visit(context, { width });
    const title = await page.locator('h1').evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return { fontSize: getComputedStyle(el).fontSize, lines: range.getClientRects().length,
        left: el.getBoundingClientRect().left, width: el.getBoundingClientRect().width };
    });
    assert.equal(title.fontSize, EXPECTED.titleSize);
    assert.equal(title.lines, 1);
    assert.ok(title.left >= 0, 'The beginning of the title must remain reachable');
    assert.ok(await page.locator('.homepage').evaluate(el =>
      el.getBoundingClientRect().width >= document.documentElement.scrollWidth - 1),
      'Page background must extend behind horizontally overflowing title');
    results.push(`Title at ${width}px viewport: ${JSON.stringify(title)}`);
  }
  await trigger.click();
  await screenshot(context, 'navigation-narrow.png');
  await page.keyboard.press('Escape');
}

/* Purpose: Verify discipline navigation and history. 
 * Design: Keep each path deterministic.
 * Workflow: Starts each discipline on Home, then checks About history/refresh.
 * Data Handoff: Adds navigation regression results. 
 */
async function verifyNavigationHistory(context) {
  const { page, trigger, dropdown, results } = context;
  for (const label of DISCIPLINES) {
    await visit(context);
    await page.getByRole('button', { name: label, exact: true }).click();
    assert.equal(await page.locator('h1').textContent(), label);
  }
  await visit(context);
  await trigger.click();
  await dropdown.getByRole('link', { name: 'About', exact: true }).click();
  await page.goBack();
  assert.equal(await page.locator('h1').textContent(), EXPECTED.name);
  await page.goForward();
  assert.equal(await page.locator('h1').textContent(), 'About');
  await page.reload();
  assert.equal(await page.locator('h1').textContent(), 'About');
  results.push('T3: discipline navigation; back/forward/refresh');
}

/* Purpose: Verify once-per-session engagement. 
 * Design: Use fresh storage, isolated from other checks.
 * Workflow: Waits for the configured prompt, chooses, then reloads and checks suppression.
 * Data Handoff: Captures page errors/results and closes the fresh context in finally. 
 */
async function verifyEngagement(context) {
  const fresh = await context.browser.newContext({ viewport: DESKTOP });
  try {
    const home = await fresh.newPage();
    home.on('pageerror', error => context.errors.push(error.message));
    await home.goto(context.url);
    await home.getByRole('dialog').waitFor({ timeout: ENGAGEMENT_TIMEOUT_MS });
    await home.getByRole('button', { name: 'Just looking', exact: true }).click();
    assert.equal(await home.getByRole('dialog').count(), 0);
    await home.reload();
    await home.waitForTimeout(ENGAGEMENT_RECHECK_MS);
    assert.equal(await home.getByRole('dialog').count(), 0);
    context.results.push('T3: current 6-second session-only engagement');
  } finally {
    await fresh.close();
  }
}

/* Purpose: Orchestrate the regression suite. 
 * Design: One context and unconditional cleanup.
 * Workflow: CLI entry point after a production build. 
 * Data Handoff: Writes the existing JSON report. 
 */
async function main() {
  const context = { results: [], errors: [] };
  try {
    await setup(context);
    for (const verify of [verifyIconAppearance, verifyMenuInteractions, verifyMenuRoutes,
      verifySharedHeaderFooter, verifyTitleLayout, verifyNavigationHistory, verifyEngagement]) {
      await verify(context);
    }
    assert.deepEqual(context.errors, []);
    context.results.push('T3: no page errors');
    await fs.writeFile(path.join(EVIDENCE_DIR, 'navigation-report.json'), JSON.stringify({ results: context.results }, null, 2));
    console.log(context.results.join('\n'));
  } finally {
    await teardown(context);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
