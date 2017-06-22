import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Comment from '../components/comment.jsx';

class CommentList extends Component {
    // how to keep comment list scroll offset at the bottom,
    // if user is already at the bottom
    componentDidMount() {
        const node = ReactDom.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }

    componentWillUpdate() {
        const node = ReactDom.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }
    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            const node = ReactDom.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }
    render() {
        const commentNodes = this.props.comments.map((comment) => {
            return (
                <Comment author={comment.username} type={comment.type} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
};

export default CommentList;
