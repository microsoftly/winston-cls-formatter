import TransportStream = require('winston-transport');

export class TestTransport extends TransportStream {
  private readonly messages: any[];
  
  constructor() {
    super();
    this.messages = [];
  }

  log?(info: any, next: () => void) {
    this.messages.push(info);
    next();
  };

  *dequeueMessage() {
    while(true) {
      yield this.messages.shift()
    }
  }
}
