const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const responses = require('./terms/responses.json');
class Message {
  constructor() {
    this.nlp = compromise;
    this.response_type = 'in_channel';
  }

  extend() {
    this.nlp.extend(compromiseSentences);
  }

  /**
   * Returns a random default response based on type and angry.
   * @param {Mood} mood
   * @param {String} type
   * @param {Thought} thought
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  respondDefault(mood, type, thought) {
    const options = responses?.[type];

    let replies = options?.filter(item => item.angry === mood.angry);

    if (thought?.context?.is_question) {
      const context_replies = replies?.filter(item => item.context === 'question');

      if (context_replies.length) {
        replies = context_replies;
      }
    }

    const max = replies.length;
    const random = Math.floor(Math.random() * max);
    const reply = replies[random];

    return { mood, text: reply.text, emoji: reply.emoji };
  }

  /**
   * Formats the returned reply.
   * @param {Mood} mood
   * @param {String} text
   * @returns {String}
   */
  formatReply(mood, text) {
    const doc = this.nlp(text);

    let formatted = text;

    if (mood.drunk <= 3) {
      formatted = doc.firstTerms().toTitleCase().all().text();
    }

    return formatted;
  }

  /**
   * Formats outgoing message to be compatible with Slack.
   * @param {{mood: Mood, text: String, emoji: String}} message
   * @returns {String}
   */
  reply(message) {
    const text = `${this.formatReply(message?.mood, message?.text)} ${message?.emoji}`;

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
   * @param {{mood: Mood, text: String, emoji: String}} message
   * @param {{mood: Mood, memory: *}} snapshot
   * @returns {String}
   */
   replyDebug(message, snapshot) {
    const text = `${this.formatReply(message?.mood, message?.text)} ${message?.emoji}`;

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