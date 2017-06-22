import React, { Component } from 'react';
import CommentList from '../componentsLists/comment-list.jsx';
import CommentForm from '../componentsLists/comment-form.jsx';
import PeopleList from '../componentsLists/people-list.jsx';

class Chat extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            comments: [],
            people: []
        };
        this.setState = this.setState.bind(this);
        var sockjs_url = '/chat';
        this.sockjs = new SockJS(sockjs_url);
        this.sockjs.onopen = this._initialize.bind(this);
        this.sockjs.onmessage = this._onMessage.bind(this);
        this.sockjs.onclose = this._onClose.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    };

    _initialize() {
        console.log("connected");
        this._sendMessage({ text: 'Połączony. Wpisz /help by wyświetlić listę dostępnych komend.', type: 'private', id: 'connected' });
    }

    _onMessage(e) {
        this._sendMessage(JSON.parse(e.data));
    }

    _onClose() {
        this._sendMessage({ text: 'Zamykanie połączenia.', type: 'private', id: 'disconnected' });
    }

    _sendMessage(message) {
        if (message.type == 'history_list') {
            message.data.forEach((message) => {
                this.state.comments.push(message);
                this.setState(this.state);
            });
        } else if (message.type == 'user_list') {
            Object.keys(message.data).map((key) => { return message.data[key] }).forEach((message) => {
                this.state.people.push(message);
                this.setState(this.state);
            });
        } else {
            this.state.comments.push(message);
            this.setState(this.state)

            if (message.type == 'joined_channel') {
                this.state.people.push(message.data);
                this.setState(this.state);
            } else if (message.type == 'left_channel') {
                this.state.people.splice(
                    this.state.people.findIndex(
                        (i) => i.username === message.username
                    ), 1
                );
                this.setState(this.state);
            } else if (message.type == 'username_changed') {
                console.log(message)
                this.state.people.forEach((user) => {
                    if (user.connection_id == message.data.connection_id) {
                        user.username = message.data.username;
                    }
                });
                this.setState(this.state);
            }
        }
    }

    handleMessageSubmit(message) {
        this.sockjs.send(JSON.stringify({ type: "text_message", text: message }));
    }

    render() {
        return (
            <div id="first" className="box">
                <div className="commentsContainer">
                    <CommentList comments={this.state.comments} />
                    <CommentForm onMessageSubmit={this.handleMessageSubmit} />
                </div>
                <PeopleList people={this.state.people} />
            </div>
        )
    };
}

export default Chat;
