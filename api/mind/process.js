const compromise = require('compromise');
const message = require('./message');
const query = require('./query');
class Process {
  constructor() {
    this.nlp = compromise;
    this.message = message;
    this.query = query;
    this.debug = {};

    this.mood = {
      /** @type {Number} number 1 - 5 */
      angry: 1,

      /** @type {Number} number 1 - 5 */
      dramatic: 1,

      /** @type {Number} number 1 - 5 */
      drunk: 1
    }

    this.subject = {};
  }

  /**
   * Makes Ryan progressively more angry, dramatic or drunk.
   * @param {('angry' | 'dramatic' | 'drunk')} state
   */
  makeMore(state) {
    ++this.mood[state];

    if (this.mood[state] > 5) {
      this.mood[state] = 5;
    }
  }

  /**
   * Makes Ryan progressively less angry, dramatic or drunk.
   * @param {('angry' | 'dramatic' | 'drunk')} state
   */
  makeLess(state) {
    --this.mood[state];

    if (this.mood[state] < 1) {
      this.mood[state] = 1;
    }
  }

  /**
   * Accepts and processes incoming message.
   * @param {String} query
   * @returns {{mood:Number, text:String, emoji:String}}
   */
  async accept(query) {
    if (!query?.text) {
      this.makeMore('angry');

      return this.query.queryResponse(this.mood, 'confused');
    }

    this.segment(query.text);

    return { text: 'Not now. Making soup...', emoji: ':ryan-eats-soup:', ...this.debug };
  }

  /**
   * Segments text into text chunks.
   * @param {String} text
   */
  segment(text) {
    const doc = this.nlp(text);
    const nouns = doc.nouns().toSingular().out('array');

    this.debug.input_text = text;
    this.debug.nouns = [];

    for (const item of nouns) {
      this.query.queryAnswer(item);
      this.debug.nouns.push(item);
    }
  }
}

module.exports = new Process();