const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const message = require('./message');
const query = require('./query');
const greeting = require('./handlers/greeting');
const question = require('./handlers/question');
const action = require('./handlers/action');

class Process {
  constructor() {
    this.nlp = compromise;
    this.message = message;
    this.query = query;
    this.greeting = greeting;
    this.question = question;
    this.action = action;
    this.debug = {};

    /** @type {Mood} */
    this.mood = {
      angry: 1,
      dramatic: 1,
      drunk: 1
    }

    /** @type {Thought} */
    this.thought = {};
    this.memory = {};

    /** @type {Number} */
    this.memory_limit = 5;

    this.extend();
  }

  extend() {
    this.nlp.extend(compromiseSentences);
    this.nlp.extend(compromisePennTags);
  }

  /**
   * Makes Ryan progressively more angry, dramatic or drunk.
   * @param {MoodState} state
   */
  makeMore(state) {
    ++this.mood[state];

    if (this.mood[state] > 5) {
      this.mood[state] = 5;
    }
  }

  /**
   * Makes Ryan progressively less angry, dramatic or drunk.
   * @param {MoodState} state
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
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async accept(query) {
    /**
     * There is no text, so automatic interrupt to reply confused.
     */
    if (!query?.text) {
      this.makeMore('angry');

      return this.query.queryResponse(this.mood, 'confused');
    }

    /**
     * Extract some basic input information.
     */
    this.thought.interlocutor = query?.user_name;
    this.thought.input_text = query.text;
    this.thought.context = {};

    const reply = await this.segment(query.text);

    this.thought.reply = reply;
    this.remember();

    return reply;
  }

  /**
   * Segments text into text chunks.
   * @param {String} text
   */
  async segment(text) {
    if (this.checkReset(text)) {
      return this.handleResetRyan();
    }

    this.tokenize(text);

    if (this.checkContext(text)) {
      return this.handleContext(text);
    }

    if (this.checkGreeting(text)) {
      return this.handleGreeting(text);
    }

    if (this.checkFarewell(text)) {
      return this.handleFarewell(text);
    }

    if (this.checkQuestion(text)) {
      return this.handleQuestion(text);
    }

    if (this.checkAction(text)) {
      return this.handleAction(text);
    }

    if (this.checkDefinition(text)) {
      return this.handleDefinition(text);
    }

    return this.handleNotUnderstand();
  }

  /**
   * Pre-processes the input.
   * @param {String} text
   */
  tokenize(text) {
    const doc = this.nlp(text);
    const subject = doc.sentences().subjects().text();
    const tags = doc.pennTags({ offset: true });

    this.thought.subject = subject;
    this.thought.tags = tags;
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
   * Checks to see previous context of input.
   * @param {String} text
   * @returns {Boolean}
   */
  checkContext(text) {
    const interlocutor = this.thought.interlocutor;

    if (this.memory?.[interlocutor]) {
      /**
       * Check for repetition.
       */
      for (const thought of this.memory[interlocutor]) {
        if (thought.input_text === text) {
          this.thought.deja_vu = this.thought.deja_vu ? ++this.thought.deja_vu : 1;
        }
      }

      if (this.thought.deja_vu >= 1) {
        return true;
      }
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
   * Checks to see if input text is farewell.
   * @param {String} text
   * @returns {Boolean}
   */
   checkFarewell(text) {
    return this.greeting.checkIfFarewell(text);
  }

  /**
   * Checks to see if the input is a question.
   * @param {String} text
   * @returns {Boolean}
   */
  checkQuestion(text) {
    const doc = this.nlp(text);
    const questions = doc.sentences().isQuestion().out('array');

    this.thought.questions = [];

    for (const item of questions) {
      this.thought.questions.push(item);
    }

    if (questions?.length) {
      return true;
    }
  }

  /**
   * Checks to see if the input is an action request.
   * @param {String} text
   * @returns {Boolean}
   */
  checkAction(text) {
    const doc = this.nlp(text);
    const verbs = doc.verbs().out('array');

    this.thought.verbs = [];

    for (const item of verbs) {
      this.thought.verbs.push(item);
    }

    if (verbs?.length) {
      return true;
    }
  }

  /**
   * Checks to see if the input is a definition.
   * @param {String} text
   * @returns {Boolean}
   */
  checkDefinition(text) {
    const doc = this.nlp(text);
    const nouns = doc.nouns().toSingular().out('array');

    this.thought.nouns = [];

    for (const item of nouns) {
      this.query.queryAnswer(item);
      this.thought.nouns.push(item);
    }
  }

  /**
   * Handles not understanding.
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleNotUnderstand() {
    this.makeMore('angry');

    return this.query.queryResponse(this.mood, 'no-understand');
  }

  /**
   * Handles instances when context prevails.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleContext(text) {
    this.makeMore('angry');

    if (this.checkQuestion(text)) {
      this.thought.context.is_question = true;
    }

    return this.query.queryResponse(this.mood, 'deja-vu', this.thought);
  }

  /**
   * Handles greeting response.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleGreeting(text) {
    this.makeLess('angry');

    const greeting = this.greeting.replyWithGreeting(text);

    return { mood: this.mood, text: greeting.text, emoji: greeting.emoji };
  }

  /**
   * Handles farewell response.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
   async handleFarewell(text) {
    this.makeLess('angry');

    const greeting = this.greeting.replyWithFarewell(text);

    return { mood: this.mood, text: greeting.text, emoji: greeting.emoji };
  }

  /**
   * Handles processing and replying to a question.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleQuestion(text) {
    const question = this.question.process(this.mood, text, this.thought);
    const answer = await this.query.queryAnswer(this.mood, text, this.thought);

    if (!answer) {
      return this.query.queryResponse(this.mood, 'dont-know');
    }

    return this.query.queryResponse(this.mood, 'refuse');
  }

  /**
   * Handles processing and replying to an action request.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleAction(text) {
    const action = this.action.process(this.mood, text, this.thought);
    const task = await this.query.performAction(this.mood, text, this.thought);

    if (!action) {
      return this.query.queryResponse(this.mood, 'refuse');
    }

    return action;
  }

  /**
   * Handles processing and replying to a definition.
   * @param {String} text
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleDefinition(text) {
    const definition = await this.query.storeDefinition(this.mood, text, this.thought);

    if (!definition) {
      return this.query.queryResponse(this.mood, 'no-understand');
    }

    return definition;
  }

  /**
   * Resets Ryan Bot mood.
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async handleResetRyan() {
    const reply = this.message.respondDefault(this.mood, 'reset');

    this.mood = {
      angry: 1,
      dramatic: 1,
      drunk: 1
    }

    return reply;
  }

  /**
   * Remembers last interaction and stores it by thought/user_name.
   */
  remember() {
    const interlocutor = this.thought.interlocutor;

    if (!this.memory[interlocutor]) {
      this.memory[interlocutor] = [];
    }

    this.memory[interlocutor].unshift(this.thought);

    /**
     * Empty thought.
     */
    this.thought = {};

    if (this.memory[interlocutor].length === this.memory_limit) {
      this.memory[interlocutor].pop();
    }
  }

  getSnapshot() {
    const snapshot = {
      mood: this.mood,
      memory: this.memory
    }

    return snapshot;
  }
}

module.exports = new Process();