const db = require('../database');
const message = require('./message');

class Query {
  constructor() {
    this.message = message;
  }

  /**
   * Queries responses by angry, dramatic or drunk by type.
   * @param {('angry' | 'dramatic' | 'drunk')} mood
   * @param {('confused' | 'unknown' | 'confirmation' | 'refuse')} type
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
      return this.message.respondConfused(mood.angry);
    }

    return responses;
  }

  queryAnswer(tag) {
    const answer = db.Answer.findOne({ tags: [tag] });

    return answer;
  }
}

module.exports = new Query();