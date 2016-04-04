const Class = Game.prototype;

function Game(appid, title, players, tags) {
  this.appid = appid;
  this.title = title;
  this.players = players;
  this.tags = tags;
}

Class.toString = function () {
  return JSON.stringify(this) + '\n';
};

module.exports = Game;
