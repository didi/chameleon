/**
 * A class represents an error message.
 */
class Message {
  constructor({ line = undefined, column = undefined, token = '', msg = '' }) {
    this.line = line;
    this.column = column;
    this.token = token;
    this.msg = msg || 'An unknown error occurred'
  }
}

module.exports = Message;
