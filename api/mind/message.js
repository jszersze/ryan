class Messages {
  constructor() {

  }

  reply(message) {
    const reply = {
      response_type: 'in_channel',
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