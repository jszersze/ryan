const greetings = require('./greetings.json');

class Greeting {
  constructor() {
    this.greetings = greetings;
  }

  /**
   * Checks to see is the text is a greeting.
   * @param {String} text
   * @returns {Boolean}
   */
  checkIfGreeting(text) {
    const sample = text.trim().toLowerCase().replace('.', '');

    return this.greetings.indexOf(sample) !== -1;
  }

  /**
   *
   * @param {String} text
   * @returns {{text:String, emoji:String}}
   */
  replyWithGreeting(text) {
    const sample = text.trim().toLowerCase().replace('.', '');

    if (sample === 'good morning') {
      return { text: 'Good morning.', emoji: '' };
    }

    return { text: 'Howdy.', emoji: '' };
  }
}

module.exports = new Greeting();