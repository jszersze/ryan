const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const detection = require('./detection');
const matches = require('../terms/matches.json');
const query = require('../query');

class Question {
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
   * Processes the response answer.
   * @param {Mood} mood
   * @param {} personal
   * @param {Thought} thought
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  processPersonalAnswer(mood, personal, thought) {
    const answer = personal[0];
    const word = this.nlp(answer).nouns().isPlural();
    const is = this.nlp('is');

    if (word) {
      is.nouns().toPlural();
    }

    const text = this.nlp(`My ${answer.word} ${is.text()} ${answer.definition}`);

    const reply = {
      mood,
      text: text.sentences().toStatement().text(),
      emoji: answer.emoji
    }

    return reply;
  }

  /**
   * Processes question.
   * @param {Mood} mood
   * @param {String} text
   * @param {Thought} thought
   * @returns {{mood: Mood, text: String, emoji: String}}
   */
  async process(mood, text, thought) {
    this.detection.checkIsYou(text, thought);
    this.detection.checkIsInterlocutor(text, thought);
    this.detection.checkIsWe(text, thought);
    this.detection.checkPeople(text, thought);

    this.detection.getNouns(text, thought);
    this.detection.refineSubject(thought);

    /**
     * Look for personal piece of information.
     */
    if (thought.context.is_you) {
      const personal = await this.query.queryPersonal(thought.subject);

      thought.context.found_answer = !!personal.length;

      if (personal.length) {
        return this.processPersonalAnswer(mood, personal, thought);
      }
    }

    /**
     * Look for generic information.
     */
    if (!thought.context.is_you) {
      const answer = await this.query.queryAnswer(thought.subject);

      thought.context.found_answer = !!answer?.length;

      return answer;
    }
  }
}

module.exports = new Question();