const NotificationRepository = require('./../repository/NotificationRepository');

exports.sendNotification = (req, res) => {
    const { userId, title, desc, url, enablePush, priority, thumbnailUrl } = req.body;
    NotificationRepository.createNotification({ userId, title, desc, url, enablePush, priority, thumbnailUrl }).then(result => {
        res.json({ success: true });
    }).catch(err => {
        res.status(500).json({ err: err });
    })
}

exports.getNotifications = (req, res) => {
    const { userId } = req.body;
    NotificationRepository.getAllNotificationById(userId).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.getAllNotifications = (req, res) => {
    NotificationRepository.getAllNotifications().then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    });
}

exports.getUnreadNotificationCount = (req, res) => {
    const { userId } = req.body;
    NotificationRepository.getUnreadNotificationCount(userId).then(result => {
        res.json({ count: result });
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.updateNotificationToRead = (req, res) => {
    const { id } = req.body;
    NotificationRepository.updateNotificationToRead(id).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.updateAllNotificationsToRead = (req, res) => {
    const { userId } = req.body;
    NotificationRepository.updateAllNotificationsToRead(userId).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.deleteNotification = (req, res) => {
    const { id } = req.body;
    NotificationRepository.deleteNotification(id).then(result => {
        res.json({ success: true });
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}