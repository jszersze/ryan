const compromise = require('compromise');
const compromiseSentences = require('compromise-sentences');
const compromisePennTags = require('compromise-penn-tags');
const matches = require('../terms/matches.json');

class Detection {
  constructor() {
    this.nlp = compromise;
    this.matches = matches;
  }

  extend() {
    this.nlp.extend(compromiseSentences);
    this.nlp.extend(compromisePennTags);
  }

  /**
   * @param {String} text
   * @returns {String}
   */
  removePunctuations(text) {
    return text.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
  }

  /**
   * Check to see if text is about Ryan and updates thought.
   * @param {String} text
   * @param {Thought} thought
   */
  checkIsYou(text, thought) {
    const doc = this.nlp(text);
    const phrases = doc.split().out('array');

    for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);

      for (const word of this.matches.is_you) {
        const match = sub_doc.match(word).text();

        if (match) {
          thought.context.is_you = true;
        }
      }
    }
  }

  /**
   * Check to see if text is about interlocutor and updates thought.
   * @param {String} text
   * @param {Thought} thought
   */
  checkIsInterlocutor(text, thought) {
    const doc = this.nlp(text);
    const phrases = doc.split().out('array');

    for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);

      for (const word of this.matches.is_interlocutor) {
        const match = sub_doc.match(word).text();

        if (match) {
          thought.context.is_interlocutor = true;
        }
      }
    }
  }

  /**
   * Check to see if text is both about interlocutor and Ryan and updates thought.
   * @param {String} text
   * @param {Thought} thought
   */
  checkIsWe(text, thought) {
    const doc = this.nlp(text);
    const phrases = doc.split().out('array');

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
  }

  /**
   * Checks to see if the text is about people and extracts them into thought.
   * @param {String} text
   * @param {Thought} thought
   */
  checkPeople(text, thought) {
    const doc = this.nlp(text);
    const phrases = doc.split().out('array');

    thought.context.people = [];

    for (const phrase of phrases) {
      const sub_doc = this.nlp(phrase);
      const people = sub_doc.people().out('array');

      thought.context.people = thought.context.people.concat(people);
    }
  }

  /**
   * Populates thought with nouns found in the text.
   * @param {String} text
   * @param {Thought} thought
   */
  getNouns(text, thought) {
    const doc = this.nlp(text);
    const nouns = doc.nouns().toSingular().out('array');

    thought.nouns = [];

    for (const item of nouns) {
      thought.nouns.push(item);
    }
  }

  /**
   * Updates subject to become more useful.
   * @param {Thought} thought
   */
  refineSubject(thought) {
    const doc = this.nlp(thought.subject);
    const nouns = doc.nouns().out('array');

    if (!nouns?.length && thought.nouns?.[0]) {
      const sub_doc = this.nlp(thought.nouns[0]);
      const subject = sub_doc.match('#Determiner').delete().text('trim');

      thought.subject = this.removePunctuations(subject);
    } else {
      thought.subject = nouns[0];
    }
  }
}

module.exports = new Detection();