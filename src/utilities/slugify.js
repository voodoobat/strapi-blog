module.exports = {
  /**
   * slugify - covert string to slug
   * @param str {string} - random string
   * @returns {string}
   */
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },
}
