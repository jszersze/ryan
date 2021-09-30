const compromise = require('compromise');
const db = require('../database');
const message = require('./message');
class Process {
  constructor() {
    /** @type {Number} */
    this.mood = 1;
  }

  makeAngry() {
    ++this.mood;

    if (this.mood > 5) {
      this.mood = 5;
    }
  }

  makeHappy() {
    --this.mood;

    if (this.mood < 1) {
      this.mood = 1;
    }
  }

  /**
   * Accepts and processes incoming message.
   * @param {String} text
   * @returns {String}
   */
  message(text) {
    if (!text) {
      this.makeAngry();

      return message.respondConfused(this.mood);
    }

    return 'Not now. Making soup... :ryan-eats-soup:';
  }
}

module.exports = new Process();