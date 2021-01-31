const users = {};

let io;

exports.startSocketServer = (server) => {
    io = require('socket.io')(server);

    io.on("connection", function (socket) {
        console.log("Socket established with id: " + socket.id);

        socket.on('notification', userId => {
            users[userId] = socket.id;
            console.log("user subscribe to the notification");
            console.log(users);
        });

        socket.on('disconnect', userId => {
            users[userId] = null;
            console.log("Socket disconnected: " + socket.id);
            console.log(users);
        });
    });
}



exports.emitSocketNotification = ({ userId, title, desc, url, enablePush, priority, thumbnailUrl, created }, cb, err) => {
    console.log(users);
    console.log(users[userId]);
    if (users[userId] != null) {
        io.sockets.to(users[userId]).emit('notification', { title, desc, url, enablePush, priority, thumbnailUrl, created });
        if (cb) {
            cb();
        }
    } else {
        console.log('User not there');
        cb();
    }
};

exports.broadcastSocketNotification = ({ title, desc, enablePush, priority, thumbnailUrl }, cb) => {
    io.sockets.broadcast.emit('notification', {})
}
