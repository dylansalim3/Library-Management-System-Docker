function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.");

    const { image, tag, url, title, text } = event.data?.json();

    let options = {
        data: 'localhost:3000',
        body: 'New Message from E-Library',
        icon: 'https://sites.google.com/site/thisisjustatest2294/_/rsrc/1468742544208/project-resources/image-search/google-image-search/Screen%20Shot%202015-11-28%20at%201.14.27%20PM.png',
        vibrate: [200, 100, 200],
        tag: 'a',
        image: 'https://sites.google.com/site/thisisjustatest2294/_/rsrc/1468742544208/project-resources/image-search/google-image-search/Screen%20Shot%202015-11-28%20at%201.14.27%20PM.png',
        badge: "https://spyna.it/icons/favicon.ico",
        actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };

    if(event.data){
        options = {
            data: url,
            body: text,
            icon: image,
            vibrate: [200, 100, 200],
            tag: tag,
            image: image,
            badge: image,
            actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
        };
    }

    event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
    console.log("[Service Worker] Notification click Received.", event.notification.data);

    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
