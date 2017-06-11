const test = require('tape');
const translate = require(__dirname + '/emoji-translate.js');

test('isMaybeAlreadyAnEmoji', function (t) {
  t.equal(translate.isMaybeAlreadyAnEmoji('batman'), false, 'batman is not an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('🐳'), true, '🐳 is an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('🤞🏿'), true, '🤞🏿 is an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('👩🏽‍🏫'), true, '👩🏽‍🏫 is an emoji');
  t.end();
});

test('getAllEmojiForWord', function (t) {
  t.equal(translate.getAllEmojiForWord('👀')[0], '👀', '👀 is translated to 👀');
  let allCats = translate.getAllEmojiForWord('cat');
  t.equal(allCats.length > 2, true, 'cat is translated to many things');
  t.equal(allCats.indexOf('🐱') !== -1, true, 'cat is translated to 🐱');
  t.equal(allCats.indexOf('🙀') !== -1, true, 'cat is translated to 🙀');
  t.equal(allCats.indexOf('👻') === -1, true, 'cat is not translated to 👻');
  t.end();
});

test('getEmojiForWord', function (t) {
  t.equal(translate.getEmojiForWord('👀'), '👀', '👀 is translated to 👀');
  let allCats = translate.getAllEmojiForWord('cat');
  let translatedCat = translate.getEmojiForWord('cat');
  t.equal(typeof(translatedCat) === "string", true, 'cat is translated to a string');
  t.equal(allCats.indexOf(translatedCat) !== -1, true, 'cat is translated to something in the list');
  t.end();
});

test('translate', function (t) {
  let sentence = "the house is on fire and the cat is eating the cake";
  let translatedWithWords = translate.translate(sentence);
  let translatedWithoutWords = translate.translate(sentence, true);
  t.equal(translatedWithWords !== '', true, 'sentence can be translated to something with words');
  t.equal(translatedWithoutWords !== '', true, 'sentence can be translated to something without words');
  t.equal(translatedWithWords !== translatedWithoutWords, true, 'those two things are different');

  t.end();
});

test('annoying translations', function(t) {
  // these should not be flags.
  t.equal('im', translate.translate('im').trim());
  t.equal('in', translate.translate('in').trim());

  // t.equal('is', translate.translate('is').trim());
  // t.equal('am', translate.translate('am').trim());

  // hi should work
  t.notEqual('hi', translate.translate('hi').trim());
  t.notEqual('i am', translate.translate('i am').trim());
  t.notEqual('she he is', translate.translate('she he is').trim());
  t.notEqual('we they are', translate.translate('we they are').trim());

  // YES should not have a flag.
  t.equal(-1, translate.getAllEmojiForWord('yes').indexOf('🇾🇪'));

  // Exclamation marks should be preserved
  t.equal(2, translate.translate('YES! victory!').match(/!/g).length);
  t.equal(null, translate.translate('YES! victory!', true).match(/!/g));
  t.end();
});
