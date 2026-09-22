#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGE_PATH = path.join(ROOT, 'worldwide.html');
const POOL_PATH = path.join(ROOT, 'data', 'worldwide-pool.json');
const STATE_PATH = path.join(ROOT, 'data', 'worldwide-state.json');

const FEED_START = '<!-- AUTO_WORLDWIDE_FEED -->';
const FEED_END = '<!-- END_AUTO_WORLDWIDE_FEED -->';
const ENTRIES_PER_DAY = 2;

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to read ${filePath}: ${error.message}`);
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getYouTubeVideoId(url) {
  if (!url) {
    return '';
  }

  const match = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : '';
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch (error) {
    return 'web';
  }
}

function getThumbnailUrl(item) {
  if (item.thumbnail) {
    return item.thumbnail;
  }

  const videoId = getYouTubeVideoId(item.url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  if (item.platform === 'tiktok') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
  }

  if (item.platform === 'facebook') {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
  }

  if (item.platform === 'reddit') {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e939e113?auto=format&fit=crop&w=1200&q=80';
  }

  if (item.platform === 'blog') {
    return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80';
  }

  return 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80';
}

function buildPlatformLabel(platform) {
  const labels = {
    youtube: 'YOUTUBE',
    blog: 'BLOG',
    tiktok: 'TIKTOK',
    facebook: 'FACEBOOK',
    reddit: 'REDDIT',
  };
  return labels[platform] || 'WEB';
}

function buildPlatformTitle(platform) {
  const labels = {
    youtube: 'YouTube',
    blog: 'Blog',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    reddit: 'Reddit',
  };
  return labels[platform] || 'Web';
}

function buildMediaMarkup(item) {
  const videoId = getYouTubeVideoId(item.url);
  const safeHost = (item.host || hostFromUrl(item.url) || 'web').toString().toUpperCase();
  const thumbnailUrl = getThumbnailUrl(item);

  if (videoId) {
    return `
      <div class="video-window">
        <iframe src="https://www.youtube.com/embed/${videoId}?rel=0" title="${escapeHtml(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    `;
  }

  if (thumbnailUrl) {
    return `
      <img class="entry-thumb" src="${escapeHtml(thumbnailUrl)}" alt="${escapeHtml(item.title)}" />
    `;
  }

  return `
    <div class="video-window">
      <div class="video-poster">
        [ ${escapeHtml(safeHost)} · ${escapeHtml(item.title)} ]
      </div>
    </div>
  `;
}

function buildEntryMarkup(item, dateStamp) {
  const platformTitle = buildPlatformTitle(item.platform);
  const mediaMarkup = buildMediaMarkup(item);

  return `
    <article class="entry">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta">${dateStamp} <span class="tag">${buildPlatformLabel(item.platform)}</span></div>
      <p>${escapeHtml(item.summary || 'Public reference from the cross-reference archive.')}</p>
      ${mediaMarkup}
      <div class="external-actions">
        <a class="external-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open in ${platformTitle}</a>
      </div>
    </article>
  `;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatLastUpdated(isoString) {
  const date = new Date(isoString);
  const pad = (value) => String(value).padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` // ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch (error) {
    return String(url || '').trim();
  }
}

function contentKey(item) {
  const videoId = getYouTubeVideoId(item.url);
  if (videoId) {
    return `yt:${videoId}`;
  }
  return `url:${normalizeUrl(item.url)}`;
}

function pickDailyEntries(pool, state) {
  const today = todayKey();
  const publishedToday = state.published.filter((entry) => entry.publishedDate === today);

  if (publishedToday.length >= ENTRIES_PER_DAY) {
    return { added: [], state };
  }

  const poolById = new Map(pool.map((item) => [item.id, item]));
  const usedIds = new Set(state.published.map((entry) => entry.id));
  const usedContent = new Set(
    state.published
      .map((entry) => poolById.get(entry.id))
      .filter(Boolean)
      .map(contentKey)
  );

  const available = pool.filter((item) => {
    if (usedIds.has(item.id)) {
      return false;
    }
    const key = contentKey(item);
    if (usedContent.has(key)) {
      return false;
    }
    return true;
  });

  if (available.length === 0) {
    console.warn('Pool exhausted — no unused entries remain. Add more to data/worldwide-pool.json.');
    return { added: [], state };
  }

  const slotsLeft = ENTRIES_PER_DAY - publishedToday.length;
  const picks = [];
  for (const candidate of shuffle(available)) {
    if (picks.length >= slotsLeft) {
      break;
    }
    const key = contentKey(candidate);
    if (usedContent.has(key) || picks.some((pick) => contentKey(pick) === key)) {
      continue;
    }
    picks.push(candidate);
    usedContent.add(key);
  }

  const nextState = {
    ...state,
    published: [
      ...state.published,
      ...picks.map((item) => ({
        id: item.id,
        publishedDate: today,
      })),
    ],
  };

  return { added: picks, state: nextState };
}

function buildFeedHtml(pool, state) {
  const poolById = new Map(pool.map((item) => [item.id, item]));
  const published = [...state.published].reverse();

  return published
    .map((publishedEntry) => {
      const item = poolById.get(publishedEntry.id);
      if (!item) {
        return '';
      }

      return buildEntryMarkup(
        {
          ...item,
          host: hostFromUrl(item.url),
        },
        publishedEntry.publishedDate
      );
    })
    .filter(Boolean)
    .join('\n');
}

function replaceFeedSection(source, feedHtml) {
  const startIndex = source.indexOf(FEED_START);
  const endIndex = source.indexOf(FEED_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('The worldwide page is missing AUTO_WORLDWIDE_FEED markers.');
  }

  const before = source.slice(0, startIndex + FEED_START.length);
  const after = source.slice(endIndex);

  const block = feedHtml ? `\n${feedHtml}\n` : '\n';
  return `${before}${block}${after}`;
}

function updateLastUpdatedStamp(source, isoString) {
  const stamp = formatLastUpdated(isoString);
  const pattern = /(<span data-last-updated>)(.*?)(<\/span>)/;

  if (!pattern.test(source)) {
    throw new Error('The worldwide page is missing the data-last-updated stamp.');
  }

  return source.replace(pattern, `$1${stamp}$3`);
}

function updateWorldwidePage(pool, state, lastUpdated) {
  let source = fs.readFileSync(PAGE_PATH, 'utf8');
  const feedHtml = buildFeedHtml(pool, state);

  source = replaceFeedSection(source, feedHtml);
  source = updateLastUpdatedStamp(source, lastUpdated);
  fs.writeFileSync(PAGE_PATH, source, 'utf8');
}

function runUpdate() {
  const pool = readJson(POOL_PATH, []);
  const state = readJson(STATE_PATH, { lastUpdated: null, published: [] });

  if (!Array.isArray(pool) || pool.length === 0) {
    throw new Error('data/worldwide-pool.json is empty. Add entries before running the updater.');
  }

  const { added, state: nextState } = pickDailyEntries(pool, state);

  if (added.length === 0) {
    console.log('Worldwide feed unchanged — already updated today or pool exhausted.');
    console.log(`Total published entries: ${nextState.published.length}`);
    return { added, state: nextState };
  }

  const lastUpdated = new Date().toISOString();
  const finalState = {
    ...nextState,
    lastUpdated,
  };

  updateWorldwidePage(pool, finalState, lastUpdated);
  writeJson(STATE_PATH, finalState);

  console.log(`Worldwide feed updated with ${added.length} new entries: ${added.map((item) => item.id).join(', ')}`);
  console.log(`Total published entries: ${finalState.published.length}`);
  return { added, state: finalState };
}

async function main() {
  runUpdate();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to update worldwide feed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  buildEntryMarkup,
  getYouTubeVideoId,
  pickDailyEntries,
  runUpdate,
  formatLastUpdated,
  ENTRIES_PER_DAY,
};
