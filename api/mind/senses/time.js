class Time {
  constructor() {

  }

  /**
   * @returns {('morning' | 'afternoon' | 'evening')}
   */
  portionOfDay() {
    const hours = new Date().getHours();

    if (hours < 12) {
      return 'morning';
    } else if (hours >= 12 && hours <= 17) {
      return 'afternoon';
    } else if (hours >= 17 && hours <= 24) {
      return 'evening';
    }
  }
}

module.exports = new Time();