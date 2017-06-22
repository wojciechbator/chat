import http from 'http';
import sockjs from 'sockjs';
import express from 'express';
import path from 'path';
import {
    Message,
    User
} from './models.js';
import constants from './constants.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8081;
const production = process.env.NODE_ENV === 'production';

let comments = [];
let connections = {};
let users = {};

// send message to specific connection/user
const whisper = (id, message) => {
    if (!connections[id]) return;
    connections[id].write(JSON.stringify(message));
}

// broadcast message to all users
const broadcast = (message) => {
    for (var i in connections) {
        connections[i].write(JSON.stringify(message));
    }
    comments.push(message);
}

// Sockjs server
const sockjs_opts = {
    sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.1.2/sockjs.min.js"
};
const sockjs_chat = sockjs.createServer(sockjs_opts);

sockjs_chat.on('connection', (conn) => {
    connections[conn.id] = conn;

    // send message notifying of existing users on the channel
    whisper(conn.id, new Message({
        data: users,
        type: constants.user_list
    }));

    // create user model and add it to list of users
    var user = new User({
        connection_id: conn.id,
        username: 'Gość' + new Date().getSeconds()
    })
    users[conn.id] = user;

    // send a brief history of messages
    whisper(conn.id, new Message({
        data: comments,
        type: constants.history_list
    }));

    // broadcast the user joining
    broadcast(new Message({
        type: constants.joined_channel,
        text: ' właśnie dołączył(a) do pokoju.',
        username: user.username,
        data: user
    }));

    conn.on('data', (message) => {
        message = JSON.parse(message);
        if (message.type == constants.text_message) {
            if (message.text.startsWith('/')) {
                // whisper the command back to the user
                whisper(conn.id, new Message({
                    type: constants.private,
                    text: message.text
                }))

                // management commands
                if (message.text == '/help') {
                    whisper(conn.id, new Message({
                        type: constants.help,
                        text: constants.help_text
                    }))
                }
                if (message.text.startsWith('/nick')) {
                    var old_username = users[conn.id].username;
                    var new_username = message.text.substring(message.text.indexOf(' ') + 1);
                    users[conn.id].username = new_username;

                    broadcast(new Message({
                        type: constants.username_changed,
                        text: old_username + ' zmienił(a) nazwę na ' + new_username,
                        data: {
                            username: new_username,
                            connection_id: conn.id
                        }
                    }))
                }
            } else {
                if (!message.text) return;
                message.text = message.text.substr(0, 128)
                if (comments.length > 15) comments.shift();

                // broadcast the received message
                broadcast(new Message({
                    type: constants.text_message,
                    text: message.text,
                    username: users[conn.id].username
                }));
            }
        }
    });

    conn.on('close', () => {
        // delete the connection and the user
        var user = users[conn.id] || {};
        delete connections[conn.id];
        delete users[conn.id];
        broadcast(new Message({
            text: ' właśnie opuścił(a) pokój.',
            username: user.username,
            type: constants.left_channel
        }));
    });
});

if (production) {
    app.use(express.static(path.resolve(__dirname, '../build')));
}
sockjs_chat.installHandlers(server, {
    prefix: '/chat'
});
server.listen(port, '127.0.0.1', function () {
    console.log("Słucham na porcie " + port);
})