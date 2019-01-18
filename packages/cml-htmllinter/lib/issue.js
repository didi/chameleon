function Issue(code, pos, data) {
    this.line = pos[0];
    this.column = pos[1];
    this.code = code;
    this.data = data || {};
}
module.exports = Issue;
