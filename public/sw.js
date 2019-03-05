console.log('script load');
let cacheStorageKey = 'pwa-demo';
let cacheList=[
  'home',
  'main.css',
  'icon.png',
  'jquery.js',
  'back.png',
  '/icon/baoyu.svg',
  '/icon/daxue.svg',
  '/icon/dayu.svg',
  '/icon/duoyun.svg',
  '/icon/leiyu.svg',
  '/icon/qing.svg',
  '/icon/xiaoxue.svg',
  '/icon/xiaoyu.svg',
  '/icon/ying.svg',
  '/icon/zhongxue.svg',
  '/icon/zhongyu.svg',
  '/icon/yujiaxue.svg',
  '/favicon.ico',
  '/location.png',
  '/api/historyWeather/province',
  '/api/historyWeather/weather'
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
    caches.open(cacheStorageKey)
      .then(cache => cache.add(e.request.url));
    return fetch(e.request.url);
  }else {
    console.log('offLine')
    e.respondWith(
      caches.match(e.request).then(function(response){
        if(response != null){
          return response
        }
        const resp = new Response(`{"error_code": 400}`);
        resp.headers.set('Content-Type', 'application/json');
        return resp;
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
          //删除过期版本
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      //更新客户端上的sw
      return self.clients.claim();
    })
  )
});