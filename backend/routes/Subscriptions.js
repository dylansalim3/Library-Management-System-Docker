const express = require('express');
const subscriptions = express.Router();
const SubscriptionController = require('../controller/SubscriptionController');

subscriptions.post("/init", SubscriptionController.handlePushNotificationSubscription);

subscriptions.get("/send-push-notification/:id", SubscriptionController.sendPushNotification);

module.exports = subscriptions;