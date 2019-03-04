console.log('script load');
let cacheStorageKey = 'pwa-demo';
let cacheList=[
  'home',
  'main.css',
  'icon.png',
  'jquery.js',
  'back.png',
  '/api/historyWeather/province'
];
self.addEventListener('install',e =>{
  console.log('installed');
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
});

self.addEventListener('fetch',function(e){
  if(navigator.onLine) {
    console.log('onLine')
    return fetch(e.request.url)
  }else {
    console.log('offLine')
    e.respondWith(
      caches.match(e.request).then(function(response){
        if(response != null){
          return response
        }
        return fetch(e.request.url)
      })
    )
  }
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
});