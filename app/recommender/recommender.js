'use strict'

const similarity = require('compute-cosine-similarity');

var Recommender = function () {};

// vectors should be normalized
// returns array of (index, similarity) pairs
Recommender.recommend = function (userVector, allUsersVectors, numRecommendations) {
  var similarities = [];
  for (var i = 0; i < allUsersVectors.length; i++) {
    // make both vectors the same length
    if (userVector.length < allUsersVectors[i].length) {
      var oldLength = userVector.length;
      userVector[allUsersVectors[i].length - 1] = 0;
      userVector.fill(0, oldLength);
    } else if (userVector.length > allUsersVectors[i].length) {
      var oldLength = allUsersVectors[i].length;
      allUsersVectors[i][userVector.length - 1] = 0;
      allUsersVectors[i].fill(0, oldLength);
    }

    similarities.push({
      'index': i,
      'similarity': similarity(userVector, allUsersVectors[i])
    });
  }

  similarities.sort(function (a, b) {
    return b.similarity - a.similarity;
  });

  if (isNaN(numRecommendations) || numRecommendations < 0) {
    return similarities;
  }
  return similarities.slice(0, numRecommendations)
};

Recommender.buildGamesVector = function (games) {
  var gamesVector = [];
  for (var i = 0; i < games.length; i++) {
    gamesVector[games[i].index] = games[i].hoursPlayed;
  }

  // replace all undefined cells in the array with 0
  for (var i = 0; i < gamesVector.length; i++) {
    if (isNaN(gamesVector[i])) {
      gamesVector[i] = 0;
    }
  }
  return gamesVector;
};

var vector1 = Recommender.buildGamesVector([
  {index: 0, hoursPlayed: 4.5},
  {index: 1, hoursPlayed: 0.5},
  {index: 3, hoursPlayed: 200}
]);
var vector2 = Recommender.buildGamesVector([
  {index: 3, hoursPlayed: 1}
]);
var vector3 = Recommender.buildGamesVector([
  {index: 0, hoursPlayed: 4.5},
  {index: 3, hoursPlayed: 4.5}
]);
var vector4 = Recommender.buildGamesVector([
  {index: 2, hoursPlayed: 1000}
]);

console.log(Recommender.recommend(vector1, [vector2, vector3, vector4], 3));
