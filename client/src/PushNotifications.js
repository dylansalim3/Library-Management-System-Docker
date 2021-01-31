


const pushServerPublicKey = "BPFWO4XB2mtXiCWq1PMl62PlPhQ3TfzBJNE9yKwoy_BmKkcr0_6eAbjwoTlsPTpODsIiAK570R_khzo9Cf7GW8Q";

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
    return await Notification.requestPermission();
}
/**
 * shows a notification
 */
function sendNotification() {
    const img = "/images/mainlogo.png";
    const text = "Test Message from E-library!";
    const title = "You have new notification from E-Library";
    const options = {
        body: text,
        icon: "/images/mainlogo.png",
        vibrate: [200, 100, 200],
        tag: "new-product",
        image: img,
        badge: "https://spyna.it/icons/android-icon-192x192.png",
        actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    navigator.serviceWorker.ready.then(function(serviceWorker) {
        serviceWorker.showNotification(title, options);
    });
}

/**
 *
 */
function registerServiceWorker() {
    return navigator.serviceWorker.register("/sw.js");
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */

async function createNotificationSubscription() {
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    return serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey)
    }).then(function(pushSubscription) {
        return pushSubscription;
    });
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
    //wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
        .then(function(serviceWorker) {
            return serviceWorker.pushManager.getSubscription();
        })
        .then(function(pushSubscription) {
            return pushSubscription;
        });
}

export {
    isPushNotificationSupported,
    askUserPermission,
    registerServiceWorker,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription
};
