var allEmojis;
var SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';

(function() {
  var request = new XMLHttpRequest();
  request.open('GET', 'bower_components/emojilib/emojis.json', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      allEmojis = JSON.parse(request.response);
      $(document).trigger('emoji:ready');
    }
  };
  request.send();
})();

function translateWord(word) {
  var node = document.createElement('span');
  var emojiContainer = document.createElement('span');

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

  var emoji = getMeAnEmoji(word);
  if (emoji !== '') {
    emojiContainer.title = word;
    // Emoji in bold text isn't rendered in Chrome :sob:
    emojiContainer.style.fontWeight = 'normal';
    emojiContainer.style.fontFamily = 'AppleColorEmoji';
    emojiContainer.innerHTML = emoji;
    node.appendChild(emojiContainer);
  } else {
    node.innerHTML = word;
  }

  // Reapply the punctuation.
  node.innerHTML = firstSymbol + node.innerHTML + lastSymbol + ' ';
  return node;
}

function getMeAnEmoji(keyword) {
  keyword = keyword.trim().toLowerCase();

  if (!keyword || keyword === '')
    return '';

  // Maybe this is a plural word but the keyword is the singular?
  // Don't do it for two letter words since "as" would become "a" etc.
  var maybeSingular = '';
  if (keyword.length > 2 && keyword[keyword.length - 1] == 's')
    maybeSingular = keyword.slice(0, keyword.length - 1);

  // Maybe this is a singular word but the keyword is the plural?
  // Don't do this for single letter since that will pluralize crazy things.
  var maybePlural = (keyword.length == 1) ? '' : keyword + 's';

  // Go through all the things and find the first one that matches.
  for (var emoji in allEmojis) {
    var keywords = allEmojis[emoji].keywords;
    if (emoji == keyword || emoji == maybeSingular || emoji == maybePlural ||
        (keywords && keywords.indexOf(keyword) >= 0) ||
        (keywords && keywords.indexOf(maybeSingular) >= 0) ||
        (keywords && keywords.indexOf(maybePlural) >= 0))
      return allEmojis[emoji].char;
  }
  return '';
}
