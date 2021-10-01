const responses = require('./responses.json');
class Message {
  constructor() {
    this.response_type = 'in_channel';
  }

  /**
   * Returns a random default response based on type and angry.
   * @param {Number} angry
   * @returns {{angry:Number, text:String, emoji: String}}
   */
  respondDefault(angry, type) {
    console.log(angry, type);
    const replies = responses?.[type];
    const reply = replies?.filter(item => item.angry === angry);
    const max = reply.length;
    const random = Math.floor(Math.random() * max);

    return reply[random];
  }

  /**
   * Formats outgoing message to be compatible with Slack.
   * @param {{text:String, emoji:String}} message
   * @returns {String}
   */
  reply(message) {
    const reply = {
      response_type: this.response_type,
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: `${message.text} ${message.emoji}`
          }
        }
      ]
    }

    return JSON.stringify(reply);
  }

  /**
   * Formats outgoing message to be compatible with debugging.
   * @param {{text:String, emoji:String}} message
   * @returns {String}
   */
   replyDebug(message) {
    const reply = {
      response_type: this.response_type,
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: `${message.text} ${message.emoji}`
          }
        }
      ],
      debug: message
    }

    return JSON.stringify(reply);
  }
}

module.exports = new Message();