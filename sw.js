// เก็บหน้าเปิดแอปไว้ในเครื่อง ให้เปิดได้ทันทีแม้เน็ตช้า (ข้อมูล DSR ยังโหลดจากระบบทุกครั้ง)
const CACHE = 'inca-office-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', '../config.js', '../icons/office-180.png', '../icons/office-192.png', '../icons/office-512.png', '../icons/office-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(x => x.startsWith('inca-office-') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // ลองโหลดใหม่จากเน็ตก่อน (ได้ไฟล์ล่าสุดเสมอ) ถ้าไม่มีเน็ตใช้ไฟล์ในเครื่อง
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
