/*
 * File: scripts/check-navigation.cjs — browser regression for shared navigation.
 * Owner: Michael Garcia; contributor: Codex. Contact: michael@mandedesign.studio.
 * License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-10-16-001, DEV-2026-10-23-002.
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
const VIEWPORTS = [
  { width: 320, height: 568 }, { width: 375, height: 667 },
  { width: 390, height: 844 }, { width: 430, height: 932 },
  { width: 667, height: 375 }, { width: 768, height: 1024 },
  { width: 1024, height: 768 }, DESKTOP,
];
const ROUTES = ['', 'robotics_projects', 'software_projects', 'design_projects', 'blog', 'about', 'contact'];
const MENU_LABELS = ['Home', 'Robotics', 'Software', 'Design', 'BLOG', 'About', 'Contact'];
const MENU_DESTINATIONS = [
  ['Robotics', 'robotics_projects'], ['Software', 'software_projects'],
  ['Design', 'design_projects'], ['BLOG', 'blog'],
  ['About', 'about'], ['Contact', 'contact'], ['Home', ''],
];
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
async function visit(context, { route = '', width = DESKTOP.width, height = DESKTOP.height } = {}) {
  await context.page.setViewportSize({ width, height });
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
    assert.equal(await page.locator('h1').textContent(), label === 'Home' ? EXPECTED.name : label);
    assert.equal(await dropdown.isVisible(), false);
    assert.equal(await trigger.count(), 1);
  }
  for (const route of ROUTES) {
    await visit(context, { route });
    assert.equal(await trigger.count(), 1);
    assert.equal(await page.locator('.site-header > button:not(.site-brand), .site-footer a, .site-footer button').count(), 0);
    await trigger.click();
    assert.deepEqual(await dropdown.locator('a').allTextContents(), MENU_LABELS);
    await page.keyboard.press('Escape');
    assert.equal(await dropdown.isVisible(), false);
  }
  results.push('T2: all seven menu destinations verified; shared dropdown on all seven pages; legacy header/footer actions removed');
}

/* Purpose: Verify consistent header/footer geometry. 
 * Design: Cover desktop and narrow widths.
 * Workflow: Loads each route independently. 
 * Data Handoff: Saves About screenshot and measurements. 
 */
async function verifySharedHeaderFooter(context) {
  const { page, trigger, results } = context;
  for (const viewport of VIEWPORTS) {
    const { width } = viewport;
    const desktop = width >= 1100;
    const inset = desktop ? 14 : Math.min(24, Math.max(16, width * .05));
    for (const route of ROUTES) {
      await visit(context, { route, ...viewport });
      const buttonBox = await trigger.boundingBox();
      assert.ok(Math.abs(buttonBox.x - inset) < 1);
      assert.equal(buttonBox.y, desktop ? 20 : 10);
      assert.equal(buttonBox.width, desktop ? 40 : 44);
      assert.equal(buttonBox.height, desktop ? 40 : 44);
      if (route === '') {
        assert.equal(await page.locator('.site-brand').count(), 0);
        assert.equal(await page.locator('.site-header').innerText(), '');
      } else {
        assert.equal(await page.locator('.site-brand').textContent(), EXPECTED.name);
        const brandBox = await page.locator('.site-brand').boundingBox();
        assert.equal(brandBox.x, buttonBox.x + buttonBox.width + 12);
        assert.equal(brandBox.y + brandBox.height / 2, buttonBox.y + buttonBox.height / 2);
      }
      assert.equal(await page.locator('.site-copyright').textContent(), EXPECTED.copyright);
      const footer = await page.locator('.site-copyright').evaluate(el => ({
        fontSize: getComputedStyle(el).fontSize,
        x: el.getBoundingClientRect().x,
        bottomGap: document.querySelector('.page').getBoundingClientRect().bottom - el.getBoundingClientRect().bottom,
      }));
      assert.equal(footer.fontSize, EXPECTED.copyrightSize);
      assert.ok(Math.abs(footer.x - (desktop ? 10 : inset)) < 1);
      assert.equal(footer.bottomGap, desktop ? 10 : 16);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route} at ${width}`);
      if (width < 768) {
        const heading = await page.locator('h1').boundingBox();
        assert.ok(Math.abs(heading.x - inset) < 1);
        assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).textAlign), 'left');
        const cards = await page.locator('.project-card').all();
        for (let index = 1; index < cards.length; index++) {
          const previous = await cards[index - 1].boundingBox();
          const current = await cards[index].boundingBox();
          assert.equal(current.x, previous.x);
          assert.ok(current.y >= previous.y + previous.height);
        }
      }
      await trigger.click();
      for (const link of await context.dropdown.locator('a').all()) {
        const box = await link.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.keyboard.press('Escape');
    }
  }
  results.push('All seven routes at 320/375/390/430/667/768/1024/1440: no horizontal overflow, consistent header/footer, 44px mobile targets, left-aligned single-column phones');
  await visit(context, { route: 'about' });
  await screenshot(context, 'shared-header-about.png');
}

/* Purpose: Verify responsive identity and retained desktop typography.
 * Design: Measure actual layout across portrait, landscape, tablet, and desktop.
 * Workflow: Loads shared Home content at each viewport.
 * Data Handoff: Adds layout evidence and representative screenshots. */
async function verifyTitleLayout(context) {
  const { page, trigger, results } = context;
  for (const viewport of VIEWPORTS) {
    await visit(context, viewport);
    const { width } = viewport;
    const title = await page.locator('h1').evaluate(el => ({
      fontSize: getComputedStyle(el).fontSize,
      left: el.getBoundingClientRect().left,
    }));
    if (width >= 1100) assert.equal(title.fontSize, EXPECTED.titleSize);
    const items = await page.locator('.hero-nav-item').all();
    const boxes = await Promise.all(items.map(item => item.boundingBox()));
    assert.deepEqual(await page.locator('.hero-nav-item').allTextContents(), DISCIPLINES);
    for (let index = 1; index < boxes.length; index++) {
      if (width < 768) {
        assert.equal(boxes[index].x, boxes[0].x);
        assert.ok(boxes[index].y >= boxes[index - 1].y + boxes[index - 1].height);
        assert.ok(boxes[index].height >= 44);
      } else assert.equal(boxes[index].y, boxes[0].y);
    }
    for (const separator of await page.locator('.separator').all()) {
      assert.equal(await separator.getAttribute('aria-hidden'), 'true');
      if (width < 768) assert.equal((await separator.boundingBox()).height, 1);
    }
    results.push(`Responsive identity at ${width}x${viewport.height}: ${JSON.stringify(title)}`);
    if ([320, 390, 1440].includes(width)) await screenshot(context, `responsive-home-${width}.png`);
  }
  await visit(context, { width: 390, height: 844 });
  await trigger.click();
  await screenshot(context, 'navigation-narrow.png');
  await page.keyboard.press('Escape');
  await visit(context, { route: 'robotics_projects', width: 390, height: 844 });
  await screenshot(context, 'responsive-project-390.png');
}

/* Purpose: Verify discipline navigation and history. 
 * Design: Keep each path deterministic.
 * Workflow: Starts each discipline on Home, then checks About history/refresh.
 * Data Handoff: Adds navigation regression results. 
 */
async function verifyNavigationHistory(context) {
  const { page, trigger, dropdown, results } = context;
  for (const route of ROUTES.filter(Boolean)) {
    await visit(context, { route, width: 390 });
    const brand = page.getByRole('button', { name: EXPECTED.name, exact: true });
    assert.ok((await brand.boundingBox()).height >= 44);
    await brand.focus();
    await page.keyboard.press(route === 'about' ? 'Space' : 'Enter');
    await page.waitForURL(`${context.url}/#/`);
    assert.equal(page.url(), `${context.url}/#/`);
    assert.equal(await page.locator('.site-brand').count(), 0);
  }
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
  for (const [label, route, key] of [
    ['Robotics', 'robotics_projects', 'robotics'],
    ['Software', 'software_projects', 'software'],
    ['Design', 'design_projects', 'design'],
    ['Just looking', '', 'wander'],
  ]) {
    const fresh = await context.browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });
    try {
      const home = await fresh.newPage();
      home.on('pageerror', error => context.errors.push(error.message));
      await home.goto(`${context.url}/#/`);
      await home.getByRole('dialog').waitFor({ timeout: ENGAGEMENT_TIMEOUT_MS });
      assert.ok(await home.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (key === 'wander') {
        await home.screenshot({ path: path.join(EVIDENCE_DIR, 'responsive-engagement-320.png') });
        await home.setViewportSize({ width: 667, height: 375 });
      }
      await home.getByRole('dialog').getByRole('button', { name: label, exact: true }).tap();
      assert.equal(await home.getByRole('dialog').count(), 0);
      assert.equal(home.url(), `${context.url}/#/${route}`);
      assert.equal(await home.locator('h1').textContent(), route ? label : EXPECTED.name);
      assert.equal(await home.evaluate(key => sessionStorage.getItem(key), SESSION_KEY), key);
      if (route) {
        assert.equal(await home.locator(':focus').textContent(), label);
        await home.getByRole('button', { name: EXPECTED.name, exact: true }).tap();
      }
      await home.reload();
      await home.waitForTimeout(ENGAGEMENT_RECHECK_MS);
      assert.equal(await home.getByRole('dialog').count(), 0);
      context.results.push(`Engagement: ${label} -> ${route || 'Home'}, session suppression on return/reload`);
    } finally {
      await fresh.close();
    }
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
