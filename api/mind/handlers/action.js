const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const matches = require('../terms/matches.json');

class Action {
  constructor() {
    this.nlp = compromise;
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
    const doc = this.nlp(text);
    const phrases = doc.split().out('array');

    /**
     * Check for is_you.
     */
    for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);

      for (const word of this.matches.is_you) {
        const match = sub_doc.match(word).text();

        if (match) {
          thought.context.is_you = true;
        }
      }
    }

    /**
     * Check for is_interlocutor.
     */
     for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);

      for (const word of this.matches.is_interlocutor) {
        const match = sub_doc.match(word).text();

        if (match) {
          thought.context.is_interlocutor = true;
        }
      }
    }

    /**
     * Check for is_we.
     */
     for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);

      for (const word of this.matches.is_we) {
        const match = sub_doc.match(word).text();

        if (match) {
          thought.context.is_you = true;
          thought.context.is_interlocutor = true;
        }
      }
    }

    /**
     * Check for people
     */
    thought.context.people = [];

    for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);
      const people = sub_doc.people().out('array');

      thought.context.people = thought.context.people.concat(people);
    }
  }
}

module.exports = new Action();