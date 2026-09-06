const CACHE = 'na-step-guide-prototype-3';
const FILES = [
  './index.html','./manifest.webmanifest',
  './NA_Step_1_WORKING_COPY.html','./NA_Step_2_WORKING_COPY.html','./NA_Step_3_WORKING_COPY.html',
  './NA_Step_4_WORKING_COPY.html','./NA_Step_5_WORKING_COPY.html','./NA_Step_6_WORKING_COPY.html',
  './NA_Step_7_WORKING_COPY.html','./NA_Step_8_WORKING_COPY.html','./NA_Step_9_WORKING_COPY.html',
  './NA_Step_10_WORKING_COPY.html','./NA_Step_11_WORKING_COPY.html','./NA_Step_12_WORKING_COPY.html'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isHtml = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (isHtml) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req)));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
