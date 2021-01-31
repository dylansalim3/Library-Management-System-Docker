const subscriptions = {};
var crypto = require("crypto");
const webpush = require("web-push");

const vapidKeys = {
    privateKey: process.env.PRIVATE_VAPID_KEY,
    publicKey: process.env.PUBLIC_VAPID_KEY
};

webpush.setVapidDetails('mailto:elibraryapp10@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
    const md5sum = crypto.createHash("md5");
    md5sum.update(Buffer.from(input));
    return md5sum.digest("hex");
}

exports.handlePushNotificationSubscription = (req, res) => {
    const subscriptionRequest = req.body;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions[susbscriptionId] = subscriptionRequest;
    res.status(201).json({ id: susbscriptionId });
}

exports.sendPushNotification = (req, res) => {
    const subscriptionId = req.params.id;
    const pushSubscription = subscriptions[subscriptionId];
    webpush
        .sendNotification(
            pushSubscription,
            JSON.stringify({
                title: "New Product Available ",
                text: "HEY! Take a look at this brand new t-shirt!",
                image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
                tag: "new-product",
                url: "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html"
            })
        )
        .catch(err => {
            console.log(err);
        });

    res.status(202).json({});
}
