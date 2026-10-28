// เก็บหน้าเปิดแอปไว้ในเครื่อง ให้เปิดได้ทันทีแม้เน็ตช้า (ข้อมูล DSR ยังโหลดจากระบบทุกครั้ง)
const CACHE = 'inca-app-v3';
const SHELL = ['./', './index.html', './sales.html', './office.html', './manifest-sales.webmanifest', './manifest-office.webmanifest', './config.js',
  './sales-180.png', './sales-192.png', './sales-512.png', './sales-32.png', './office-180.png', './office-192.png', './office-512.png', './office-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(x => x.startsWith('inca-') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
