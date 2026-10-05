// RCO Service Worker - 處理 Android 原生推送通知
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 接收主頁面發送的通知指令
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        const title = event.data.title;
        const options = event.data.options;
        
        // 觸發 Android 系統原生橫幅通知 (WhatsApp 樣式)
        self.registration.showNotification(title, options);
    }
});

// 點擊通知橫幅時自動打開/切換回網頁
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
