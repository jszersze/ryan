/**
 * Ryan's mood
 * @typedef {object} Mood
 * @property {Number} angry - Range from 1 - 5. 1 being most happy.
 * @property {Number} dramatic - Range from 1 - 5. 1 being least dramatic.
 * @property {Number} drunk - Range from 1 - 5. 1 being least drunk.
 */

/**
 * Ryan's mood state
 * @typedef {('angry' | 'dramatic' | 'drunk')} MoodState
 */

/**
 * Ryan's response type
 * @typedef {('confused' | 'no-understand' | 'deja-vu' | 'dont-know' | 'confirmation' | 'refuse')} ResponseType
 */

/**
 * Ryan's thought
 * @typedef {object} Thought
 * @property {String} interlocutor
 * @property {String} input_text
 * @property {String} subject
 * @property {[{text: String, terms: [{text: String, penn: String, tags: [String]}]}]} tags
 * @property {ThoughtContext} context
 * @property {Number} deja_vu - Indicates number of times Ryan thinks he was told the same information.
 * @property {{mood: Mood, text: String, emoji: String}} reply
 */

/**
 * Ryan's context
 * @typedef {object} ThoughtContext
 * @property {Boolean} is_question
 * @property {Boolean} is_action_request
 * @property {Boolean} is_statement
 * @property {Boolean} is_greeting
 * @property {Boolean} is_farewell
 * @property {Boolean} is_you - Identifies if context is about Ryan
 * @property {Boolean} is_interlocutor - Identifies if context is about interlocutor
 * @property {[String]} people
 */