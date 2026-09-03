const CACHE = 'na-step-guide-prototype-1';
const FILES = [
  './index.html','./manifest.webmanifest',
  './NA_Step_1_WORKING_COPY.html','./NA_Step_2_WORKING_COPY.html','./NA_Step_3_WORKING_COPY.html',
  './NA_Step_4_WORKING_COPY.html','./NA_Step_5_WORKING_COPY.html','./NA_Step_6_WORKING_COPY.html',
  './NA_Step_7_WORKING_COPY.html','./NA_Step_8_WORKING_COPY.html','./NA_Step_9_WORKING_COPY.html',
  './NA_Step_10_WORKING_COPY.html','./NA_Step_11_WORKING_COPY.html','./NA_Step_12_WORKING_COPY.html'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
