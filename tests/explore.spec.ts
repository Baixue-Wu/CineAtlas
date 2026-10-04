import { expect, test } from '@playwright/test';

test('world map, city selection, cultural guide and keyboard dismissal', async ({
  page,
}) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '跟着电影'
  );
  await expect(page.locator('.destination-marker')).toHaveCount(8);
  await expect(page.locator('.leaflet-overlay-pane path')).not.toHaveCount(0);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  await page.screenshot({ path: 'test-results/desktop-screen.png' });
  await page
    .getByRole('button', { name: '探索东京的电影', exact: true })
    .click();
  await expect(page.locator('.film-card')).toHaveCount(2);
  const film = page.getByRole('button', { name: '阅读《东京物语》文化导读' });
  await film.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '观影时，留意这两个细节' })
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/film-detail.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(film).toBeFocused();
  expect(failures).toEqual([]);
});

test('map markers navigate and browser history restores the destination', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: '探索巴黎，2 部匹配影片', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: '从电影认识巴黎' })
  ).toBeVisible();
  await page
    .locator('.destination-strip')
    .getByRole('button', { name: '孟买 2 部' })
    .click();
  await expect(
    page.getByRole('heading', { name: '从电影认识孟买' })
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole('heading', { name: '从电影认识巴黎' })
  ).toBeVisible();
});

test('story period and release decade produce different honest results', async ({
  page,
}) => {
  await page.goto('/#/timeline?place=mexico-city');
  await page.getByLabel('年代筛选').selectOption('1970');
  await expect(page.locator('.film-card')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: '阅读《罗马》文化导读' })
  ).toBeVisible();
  await page.getByLabel('时间依据').selectOption('release');
  await page.getByLabel('年代筛选').selectOption('1970');
  await expect(
    page.getByRole('heading', { name: '还没有符合这些条件的影片' })
  ).toBeVisible();
  await page.getByRole('button', { name: '重置筛选', exact: true }).click();
  await expect(page.locator('.film-card')).toHaveCount(2);
  await page.screenshot({ path: 'test-results/timeline.png', fullPage: true });
});

test('search and cultural themes combine and recover from empty results', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('mumbai');
  await expect(page.locator('.film-card')).toHaveCount(2);
  await page.getByRole('button', { name: '饮食与交往', exact: true }).click();
  await expect(page.locator('.film-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('不存在');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button', { name: '重置筛选', exact: true }).click();
  await expect(page.locator('.film-card')).toHaveCount(16);
});

test('direct film link survives refresh and provides source links', async ({
  page,
}) => {
  await page.goto('/#/map?place=hong-kong&film=in-the-mood-for-love');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.reload();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: '花样年华', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Criterion：1962/ })
  ).toHaveAttribute(
    'href',
    'https://www.criterion.com/films/198-in-the-mood-for-love'
  );
});

test('mobile fits the viewport and completes the same journey', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.destination-marker')).toHaveCount(8);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/mobile-screen.png' });
  await page
    .locator('.destination-strip')
    .getByRole('button', { name: '香港 2 部' })
    .click();
  await page.getByRole('button', { name: '阅读《花样年华》文化导读' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(
    await page
      .getByRole('dialog')
      .evaluate((element) => element.scrollWidth <= element.clientWidth)
  ).toBe(true);
  await page.getByRole('button', { name: '关闭影片详情' }).click();
  await page.getByRole('button', { name: '时间漫游', exact: true }).click();
  await expect(page.locator('.film-card')).toHaveCount(2);
});

test('map loading failure still allows destination and film exploration', async ({
  page,
}) => {
  await page.route('**/land.geojson', (route) => route.abort());
  await page.goto('/');
  await expect(
    page.getByText('地图轮廓暂时无法加载', { exact: false })
  ).toBeVisible();
  await page
    .getByRole('button', { name: '探索东京的电影', exact: true })
    .click();
  await expect(page.locator('.film-card')).toHaveCount(2);
  await page.unroute('**/land.geojson');
  await page.getByRole('button', { name: '重试底图' }).click();
  await expect(page.locator('.map-error')).toHaveCount(0);
});

test('200 percent text keeps primary controls within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 780, height: 1000 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await expect(page.getByRole('searchbox')).toBeVisible();
  await page.getByRole('button', { name: '时间漫游', exact: true }).click();
  await expect(page.getByLabel('时间线目的地')).toBeVisible();
});
