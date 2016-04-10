angular.module('gameApp.services')
.factory('Game', function ($http) {
  'use strict';

  function Game() {}

  Game.getAllGames = function () {
    return $http({
      method: 'GET',
      url: '/api/game/all'
    });
  };

  return Game;
})
.factory('Post', function ($http) {
  'use strict';

  function Post() {}

  Post.getAllPosts = function () {
    return $http({
      method: 'GET',
      url: 'api/post/all'
    });
  };

  Post.add = function (postData) {
    return $http({
      method: 'POST',
      url: '/api/post/add',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: $.param(postData)
    });
  };

  return Post;
})
.factory('User', function ($http) {
  'use strict';

  function User() {}

  User.getLoggedInUser = function () {
    return $http({
      method: 'GET',
      url: '/api/user'
    });
  };

  User.getProfile = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/user/' + userId + '/profile'
    });
  };

  User.getRecommendations = function () {
    return $http({
      method: 'GET',
      url: '/api/user/recommend'
    });
  };

  User.getUsersDetails = function (userIds) {
    return $http({
      method: 'GET',
      url: '/api/user/details/' + userIds.join(',')
    });
  };

  User.updateGames = function () {
    return $http({
      method: 'GET',
      url: '/api/user/games'
    });
  };

  return User;
})
.factory('Login', function () {
  var loggedInUser = {
    isLoggedIn: false,
    userId: ''
  };
  return loggedInUser;
})
.factory('Tag', function () {
  function Tag() {}

  var tags = [{"tagid":19,"name":"Action"},{"tagid":492,"name":"Indie"},{"tagid":21,"name":"Adventure"},{"tagid":9,"name":"Strategy"},{"tagid":122,"name":"RPG"},{"tagid":599,"name":"Simulation"},{"tagid":597,"name":"Casual"},{"tagid":113,"name":"Free to Play"},{"tagid":4182,"name":"Singleplayer"},{"tagid":128,"name":"Massively Multiplayer"},{"tagid":3859,"name":"Multiplayer"},{"tagid":699,"name":"Racing"},{"tagid":701,"name":"Sports"},{"tagid":1756,"name":"Great Soundtrack"},{"tagid":4166,"name":"Atmospheric"},{"tagid":1695,"name":"Open World"},{"tagid":1664,"name":"Puzzle"},{"tagid":1685,"name":"Co-op"},{"tagid":1667,"name":"Horror"},{"tagid":3942,"name":"Sci-fi"},{"tagid":1774,"name":"Shooter"},{"tagid":1663,"name":"FPS"},{"tagid":1684,"name":"Fantasy"},{"tagid":3871,"name":"2D"},{"tagid":3839,"name":"First-Person"},{"tagid":1742,"name":"Story Rich"},{"tagid":7208,"name":"Female Protagonist"},{"tagid":1625,"name":"Platformer"},{"tagid":3810,"name":"Sandbox"},{"tagid":4085,"name":"Anime"},{"tagid":4026,"name":"Difficult"},{"tagid":4136,"name":"Funny"},{"tagid":1719,"name":"Comedy"},{"tagid":1662,"name":"Survival"},{"tagid":1693,"name":"Classic"},{"tagid":1698,"name":"Point & Click"},{"tagid":1697,"name":"Third Person"},{"tagid":87,"name":"Utilities"},{"tagid":1677,"name":"Turn-Based"},{"tagid":3964,"name":"Pixel Graphics"},{"tagid":5350,"name":"Family Friendly"},{"tagid":1659,"name":"Zombies"},{"tagid":1773,"name":"Arcade"},{"tagid":3843,"name":"Online Co-Op"},{"tagid":84,"name":"Design & Illustration"},{"tagid":4004,"name":"Retro"},{"tagid":3834,"name":"Exploration"},{"tagid":1755,"name":"Space"},{"tagid":1027,"name":"Audio Production"},{"tagid":4345,"name":"Gore"},{"tagid":1708,"name":"Tactical"},{"tagid":7481,"name":"Controller"},{"tagid":3841,"name":"Local Co-Op"},{"tagid":4231,"name":"Action RPG"},{"tagid":4175,"name":"Realistic"},{"tagid":1676,"name":"RTS"},{"tagid":1716,"name":"Rogue-like"},{"tagid":1687,"name":"Stealth"},{"tagid":1036,"name":"Education"},{"tagid":7368,"name":"Local Multiplayer"},{"tagid":1741,"name":"Turn-Based Strategy"},{"tagid":3968,"name":"Physics"},{"tagid":5900,"name":"Walking Simulator"},{"tagid":3799,"name":"Visual Novel"},{"tagid":4726,"name":"Cute"},{"tagid":3978,"name":"Survival Horror"},{"tagid":872,"name":"Animation & Modeling"},{"tagid":6650,"name":"Nudity"},{"tagid":3987,"name":"Historical"},{"tagid":1669,"name":"Moddable"},{"tagid":3814,"name":"Third-Person Shooter"},{"tagid":1721,"name":"Psychological Horror"},{"tagid":1643,"name":"Building"},{"tagid":4711,"name":"Replay Value"},{"tagid":4255,"name":"Shoot 'Em Up"},{"tagid":1646,"name":"Hack and Slash"},{"tagid":4342,"name":"Dark"},{"tagid":1702,"name":"Crafting"},{"tagid":4234,"name":"Short"},{"tagid":5716,"name":"Mystery"},{"tagid":5577,"name":"RPGMaker"},{"tagid":1775,"name":"PvP"},{"tagid":1678,"name":"War"},{"tagid":3835,"name":"Post-apocalyptic"},{"tagid":1734,"name":"Fast-Paced"},{"tagid":1754,"name":"MMORPG"},{"tagid":1738,"name":"Hidden Object"},{"tagid":1038,"name":"Web Publishing"},{"tagid":1645,"name":"Tower Defense"},{"tagid":5611,"name":"Mature"},{"tagid":784,"name":"Video Production"},{"tagid":1743,"name":"Fighting"},{"tagid":3798,"name":"Side Scroller"},{"tagid":4150,"name":"World War II"},{"tagid":1621,"name":"Music"},{"tagid":12472,"name":"Management"},{"tagid":1445,"name":"Software Training"},{"tagid":4158,"name":"Beat 'em up"},{"tagid":4434,"name":"JRPG"},{"tagid":5537,"name":"Puzzle-Platformer"},{"tagid":4791,"name":"Top-Down"},{"tagid":4172,"name":"Medieval"},{"tagid":4747,"name":"Character Customization"},{"tagid":10397,"name":"Memes"},{"tagid":5851,"name":"Isometric"},{"tagid":3878,"name":"Competitive"},{"tagid":1616,"name":"Trains"},{"tagid":4168,"name":"Military"},{"tagid":4106,"name":"Action-Adventure"},{"tagid":4604,"name":"Dark Fantasy"},{"tagid":4885,"name":"Bullet Hell"},{"tagid":6378,"name":"Crime"},{"tagid":8075,"name":"TrackIR"},{"tagid":10695,"name":"Party-Based RPG"},{"tagid":5711,"name":"Team-Based"},{"tagid":4295,"name":"Futuristic"},{"tagid":4115,"name":"Cyberpunk"},{"tagid":1644,"name":"Driving"},{"tagid":7478,"name":"Illuminati"},{"tagid":1720,"name":"Dungeon Crawler"},{"tagid":4305,"name":"Colorful"},{"tagid":4700,"name":"Movie"},{"tagid":5125,"name":"Procedural Generation"},{"tagid":4036,"name":"Parkour"},{"tagid":1673,"name":"Aliens"},{"tagid":4667,"name":"Violent"},{"tagid":5752,"name":"Robots"},{"tagid":1654,"name":"Relaxing"},{"tagid":9551,"name":"Dating Sim"},{"tagid":8013,"name":"Software"},{"tagid":4328,"name":"City Builder"},{"tagid":4364,"name":"Grand Strategy"},{"tagid":5984,"name":"Drama"},{"tagid":4057,"name":"Magic"},{"tagid":3959,"name":"Rogue-lite"},{"tagid":4840,"name":"4 Player Local"},{"tagid":1628,"name":"Metroidvania"},{"tagid":21978,"name":"VR"},{"tagid":5153,"name":"Kickstarter"},{"tagid":4947,"name":"Romance"},{"tagid":15045,"name":"Flight"},{"tagid":13906,"name":"Game Development"},{"tagid":1718,"name":"MOBA"},{"tagid":1777,"name":"Steampunk"},{"tagid":1759,"name":"Perma Death"},{"tagid":8122,"name":"Level Editor"},{"tagid":29363,"name":"3D Vision"},{"tagid":5228,"name":"Blood"},{"tagid":7332,"name":"Base-Building"},{"tagid":6691,"name":"1990's"},{"tagid":1710,"name":"Surreal"},{"tagid":5708,"name":"Remake"},{"tagid":5923,"name":"Dark Humor"},{"tagid":5348,"name":"Mod"},{"tagid":1666,"name":"Card Game"},{"tagid":1670,"name":"4X"},{"tagid":4695,"name":"Economy"},{"tagid":6426,"name":"Choices Matter"},{"tagid":1770,"name":"Board Game"},{"tagid":4064,"name":"Thriller"},{"tagid":6971,"name":"Multiple Endings"},{"tagid":4325,"name":"Turn-Based Combat"},{"tagid":5613,"name":"Detective"},{"tagid":4758,"name":"Twin Stick Shooter"},{"tagid":14139,"name":"Turn-Based Tactics"},{"tagid":4486,"name":"Choose Your Own Adventure"},{"tagid":4236,"name":"Loot"},{"tagid":5395,"name":"3D Platformer"},{"tagid":809,"name":"Photo Editing"},{"tagid":7107,"name":"Real-Time with Pause"},{"tagid":7782,"name":"Cult Classic"},{"tagid":5363,"name":"Destruction"},{"tagid":4821,"name":"Mechs"},{"tagid":25085,"name":"Touch-Friendly"},{"tagid":4242,"name":"Episodic"},{"tagid":6730,"name":"PvE"},{"tagid":4637,"name":"Top-Down Shooter"},{"tagid":5030,"name":"Dystopian "},{"tagid":5547,"name":"Arena Shooter"},{"tagid":4195,"name":"Cartoony"},{"tagid":4975,"name":"2.5D"},{"tagid":16598,"name":"Space Sim"},{"tagid":6052,"name":"Noir"},{"tagid":7432,"name":"Lovecraftian"},{"tagid":8945,"name":"Resource Management"},{"tagid":13782,"name":"Experimental"},{"tagid":4046,"name":"Dragons"},{"tagid":1665,"name":"Match 3"},{"tagid":1681,"name":"Pirates"},{"tagid":9541,"name":"Demons"},{"tagid":15339,"name":"Documentary"},{"tagid":1688,"name":"Ninja"},{"tagid":4094,"name":"Minimalist"},{"tagid":11014,"name":"Interactive Fiction"},{"tagid":7250,"name":"Linear"},{"tagid":7948,"name":"Soundtrack"},{"tagid":1752,"name":"Rhythm"},{"tagid":10816,"name":"Split Screen"},{"tagid":7743,"name":"1980s"},{"tagid":4736,"name":"2D Fighter"},{"tagid":4252,"name":"Stylized"},{"tagid":5310,"name":"Games Workshop"},{"tagid":1732,"name":"Voxel"},{"tagid":1671,"name":"Superhero"},{"tagid":5160,"name":"Dinosaurs"},{"tagid":5502,"name":"Hacking"},{"tagid":6815,"name":"Hand-drawn"},{"tagid":4376,"name":"Assassin"},{"tagid":4684,"name":"Wargame"},{"tagid":4161,"name":"Real-Time"},{"tagid":4559,"name":"Quick-Time Events"},{"tagid":5186,"name":"Psychological"},{"tagid":4598,"name":"Alternate History"},{"tagid":4018,"name":"Vampire"},{"tagid":4145,"name":"Cinematic"},{"tagid":1651,"name":"Satire"},{"tagid":9564,"name":"Hunting"},{"tagid":13190,"name":"America"},{"tagid":5055,"name":"e-sports"},{"tagid":1649,"name":"GameMaker"},{"tagid":1680,"name":"Heist"},{"tagid":13276,"name":"Tanks"},{"tagid":4202,"name":"Trading"},{"tagid":1751,"name":"Comic Book"},{"tagid":4562,"name":"Cartoon"},{"tagid":6910,"name":"Naval"},{"tagid":5765,"name":"Gun Customization"},{"tagid":7113,"name":"Crowdfunded"},{"tagid":4400,"name":"Abstract"},{"tagid":1647,"name":"Western"},{"tagid":3952,"name":"Gothic"},{"tagid":4878,"name":"Parody "},{"tagid":10808,"name":"Supernatural"},{"tagid":5300,"name":"God Game"},{"tagid":4474,"name":"CRPG"},{"tagid":1736,"name":"LEGO"},{"tagid":1717,"name":"Hex Grid"},{"tagid":150626,"name":"Gaming"},{"tagid":1714,"name":"Psychedelic"},{"tagid":9271,"name":"Trading Card Game"},{"tagid":7226,"name":"Football"},{"tagid":6621,"name":"Pinball"},{"tagid":5382,"name":"World War I"},{"tagid":3796,"name":"Based On A Novel"},{"tagid":31579,"name":"Otome"},{"tagid":18594,"name":"FMV"},{"tagid":17305,"name":"Strategy RPG"},{"tagid":5154,"name":"Score Attack"},{"tagid":10679,"name":"Time Travel"},{"tagid":11333,"name":"Villain Protagonist"},{"tagid":5179,"name":"Cold War"},{"tagid":12286,"name":"Warhammer 40K"},{"tagid":3813,"name":"Real Time Tactics"},{"tagid":3955,"name":"Character Action Game"},{"tagid":4155,"name":"Class-Based"},{"tagid":1735,"name":"Star Wars"},{"tagid":5794,"name":"Science"},{"tagid":4508,"name":"Co-op Campaign"},{"tagid":21725,"name":"Tactical RPG"},{"tagid":6915,"name":"Martial Arts"},{"tagid":1679,"name":"Soccer"},{"tagid":1694,"name":"Batman"},{"tagid":3854,"name":"Lore-Rich"},{"tagid":12057,"name":"Tutorial"},{"tagid":22602,"name":"Agriculture"},{"tagid":9157,"name":"Underwater"},{"tagid":4608,"name":"Swordplay"},{"tagid":4754,"name":"Politics"},{"tagid":4853,"name":"Political"},{"tagid":11123,"name":"Mouse only"},{"tagid":6948,"name":"Rome"},{"tagid":5796,"name":"Bullet Time"},{"tagid":348922,"name":"Steam Machine"},{"tagid":15954,"name":"Silent Protagonist"},{"tagid":7423,"name":"Sniper"},{"tagid":4835,"name":"6DOF"},{"tagid":5094,"name":"Narration"},{"tagid":5407,"name":"Benchmark"},{"tagid":5673,"name":"Modern"},{"tagid":7569,"name":"Grid-Based Movement"},{"tagid":6276,"name":"Inventory Management"},{"tagid":17015,"name":"Werewolves"},{"tagid":19995,"name":"Dark Comedy"},{"tagid":603297,"name":"Hardware"},{"tagid":7622,"name":"Offroad"},{"tagid":5372,"name":"Conspiracy"},{"tagid":4777,"name":"Spectacle fighter"},{"tagid":6625,"name":"Time Manipulation"},{"tagid":4184,"name":"Chess"},{"tagid":6041,"name":"Horses"},{"tagid":5390,"name":"Time Attack"},{"tagid":5432,"name":"Programming"},{"tagid":5981,"name":"Mining"},{"tagid":6702,"name":"Mars"},{"tagid":8253,"name":"Music-Based Procedural Generation"},{"tagid":8666,"name":"Runner"},{"tagid":379975,"name":"Clicker"},{"tagid":17770,"name":"Asynchronous Multiplayer"},{"tagid":56690,"name":"On-Rails Shooter"},{"tagid":16094,"name":"Mythology"},{"tagid":233824,"name":"Feature Film"},{"tagid":15564,"name":"Fishing"},{"tagid":21722,"name":"Lara Croft"},{"tagid":1674,"name":"Typing"},{"tagid":4845,"name":"Capitalism"},{"tagid":16250,"name":"Gambling"},{"tagid":24003,"name":"Word Game"},{"tagid":9592,"name":"Dynamic Narration"},{"tagid":6310,"name":"Diplomacy"},{"tagid":1746,"name":"Basketball"},{"tagid":7038,"name":"Golf"},{"tagid":17337,"name":"Lemmings"},{"tagid":134316,"name":"Philisophical"},{"tagid":7328,"name":"Bowling"},{"tagid":4137,"name":"Transhumanism"},{"tagid":1730,"name":"Sokoban"},{"tagid":13577,"name":"Sailing"},{"tagid":71389,"name":"Spelling"},{"tagid":198631,"name":"Mystery Dungeon"},{"tagid":22955,"name":"Mini Golf"},{"tagid":17927,"name":"Pool"},{"tagid":51306,"name":"Foreign"},{"tagid":21006,"name":"Underground"}];

  Tag.getTagName = function (tagId) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].tagid == tagId) {
        return tags[i].name;
      }
    }
    return '';
  };

  return Tag;
});
