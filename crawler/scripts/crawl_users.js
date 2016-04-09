'use strict';

const FILE_USERS = '../data/users.txt';
const rfr = require('rfr');
const config = rfr('config/SteamConfig');
const Crawler = rfr('app/Crawler');

// anime, borderlands, counter strike, euro truck, dota, tf2
var users = ['76561198074094286']; //['76561198102534398', '76561198198104519', '76561198254871104', '76561198086728625', '76561198126924860', '76561198060934132'];
const numUsersToCrawl = 1;
var crawledUsers = [];

function inArray(array, element) {
  return array.indexOf(element) !== -1;
}

function crawlUser(userId) {
  if (inArray(crawledUsers, userId)) {
    return;
  }

  try {
    Crawler.getUserProfile(userId).then(function (user) {
      if (user.isPrivate) return;

      Promise.all([
        Crawler.getUserOwnedGames(userId, false),
        Crawler.getUserFollowedGames(userId),
        Crawler.getUserWishlistGames(userId),
        Crawler.getUserReviewedGames(userId),
        Crawler.getUserFriends(userId)]).then(function (data) {
          let ownedGames = data[0];
          let followedGames = data[1];
          let wishListGames = data[2];
          let reviewedGames = data[3];
          let friends = data[4];

          let crawledData = {
            user: userId,
            games: {
              owned: ownedGames,
              followed: followedGames,
              wishlist: wishListGames,
              reviewed: reviewedGames
            },
            friends: friends
          }

          console.log(JSON.stringify(crawledData) + ', ');
          crawledUsers.push(user.id);

          friends.forEach((friend) => {
            crawlUser(friend);
          });
        });
    });
  } catch (error) {
    console.log(error);
    return;
  }
}

for (var i = 0; i < users.length; i++) {
  crawlUser(users[i]);
}
