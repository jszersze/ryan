const responses = require('./responses.json');
class Message {
  constructor() {
    this.response_type = 'in_channel';
  }

  /**
   * Returns a random default response based on type and angry.
   * @param {Number} angry
   * @param {String} type
   * @param {*} thought
   * @returns {{angry:Number, text:String, emoji: String}}
   */
  respondDefault(angry, type, thought) {
    const options = responses?.[type];

    let replies = options?.filter(item => item.angry === angry);

    if (thought?.is_question) {
      const context_replies = replies?.filter(item => item.context === 'question');

      if (context_replies.length) {
        replies = context_replies;
      }
    }

    const max = replies.length;
    const random = Math.floor(Math.random() * max);

    return replies[random];
  }

  /**
   * Formats outgoing message to be compatible with Slack.
   * @param {{text:String, emoji:String}} message
   * @returns {String}
   */
  reply(message) {
    const text = `${message?.text} ${message?.emoji}`;

    const reply = {
      response_type: this.response_type,
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: text.trim()
          }
        }
      ]
    }

    return JSON.stringify(reply);
  }

  /**
   * Formats outgoing message to be compatible with debugging.
   * @param {{text:String, emoji:String}} message
   * @param {{mood:*, memory:*}} snapshot
   * @returns {String}
   */
   replyDebug(message, snapshot) {
    const text = `${message?.text} ${message?.emoji}`;

    const reply = {
      response_type: this.response_type,
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: text.trim()
          }
        }
      ],
      debug: snapshot
    }

    return JSON.stringify(reply);
  }
}

module.exports = new Message();