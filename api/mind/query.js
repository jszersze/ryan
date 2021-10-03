const db = require('../database');
const message = require('./message');

class Query {
  constructor() {
    this.message = message;
  }

  /**
   * Queries responses by angry, dramatic or drunk by type.
   * @param {('angry' | 'dramatic' | 'drunk')} mood
   * @param {('confused' | 'no-understand' | 'deja-vu' | 'dont-know' | 'confirmation' | 'refuse')} type
   * @param {*} [thought]
   * @returns {{angry:String, text:String: emoji:String}}
   */
  async queryResponse(mood, type, thought) {
    const responses = await db.Response.find({
      angry: mood.angry,
      dramatic: mood.dramatic,
      drunk: mood.drunk,
      type
    });

    if (!responses?.length) {
      return this.message.respondDefault(mood.angry, type, thought);
    }

    return responses;
  }

  /**
   * Queries answer to a question.
   * @param {*} mood
   * @param {*} tag
   * @param {*} thought
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
   * @param {*} mood
   * @param {*} text
   * @param {*} thought
   */
  async storeDefinition(mood, text, thought) {

  }

  /**
   * Performs an action from a request.
   * @param {*} mood
   * @param {*} text
   * @param {*} thought
   * @returns
   */
  async performAction(mood, text, thought) {
    const action = null;

    if (!action.length && thought) {
      thought.can_perform_action = false;
    }

    return action;
  }
}

module.exports = new Query();