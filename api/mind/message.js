class Message {
  constructor() {
    this.response_type = 'in_channel';
  }

  /**
   * Formats outgoing message to be compatible with Slack.
   * @param {String} message
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
            text: `${message}`
          }
        }
      ]
    }

    return JSON.stringify(reply);
  }
}

module.exports = new Message();