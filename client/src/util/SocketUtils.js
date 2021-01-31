import io from 'socket.io-client';

let socket;

export const initSocket = () => {
    socket = io(process.env.REACT_APP_SERVER_BASE_URL,{
        extraHeaders: {
            'Access-Control-Allow-Credentials': 'omit'
        }});
    console.log("connecting socket");
};

export const disconnectSocket = (userId) => {
    console.log("disconnecting socket");
    if (socket) {
        socket.emit('disconnect',userId);
        socket.disconnect();
    }
};

export const sendNotification = (userId) => {
    if (socket) socket.emit('notification', userId);
};

export const subscribeToNotification = (cb) => {
    if (!socket) {
        return (true);
    }
    socket.on('notification', result => {
        console.log("notification received");
        cb(result);
    })
};

