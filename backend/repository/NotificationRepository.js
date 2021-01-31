const Notification = require('./../models/Notification');
const { emitSocketNotification } = require('./../utils/socket.util');

exports.createNotification = ({ userId, title, desc, url, enablePush, priority, thumbnailUrl }) => {
    return Notification.create({ title, desc, url, thumbnail_url: thumbnailUrl, priority, enable_push: enablePush, user_id: userId }).then(notification => {
        const { created } = notification;
        return emitSocketNotification({ userId, title, desc, url, enablePush, priority, thumbnailUrl, created }, () => {
            console.log("success");
            return notification;
        });
    });
}

exports.getAllNotificationById = (userId) => {
    return Notification.findAll({ where: { user_id: userId }, order: [['created', 'DESC']] });
}

exports.getAllNotifications = () => {
    return Notification.findAll({ order: [['created', 'DESC']] });
}

exports.getUnreadNotificationCount = (userId) => {
    return Notification.count({ where: { user_id: userId, unread: true } });
}

exports.updateNotificationToRead = (id) => {
    return Notification.findOne({ where: { id } }).then(notification => {
        notification.unread = false;
        notification.save();
        return notification;
    });
}

exports.updateAllNotificationsToRead = (userId) => {
    return Notification.findAll({ where: { user_id:userId } }).then(notifications => {
        notifications.forEach(notification=>{
            notification.unread = false;
            notification.save();
        });
        return notifications;
    });
}

exports.deleteNotification = (id) => {
    return Notification.destroy({ where: { id } });
}
