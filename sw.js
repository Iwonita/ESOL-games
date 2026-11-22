/* ESOL games – works offline. Network first (always the newest version online), saved copy when offline. */
const CACHE='esol-games-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})));return}
 const key=u.origin+u.pathname;   // one saved copy per game, whatever the ?c= or ?level=
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(key,cp))}return res}).catch(()=>caches.match(key).then(m=>m||caches.match('index.html'))))});
