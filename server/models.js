// using named parameters and default values in ES6, function because it imitates class
export function Message({ text='', type, username, connection_id, data } = {}) {
    this.type = type;
    this.text = text;
    this.username = username;
    this.data = data;
    this.connection_id = connection_id;
    this.id = Math.random().toString(36).substring(7);
    this.created_at = new Date();
}

export function User({ username, connection_id } = {}) {
    this.username = username;
    this.connection_id = connection_id;
    this.id = Math.random().toString(36).substring(7);
}
