const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const message = require('./message');
const query = require('./query');
const greeting = require('./greeting');
class Process {
  constructor() {
    this.nlp = compromise;
    this.message = message;
    this.query = query;
    this.greeting = greeting;
    this.debug = {};

    this.mood = {
      /** @type {Number} number 1 - 5 */
      angry: 1,

      /** @type {Number} number 1 - 5 */
      dramatic: 1,

      /** @type {Number} number 1 - 5 */
      drunk: 1
    }

    this.thought = {};
    this.memory = {};

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

    if (this.checkReset(text)) {
      return this.handleResetRyan();
    }

    if (this.checkGreeting(text)) {
      return this.handleGreeting(text);
    }

    this.thought.input_text = text;
    this.thought.nouns = [];
    this.thought.questions = [];

    for (const item of nouns) {
      this.query.queryAnswer(item);
      this.thought.nouns.push(item);
    }

    for (const item of questions) {
      this.thought.questions.push(item);
    }

    if (questions?.length) {
      return this.handleQuestion();
    }

    return this.handleNotUnderstand();
  }

  /**
   * Checks to see if input text is reset.
   * @param {String} text
   * @returns {Boolean}
   */
  checkReset(text) {
    if (text.trim().toLowerCase() === 'reset ryan-bot') {
      return true;
    }
  }

  /**
   * Checks to see if input text is greeting.
   * @param {String} text
   * @returns {Boolean}
   */
  checkGreeting(text) {
    return this.greeting.checkIfGreeting(text);
  }

  /**
   * Handles not understanding.
   * @returns {{mood:Number, text:String, emoji:String}}
   */
  async handleNotUnderstand() {
    this.makeMore('angry');

    return this.query.queryResponse(this.mood, 'no-understand');
  }

  /**
   * Handles greeting response.
   * @param {String} text
   * @returns {{mood:Number, text:String, emoji:String}}
   */
  async handleGreeting(text) {
    this.makeLess('angry');

    const greeting = this.greeting.replyWithGreeting(text);

    return { mood: this.mood, text: greeting.text, emoji: greeting.emoji };
  }

  async handleQuestion() {
    return this.query.queryResponse(this.mood, 'refuse');
  }

  async handleDefinition() {

  }

  /**
   * Resets Ryan Bot mood.
   * @returns {{mood:Number, text:String, emoji:String}}
   */
  async handleResetRyan() {
    const reply = this.message.respondDefault(this.mood.angry, 'reset');

    this.mood = {
      angry: 1,
      dramatic: 1,
      drunk: 1
    }

    return reply;
  }

  /**
   * Remembers last interaction and stores it by thought/user_name.
   * @param {String} user_name
   */
  remember(user_name) {
    if (this.memory[user_name]) {
      this.memory[user_name] = [];
    }

    this.memory.push(this.thought);
    this.thought = {};

    if (this.memory[user_name].length === 5) {
      this.memory[user_name].pop();
    }
  }
}

module.exports = new Process();