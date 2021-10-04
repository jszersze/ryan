const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const greetings = require('../terms/greetings.json');
const farewells = require('../terms/farewells.json');
const time = require('../senses/time');

class Greeting {
  constructor() {
    this.nlp = compromise;
    this.greetings = greetings;
    this.farewells = farewells;
    this.time = time;
  }

  extend() {
    this.nlp.extend(compromiseSentences);
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
   * Checks to see is the text is a farewell.
   * @param {String} text
   * @returns {Boolean}
   */
   checkIfFarewell(text) {
    const sample = text.trim().toLowerCase().replace('.', '');

    return this.farewells.indexOf(sample) !== -1;
  }

  /**
   *  Replies with a greeting.
   * @param {String} text
   * @returns {{text: String, emoji: String}}
   */
  replyWithGreeting(text) {
    const sample = text.trim().toLowerCase().replace('.', '');

    if (sample === 'good morning') {
      const noun = this.time.portionOfDay();

      return { text: `Good ${noun}.`, emoji: '' };
    }

    return { text: 'Howdy.', emoji: '' };
  }

  /**
   * Replies with a farewell.
   * @param {String} text
   * @returns {{text: String, emoji: String}}
   */
   replyWithFarewell(text) {
    const max = this.farewells.length;
    const random = Math.floor(Math.random() * max);
    const farewell = this.farewells[random];
    const doc = this.nlp(farewell);

    return { text: doc.toTitleCase().text(), emoji: '' };
  }
}

module.exports = new Greeting();