var allEmojis;
var SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
var defaultOptions = {
  excludedCategories: [], //Array of categories of emoji to ignore
  minLength: 0, //Minimum length of a word to convert to emoji,
  keepWord: false //Whether to append the emoji to the output word rather than overwriting it
};

/**
 * Fires an emoji:ready event when the list of emojis has been loaded.
 *
 * @event emoji-ready
 */
(function() {
  var request = new XMLHttpRequest();
  request.open('GET', 'bower_components/emojilib/emojis.json', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      allEmojis = JSON.parse(request.response);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('emoji-ready', true, false);
      document.dispatchEvent(event);
    }
  };
  request.send();
})();

/**
 * Returns a possibly translated english word to emoji, ready for display.
 * @param {String} word The word to be translated
 * @params {Object} options Options object. See defaultOptions for doc
 * @returns {HTMLElement} A <span> element containing the translated word.
 */
function translateWord(word, options) {
  options = options || defaultOptions;
  var node = document.createElement('span');

  // Punctuation blows. Get all the punctuation at the start and end of the word.
  var firstSymbol = '';
  var lastSymbol = '';

  while (SYMBOLS.indexOf(word[0]) != -1) {
    firstSymbol += word[0];
    word = word.slice(1, word.length);
  }

  while (SYMBOLS.indexOf(word[word.length - 1]) != -1) {
    lastSymbol += word[word.length - 1];
    word = word.slice(0, word.length - 1);
  }
  // If it's already an emoji, return it;
  var emoji = (word.length >= options.minLength) ? getMeAnEmoji(word, options) : [word];

  if (emoji === '')
    return null;

  var node;
  var appendWord = (options.keepWord && emoji != word) ? word : '';
  if (emoji.length === 1) {
    node = document.createElement('span');
    node.innerHTML = appendWord + firstSymbol + emoji + lastSymbol + ' ';
  } else {
    node = document.createElement('select');
    for (var i = 0; i < emoji.length; i++) {
      var option = document.createElement('option');
      option.innerHTML = appendWord + firstSymbol + emoji[i] + lastSymbol + ' ';
      node.appendChild(option);
    }
  }
  return node;
}

/**
 * Returns the emoji equivalent of an english word.
 * @param {String} word The word to be translated
 * @param {Object} options Options object. See defaultOptions for doc
 * @returns {String} The emoji character representing this word, or '' if one doesn't exist.
 */
function getMeAnEmoji(word, options) {
  var originalWord = word;
  word = word.trim().toLowerCase();
	
  var countryCodes = ['us','to','so','no','in','be','it'];
	
  if (!word || word === '' || countryCodes.indexOf(word) != -1)
    return '';

  // Maybe this is a plural word but the word is the singular?
  // Don't do it for two letter words since "as" would become "a" etc.
  var maybeSingular = '';
  if (word.length > 2 && word[word.length - 1] == 's')
    maybeSingular = word.slice(0, word.length - 1);

  // Maybe this is a singular word but the word is the plural?
  // Don't do this for single letter since that will pluralize crazy things.
  var maybePlural = (word.length == 1) ? '' : word + 's';

  var maybeVerbed = (word.indexOf('ing') == -1) ? '' : word.substr(0, word.length-3);
  //Check if past tense of a verb i.e. -ed
  var maybePastTense = (word.substr(word.length - 2, 2) == 'ed') ? word.substr(0, word.length-2) : '';

  // Go through all the things and find the first one that matches.
  var useful = [];

  // Go through all the things and find the first one that matches.
  for (var emoji in allEmojis) {
    //Check if compatible with options
    if (options.excludedCategories.indexOf(allEmojis[emoji].category) > -1)
      continue;
    var words = allEmojis[emoji].keywords;
    if (word == allEmojis[emoji].char ||
        emoji == word || (emoji == word + '_face' ) ||
	emoji == maybeSingular || emoji == maybePlural || emoji == maybeVerbed ||
        (words && words.indexOf(word) >= 0) ||
        (words && words.indexOf(maybeSingular) >= 0) ||
        (words && words.indexOf(maybePlural) >= 0) ||
        (words && words.indexOf(maybeVerbed) >= 0) ||
        (words && words.indexOf(maybePastTense) >= 0)) {
      if (allEmojis[emoji].char !== null)
        useful.push(allEmojis[emoji].char);
    }
  }

  // Add the word itself if there was no emoji translation.
  if (useful.length === 0)
    useful.push(originalWord);

  return (useful.length === 0) ? '' : useful;
};
