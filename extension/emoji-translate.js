var allEmojis;
var SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';

(function() {
  var request = new XMLHttpRequest();
  request.open('GET', chrome.extension.getURL('/emojis.json'), true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      allEmojis = JSON.parse(request.response);
      translateAllTheThings();
    }
  };
  request.send();
})();

function translateAllTheThings() {
  // Find everything that has a text, isn't just a space, and wrap it
  // in something we can track later. Unless we've already done so.
  if (document.getElementById('did-the-parsing-bit'))
    return;

  $('body :not(iframe)').contents().filter(function() {
    return (this.nodeType == Node.TEXT_NODE) && this.nodeValue.match(/\S/);
  }).wrap("<span class='text-chunk'></span>");

  // Add a guard so that we don't do this twice.
  var guard = document.createElement('span');
  guard.id = 'did-the-parsing-bit';
  document.querySelector('body').appendChild(guard);

  var elements = document.querySelectorAll('.text-chunk');
  var container, words;

  // Tokenize the text and apply the style to each letter.
  for (var e = 0; e < elements.length; e++) {
    container = elements[e];
    words = container.innerHTML.split(' ');
    container.innerHTML = '';

    // Re-add the translated words.
    for (var i = 0; i < words.length; i++ ) {
      container.appendChild(translateWord(words[i]));
    }
  }
}

function translateWord(word) {
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

  var emoji = getMeAnEmoji(word);
  if (emoji != '') {
    node.title = word;
    // Emoji in bold text isn't rendered in Chrome :sob:
    node.style.fontWeight = 'normal';
    node.style.fontFamily = 'AppleColorEmoji';
    node.style.letterSpacing = '0.1em';
    node.innerHTML = emoji;
  } else {
    node.innerHTML = word;
  }

  // Reapply the punctuation but only add a bonus space for non-emoji.
  node.innerHTML = firstSymbol + node.innerHTML + lastSymbol;
  if (emoji == '')
    node.innerHTML += ' ';
  return node;
}

function getMeAnEmoji(keyword) {
  keyword = keyword.trim().toLowerCase();

  if (!keyword || keyword === '' || keyword === 'it')
    return '';

  // Maybe this is a plural word but the keyword is the singular?
  var maybeSingular = '';
  if (keyword[keyword.length - 1] == 's')
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
};
