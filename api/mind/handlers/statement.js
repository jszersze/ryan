const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const detection = require('./detection');
const matches = require('../terms/matches.json');
const query = require('../query');

class Statement {
  constructor() {
    this.nlp = compromise;
    this.detection = detection;
    this.matches = matches;
    this.query = query;
  }

  extend() {
    this.nlp.extend(compromiseSentences);
    this.nlp.extend(compromisePennTags);
  }

  /**
   * Finds definition of a subject.
   * @param {String} text
   * @param {Thought} thought
   */
  getDefinition(text, thought) {
    const doc = this.nlp(text);
    const definition = doc.after('#VerbPhrase').text();

    thought.definition = definition;
  }

  /**
   * Processes question.
   * @param {Mood} mood
   * @param {String} text
   * @param {Thought} thought
   */
  async process(mood, text, thought) {
    this.detection.checkIsYou(text, thought);
    this.detection.checkIsInterlocutor(text, thought);
    this.detection.checkIsWe(text, thought);
    this.detection.checkPeople(text, thought);

    this.detection.getNouns(text, thought);
    this.detection.refineSubject(thought);

    this.getDefinition(text, thought);

    if (thought.context.is_you) {
      const personal = await this.query.storePersonal(thought.subject, thought.definition);

      return personal;
    }
  }
}

module.exports = new Statement();