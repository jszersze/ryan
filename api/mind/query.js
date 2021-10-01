const db = require('../database');
const message = require('./message');

class Query {
  constructor() {
    this.message = message;
  }

  /**
   * Queries responses by angry, dramatic or drunk by type.
   * @param {('angry' | 'dramatic' | 'drunk')} mood
   * @param {('confused' | 'no-understand' | 'unknown' | 'confirmation' | 'refuse')} type
   * @returns {{angry:String, text:String: emoji:String}}
   */
  async queryResponse(mood, type) {
    const responses = await db.Response.find({
      angry: mood.angry,
      dramatic: mood.dramatic,
      drunk: mood.drunk,
      type
    });

    if (!responses?.length) {
      return this.message.respondDefault(mood.angry, type);
    }

    return responses;
  }

  async queryAnswer(tag) {
    const answer = await db.Answer.findOne({ tags: [tag] });

    return answer;
  }

  generateAnswer() {

  }
}

module.exports = new Query();