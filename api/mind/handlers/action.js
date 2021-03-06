const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const detection = require('./detection');
const matches = require('../terms/matches.json');

class Action {
  constructor() {
    this.nlp = compromise;
    this.detection = detection;
    this.matches = matches;
  }

  extend() {
    this.nlp.extend(compromiseSentences);
    this.nlp.extend(compromisePennTags);
  }

  /**
   * Processes question.
   * @param {Mood} mood
   * @param {String} text
   * @param {Thought} thought
   */
  process(mood, text, thought) {
    this.detection.checkIsYou(text, thought);
    this.detection.checkIsInterlocutor(text, thought);
    this.detection.checkIsWe(text, thought);
    this.detection.checkPeople(text, thought);
  }
}

module.exports = new Action();