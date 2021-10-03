class Time {
  constructor() {

  }

  /**
   * @returns {('night' | 'day')}
   */
  nightOrDay() {
    const hours = new Date().getHours();
    const is_day = hours > 6 && hours < 20;

    return is_day ? 'day' : 'night';
  }
}

module.exports = new Time();