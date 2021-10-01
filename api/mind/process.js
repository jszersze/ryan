const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
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

    this.extend();
  }

  extend() {
    this.nlp.extend(compromiseSentences);
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
    /**
     * There is no text, so automatic interrupt to reply confused.
     */
    if (!query?.text) {
      this.makeMore('angry');

      return this.query.queryResponse(this.mood, 'confused');
    }

    return this.segment(query.text);
  }

  /**
   * Segments text into text chunks.
   * @param {String} text
   */
  async segment(text) {
    const doc = this.nlp(text);
    const nouns = doc.nouns().toSingular().out('array');
    const questions = doc.sentences().isQuestion().out('array');

    this.debug.input_text = text;
    this.debug.nouns = [];
    this.debug.questions = [];

    for (const item of nouns) {
      this.query.queryAnswer(item);
      this.debug.nouns.push(item);
    }

    for (const item of questions) {
      this.debug.questions.push(item);
    }

    if (questions?.length) {
      return this.handleQuestion();
    }

    return this.handleNotUnderstand();
  }

  async handleNotUnderstand()  {
    return this.query.queryResponse(this.mood, 'no-understand');
  }

  async handleQuestion() {
    return this.query.queryResponse(this.mood, 'refuse');
  }

  async handleDefinition() {

  }
}

module.exports = new Process();