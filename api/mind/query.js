const db = require('../database');
const message = require('./message');

class Query {
  constructor() {
    this.message = message;
  }

  /**
   * Queries responses by angry, dramatic or drunk by type.
   * @param {Mood} mood
   * @param {ResponseType} type
   * @param {Thought} [thought]
   * @returns {{mood: Mood, text: String: emoji: String}}
   */
  async queryResponse(mood, type, thought) {
    const responses = await db.Response.find({
      angry: mood.angry,
      dramatic: mood.dramatic,
      drunk: mood.drunk,
      type
    });

    if (!responses?.length) {
      return this.message.respondDefault(mood, type, thought);
    }

    return responses;
  }

  /**
   * Queries answer to a question.
   * @param {Mood} mood
   * @param {*} tag
   * @param {Thought} thought
   * @returns
   */
  async queryAnswer(mood, tag, thought) {
    const answer = await db.Answer.findOne({ tags: [tag] });

    if (!answer?.length && thought) {
      thought.has_answer = false;
    }

    return answer;
  }

  /**
   * Stores a definition from a statement.
   * @param {Mood} mood
   * @param {String} text
   * @param {Thought} thought
   */
  async storeDefinition(mood, text, thought) {

  }

  /**
   * Performs an action from a request.
   * @param {Mood} mood
   * @param {String} text
   * @param {Thought} thought
   * @returns
   */
  async performAction(mood, text, thought) {
    const action = null;

    if (!action?.length && thought) {
      thought.can_perform_action = false;
    }

    return action;
  }
}

module.exports = new Query();