const CACHE = 'na-step-guide-prototype-4';
const FILES = [
  './index.html','./manifest.webmanifest','./share-fix-v2.js',
  './NA_Step_1_WORKING_COPY.html','./NA_Step_2_WORKING_COPY.html','./NA_Step_3_WORKING_COPY.html',
  './NA_Step_4_WORKING_COPY.html','./NA_Step_5_WORKING_COPY.html','./NA_Step_6_WORKING_COPY.html',
  './NA_Step_7_WORKING_COPY.html','./NA_Step_8_WORKING_COPY.html','./NA_Step_9_WORKING_COPY.html',
  './NA_Step_10_WORKING_COPY.html','./NA_Step_11_WORKING_COPY.html','./NA_Step_12_WORKING_COPY.html'
];

async function fixedHtmlResponse(response){
  if(!response || !response.ok) return response;
  try{
    let html=await response.text();
    if(!html.includes('share-fix-v2.js')){
      html=html.replace(/<\/body>/i,'<script src="./share-fix-v2.js?v=2"></script>\n</body>');
    }
    return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
  }catch(e){ return response; }
}

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(async c => {
    for (const file of FILES) {
      try {
        const res=await fetch(file,{cache:'no-store'});
        if(res.ok){
          const url=new URL(file,self.location.href);
          if(file.endsWith('.html') || file.endsWith('/index.html')) c.put(url, await fixedHtmlResponse(res.clone()));
          else c.put(url,res.clone());
        }
      } catch(_) {}
    }
  }).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  const isHtml=req.mode==='navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if(isHtml){
    e.respondWith(fetch(req,{cache:'no-store'}).then(async res => {
      const fixed=await fixedHtmlResponse(res.clone());
      caches.open(CACHE).then(c=>c.put(req,fixed.clone())).catch(()=>{});
      return fixed;
    }).catch(()=>caches.match(req)));
  } else {
    e.respondWith(caches.match(req).then(r=>r || fetch(req)));
  }
});
