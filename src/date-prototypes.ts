/* eslint-disable no-extend-native */
Date.prototype.toJSON = function() {
    const hoursDiff = this.getHours() - this.getTimezoneOffset() / 60
    this.setHours(hoursDiff)
    return this.toISOString()
}
