import React, {Component} from 'react';

class CommentForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            message: ''
        };
        this.setState = this.setState.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    onMessageChange(e) {
        this.setState({message: e.target.value})
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log(this);
        this.props.onMessageSubmit(this.state.message);
        this.setState({message: ''})
    }
    render() {
        return (
          <form onSubmit={this.handleSubmit}>
              <input
                  autoComplete="off"
                  onChange={this.onMessageChange}
                  value={this.state.message}></input>
          </form>
        );
    }
};

export default CommentForm;
