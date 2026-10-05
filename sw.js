// RCO Service Worker - PWA 安裝與系統推送支持
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Android Chrome PWA 可安裝性認證必要的網路攔截事件
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// 接收主頁面發送的通知指令
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        const title = event.data.title;
        const options = event.data.options;
        self.registration.showNotification(title, options);
    }
});

// 點擊通知橫幅時自動打開/切換回 App
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});
