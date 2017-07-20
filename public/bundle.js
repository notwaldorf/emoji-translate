/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const emojilib = __webpack_require__(2);
const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
const allEmoji = emojilib.lib;

/**
 * Returns true for something that's already an emoji like 🤖.
 * @param {String} word The word to be translated
 * @returns {Bool}
 */
function isMaybeAlreadyAnEmoji(word) {
  let ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
  ];
  return word.match(ranges.join('|')) !== null;
}

/**
 * Returns the list of all emoji translations of an english word.
 * @param {String} word The word to be translated
 * @returns {Array} The list of emoji translations or '' if none exist.
 */
function getAllEmojiForWord(originalWord) {
  let word = originalWord.trim().toLowerCase();

  if (!word || word === '' || word === 'a' || word === 'it' || word === 'is')
    return '';

  // Maybe this is a plural word but the word is the singular?
  // Don't do it for two letter words since "as" would become "a" etc.
  let maybeSingular = '';
  if (word.length > 2 && word[word.length - 1] == 's') {
    maybeSingular = word.slice(0, word.length - 1);
  }

  // Maybe this is a singular word but the word is the plural?
  // Don't do this for single letter since that will pluralize crazy things.
  let maybePlural = (word.length == 1) ? '' : word + 's';

  let maybeVerbedSimple = '';
  let maybeVerbedVowel = '';
  let maybeVerbedDoubled  = '';

  if (word.indexOf('ing') !== -1) {
    let verb = word.substr(0, word.length - 3);
    // eating -> eat
    maybeVerbedSimple = verb;
    // dancing -> dance
    maybeVerbedVowel = verb + 'e';
    // running -> run
    maybeVerbedDoubled = verb.substr(0, verb.length - 1);
  }

  // Go through all the things and find the first one that matches.
  let useful = [];

  // If this is already an emoji, don't try to translate it.
  if (isMaybeAlreadyAnEmoji(word)) {
    useful.push(word);
    return useful;
  }

  // If it's "i" or "i", add some faces to it.
  if (word === 'i' || word === 'you') {
    useful.push('😀');
    useful.push('😊');
  } else if (word === 'she'){
    useful.push('💁');
  } else if (word === 'he'){
    useful.push('💁‍♂️');
  } else if (word === 'we' || word === 'they') {
    useful.push('👩‍👩‍👦‍👦');
  } else if (word === 'am' || word === 'is' || word === 'are') {
    useful.push('👉');
  } else if (word === 'thanks') {
    useful.push('🙌');
  }

  for (let emoji in allEmoji) {
    let words = allEmoji[emoji].keywords;
    // TODO: omg refactor this one day, please. Why is this even. Why.
    if (word == allEmoji[emoji].char ||
        emoji == word || (emoji == word + '_face') ||
        emoji == maybeSingular || emoji == maybePlural ||
        emoji == maybeVerbedSimple || emoji == maybeVerbedVowel || emoji == maybeVerbedDoubled ||
        (words && words.indexOf(word) >= 0) ||
        (words && words.indexOf(maybeSingular) >= 0) ||
        (words && words.indexOf(maybePlural) >= 0) ||
        (words && words.indexOf(maybeVerbedSimple) >= 0) ||
        (words && words.indexOf(maybeVerbedVowel) >= 0) ||
        (words && words.indexOf(maybeVerbedDoubled) >= 0)) {
      // If it's a two letter word that got translated to a flag, it's 99% of the
      // time incorrect, so stop doing that.
      if (!(word.length <= 3 && allEmoji[emoji].category == 'flags')) {
        useful.push(allEmoji[emoji].char);
      }
    }
  }
  return (useful.length === 0) ? '' : useful;
}

/**
 * Returns a random emoji translation of an english word.
 * @param {String} word The word to be translated.
 * @returns {String} A random emoji translation or '' if none exists.
 */
function getEmojiForWord(word) {
  let translations = getAllEmojiForWord(word);
  return translations[Math.floor(Math.random() * translations.length)];
}

/**
 * Returns a displayable, possibly translated english word to emoji.
 * This will either be:
 *  - a span containing the word if it cannot be translated
 *  - a span containing an emoji if only one translation exists
 *  - a span containing a <select> with all the translations if multiple exist
 * @param {String} word The word to be translated
 * @returns {HTMLElement} A <span> or <select> element as above.
 */
function translateForDisplay(word) {
  var node = document.createElement('span');

  // Punctuation blows. Get all the punctuation at the start and end of the word.
  let firstSymbol = '';
  let lastSymbol = '';

  while (SYMBOLS.indexOf(word[0]) != -1) {
    firstSymbol += word[0];
    word = word.slice(1, word.length);
  }
  while (SYMBOLS.indexOf(word[word.length - 1]) != -1) {
    lastSymbol += word[word.length - 1];
    word = word.slice(0, word.length - 1);
  }

  // If it's already an emoji, return it.
  var emoji = getAllEmojiForWord(word);
  if (emoji === '')
    emoji = [word];

  var node;
  if (emoji.length === 1) {
    node = document.createElement('span');
    node.innerHTML = firstSymbol + emoji + lastSymbol + ' ';
  } else {
    node = document.createElement('select');
    for (var i = 0; i < emoji.length; i++) {
      var option = document.createElement('option');
      option.textContent = firstSymbol + emoji[i] + lastSymbol + ' ';
      node.appendChild(option);
    }
  }
  return node;
}

/**
 * Translates an entire sentence to emoji. If multiple translations exist
 * for a particular word, a random emoji is picked.
 * @param {String} sentence The sentence to be translated
 * @param {Bool} onlyEmoji True if the translation should omit all untranslatable words
 * @returns {String} An emoji translation!
 */
function translate(sentence, onlyEmoji) {
  let translation = '';
  let words = sentence.split(' ');
  for (let i = 0; i < words.length; i++ ) {
    // Punctuation blows. Get all the punctuation at the start and end of the word.
    // TODO: stop copy pasting this.
    let firstSymbol = '';
    let lastSymbol = '';
    var word = words[i];

    while (SYMBOLS.indexOf(word[0]) != -1) {
      firstSymbol += word[0];
      word = word.slice(1, word.length);
    }
    while (SYMBOLS.indexOf(word[word.length - 1]) != -1) {
      lastSymbol += word[word.length - 1];
      word = word.slice(0, word.length - 1);
    }

    if (onlyEmoji) {
      firstSymbol = lastSymbol = ''
    }

    let translated = getEmojiForWord(word);
    if (translated) {
      translation += firstSymbol + translated + lastSymbol + ' ';
    } else if (!onlyEmoji){
      translation += firstSymbol + word + lastSymbol +  ' '
    }
  }
  return translation;
}

module.exports.isMaybeAlreadyAnEmoji = isMaybeAlreadyAnEmoji;
module.exports.getAllEmojiForWord = getAllEmojiForWord;
module.exports.getEmojiForWord = getEmojiForWord;
module.exports.translateForDisplay = translateForDisplay;
module.exports.translate = translate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
	"100": {
		"keywords": [
			"score",
			"perfect",
			"numbers",
			"century",
			"exam",
			"quiz",
			"test",
			"pass",
			"hundred"
		],
		"char": "💯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"1234": {
		"keywords": [
			"numbers",
			"blue-square"
		],
		"char": "🔢",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"grinning": {
		"keywords": [
			"face",
			"smile",
			"happy",
			"joy",
			":D",
			"grin"
		],
		"char": "😀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"grimacing": {
		"keywords": [
			"face",
			"grimace",
			"teeth"
		],
		"char": "😬",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"grin": {
		"keywords": [
			"face",
			"happy",
			"smile",
			"joy",
			"kawaii"
		],
		"char": "😁",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"joy": {
		"keywords": [
			"face",
			"cry",
			"tears",
			"weep",
			"happy",
			"happytears",
			"haha"
		],
		"char": "😂",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"rofl": {
		"keywords": [
			"face",
			"rolling",
			"floor",
			"laughing",
			"lol",
			"haha"
		],
		"char": "🤣",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smiley": {
		"keywords": [
			"face",
			"happy",
			"joy",
			"haha",
			":D",
			":)",
			"smile",
			"funny"
		],
		"char": "😃",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smile": {
		"keywords": [
			"face",
			"happy",
			"joy",
			"funny",
			"haha",
			"laugh",
			"like",
			":D",
			":)"
		],
		"char": "😄",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sweat_smile": {
		"keywords": [
			"face",
			"hot",
			"happy",
			"laugh",
			"sweat",
			"smile",
			"relief"
		],
		"char": "😅",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"laughing": {
		"keywords": [
			"happy",
			"joy",
			"lol",
			"satisfied",
			"haha",
			"face",
			"glad",
			"XD",
			"laugh"
		],
		"char": "😆",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"innocent": {
		"keywords": [
			"face",
			"angel",
			"heaven",
			"halo"
		],
		"char": "😇",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"wink": {
		"keywords": [
			"face",
			"happy",
			"mischievous",
			"secret",
			";)",
			"smile",
			"eye"
		],
		"char": "😉",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"blush": {
		"keywords": [
			"face",
			"smile",
			"happy",
			"flushed",
			"crush",
			"embarrassed",
			"shy",
			"joy"
		],
		"char": "😊",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"slightly_smiling_face": {
		"keywords": [
			"face",
			"smile"
		],
		"char": "🙂",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"upside_down_face": {
		"keywords": [
			"face",
			"flipped",
			"silly",
			"smile"
		],
		"char": "🙃",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"relaxed": {
		"keywords": [
			"face",
			"blush",
			"massage",
			"happiness"
		],
		"char": "☺️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"yum": {
		"keywords": [
			"happy",
			"joy",
			"tongue",
			"smile",
			"face",
			"silly",
			"yummy",
			"nom",
			"delicious",
			"savouring"
		],
		"char": "😋",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"relieved": {
		"keywords": [
			"face",
			"relaxed",
			"phew",
			"massage",
			"happiness"
		],
		"char": "😌",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"heart_eyes": {
		"keywords": [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"crush",
			"heart"
		],
		"char": "😍",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kissing_heart": {
		"keywords": [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		"char": "😘",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kissing": {
		"keywords": [
			"love",
			"like",
			"face",
			"3",
			"valentines",
			"infatuation",
			"kiss"
		],
		"char": "😗",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kissing_smiling_eyes": {
		"keywords": [
			"face",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		"char": "😙",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kissing_closed_eyes": {
		"keywords": [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		"char": "😚",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"stuck_out_tongue_winking_eye": {
		"keywords": [
			"face",
			"prank",
			"childish",
			"playful",
			"mischievous",
			"smile",
			"wink",
			"tongue"
		],
		"char": "😜",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"stuck_out_tongue_closed_eyes": {
		"keywords": [
			"face",
			"prank",
			"playful",
			"mischievous",
			"smile",
			"tongue"
		],
		"char": "😝",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"stuck_out_tongue": {
		"keywords": [
			"face",
			"prank",
			"childish",
			"playful",
			"mischievous",
			"smile",
			"tongue"
		],
		"char": "😛",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"money_mouth_face": {
		"keywords": [
			"face",
			"rich",
			"dollar",
			"money"
		],
		"char": "🤑",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"nerd_face": {
		"keywords": [
			"face",
			"nerdy",
			"geek",
			"dork"
		],
		"char": "🤓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sunglasses": {
		"keywords": [
			"face",
			"cool",
			"smile",
			"summer",
			"beach",
			"sunglass"
		],
		"char": "😎",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"clown_face": {
		"keywords": [
			"face"
		],
		"char": "🤡",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"cowboy_hat_face": {
		"keywords": [
			"face",
			"cowgirl",
			"hat"
		],
		"char": "🤠",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"hugs": {
		"keywords": [
			"face",
			"smile",
			"hug"
		],
		"char": "🤗",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smirk": {
		"keywords": [
			"face",
			"smile",
			"mean",
			"prank",
			"smug",
			"sarcasm"
		],
		"char": "😏",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"no_mouth": {
		"keywords": [
			"face",
			"hellokitty"
		],
		"char": "😶",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"neutral_face": {
		"keywords": [
			"indifference",
			"meh",
			":|",
			"neutral"
		],
		"char": "😐",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"expressionless": {
		"keywords": [
			"face",
			"indifferent",
			"-_-",
			"meh",
			"deadpan"
		],
		"char": "😑",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"unamused": {
		"keywords": [
			"indifference",
			"bored",
			"straight face",
			"serious",
			"sarcasm"
		],
		"char": "😒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"roll_eyes": {
		"keywords": [
			"face",
			"eyeroll",
			"frustrated"
		],
		"char": "🙄",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"thinking": {
		"keywords": [
			"face",
			"hmmm",
			"think",
			"consider"
		],
		"char": "🤔",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"lying_face": {
		"keywords": [
			"face",
			"lie",
			"pinocchio"
		],
		"char": "🤥",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"flushed": {
		"keywords": [
			"face",
			"blush",
			"shy",
			"flattered"
		],
		"char": "😳",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"disappointed": {
		"keywords": [
			"face",
			"sad",
			"upset",
			"depressed",
			":("
		],
		"char": "😞",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"worried": {
		"keywords": [
			"face",
			"concern",
			"nervous",
			":("
		],
		"char": "😟",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"angry": {
		"keywords": [
			"mad",
			"face",
			"annoyed",
			"frustrated"
		],
		"char": "😠",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"rage": {
		"keywords": [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		"char": "😡",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"pensive": {
		"keywords": [
			"face",
			"sad",
			"depressed",
			"okay",
			"upset"
		],
		"char": "😔",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"confused": {
		"keywords": [
			"face",
			"indifference",
			"huh",
			"weird",
			"hmmm",
			":/"
		],
		"char": "😕",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"slightly_frowning_face": {
		"keywords": [
			"face",
			"frowning",
			"disappointed",
			"sad",
			"upset"
		],
		"char": "🙁",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"frowning_face": {
		"keywords": [
			"face",
			"sad",
			"upset",
			"frown"
		],
		"char": "☹",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"persevere": {
		"keywords": [
			"face",
			"sick",
			"no",
			"upset",
			"oops"
		],
		"char": "😣",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"confounded": {
		"keywords": [
			"face",
			"confused",
			"sick",
			"unwell",
			"oops",
			":S"
		],
		"char": "😖",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"tired_face": {
		"keywords": [
			"sick",
			"whine",
			"upset",
			"frustrated"
		],
		"char": "😫",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"weary": {
		"keywords": [
			"face",
			"tired",
			"sleepy",
			"sad",
			"frustrated",
			"upset"
		],
		"char": "😩",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"triumph": {
		"keywords": [
			"face",
			"gas",
			"phew",
			"proud",
			"pride"
		],
		"char": "😤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"open_mouth": {
		"keywords": [
			"face",
			"surprise",
			"impressed",
			"wow",
			"whoa",
			":O"
		],
		"char": "😮",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"scream": {
		"keywords": [
			"face",
			"munch",
			"scared",
			"omg"
		],
		"char": "😱",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"fearful": {
		"keywords": [
			"face",
			"scared",
			"terrified",
			"nervous",
			"oops",
			"huh"
		],
		"char": "😨",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"cold_sweat": {
		"keywords": [
			"face",
			"nervous",
			"sweat"
		],
		"char": "😰",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"hushed": {
		"keywords": [
			"face",
			"woo",
			"shh"
		],
		"char": "😯",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"frowning": {
		"keywords": [
			"face",
			"aw",
			"what"
		],
		"char": "😦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"anguished": {
		"keywords": [
			"face",
			"stunned",
			"nervous"
		],
		"char": "😧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"cry": {
		"keywords": [
			"face",
			"tears",
			"sad",
			"depressed",
			"upset",
			":'("
		],
		"char": "😢",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"disappointed_relieved": {
		"keywords": [
			"face",
			"phew",
			"sweat",
			"nervous"
		],
		"char": "😥",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"drooling_face": {
		"keywords": [
			"face"
		],
		"char": "🤤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sleepy": {
		"keywords": [
			"face",
			"tired",
			"rest",
			"nap"
		],
		"char": "😪",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sweat": {
		"keywords": [
			"face",
			"hot",
			"sad",
			"tired",
			"exercise"
		],
		"char": "😓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sob": {
		"keywords": [
			"face",
			"cry",
			"tears",
			"sad",
			"upset",
			"depressed"
		],
		"char": "😭",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"dizzy_face": {
		"keywords": [
			"spent",
			"unconscious",
			"xox",
			"dizzy"
		],
		"char": "😵",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"astonished": {
		"keywords": [
			"face",
			"xox",
			"surprised",
			"poisoned"
		],
		"char": "😲",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"zipper_mouth_face": {
		"keywords": [
			"face",
			"sealed",
			"zipper",
			"secret"
		],
		"char": "🤐",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"nauseated_face": {
		"keywords": [
			"face",
			"vomit",
			"gross",
			"green",
			"sick",
			"throw up",
			"ill"
		],
		"char": "🤢",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sneezing_face": {
		"keywords": [
			"face",
			"gesundheit",
			"sneeze",
			"sick",
			"allergy"
		],
		"char": "🤧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"mask": {
		"keywords": [
			"face",
			"sick",
			"ill",
			"disease"
		],
		"char": "😷",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"face_with_thermometer": {
		"keywords": [
			"sick",
			"temperature",
			"thermometer",
			"cold",
			"fever"
		],
		"char": "🤒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"face_with_head_bandage": {
		"keywords": [
			"injured",
			"clumsy",
			"bandage",
			"hurt"
		],
		"char": "🤕",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sleeping": {
		"keywords": [
			"face",
			"tired",
			"sleepy",
			"night",
			"zzz"
		],
		"char": "😴",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"zzz": {
		"keywords": [
			"sleepy",
			"tired"
		],
		"char": "💤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"poop": {
		"keywords": [
			"hankey",
			"shitface",
			"fail",
			"turd",
			"shit"
		],
		"char": "💩",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smiling_imp": {
		"keywords": [
			"devil",
			"horns"
		],
		"char": "😈",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"imp": {
		"keywords": [
			"devil",
			"angry",
			"horns"
		],
		"char": "👿",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"japanese_ogre": {
		"keywords": [
			"monster",
			"red",
			"mask",
			"halloween",
			"scary",
			"creepy",
			"devil",
			"demon",
			"japanese",
			"ogre"
		],
		"char": "👹",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"japanese_goblin": {
		"keywords": [
			"red",
			"evil",
			"mask",
			"monster",
			"scary",
			"creepy",
			"japanese",
			"goblin"
		],
		"char": "👺",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"skull": {
		"keywords": [
			"dead",
			"skeleton",
			"creepy"
		],
		"char": "💀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"ghost": {
		"keywords": [
			"halloween",
			"spooky",
			"scary"
		],
		"char": "👻",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"alien": {
		"keywords": [
			"UFO",
			"paul",
			"weird",
			"outer_space"
		],
		"char": "👽",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"robot": {
		"keywords": [
			"computer",
			"machine"
		],
		"char": "🤖",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smiley_cat": {
		"keywords": [
			"animal",
			"cats",
			"happy",
			"smile"
		],
		"char": "😺",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smile_cat": {
		"keywords": [
			"animal",
			"cats",
			"smile"
		],
		"char": "😸",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"joy_cat": {
		"keywords": [
			"animal",
			"cats",
			"haha",
			"happy",
			"tears"
		],
		"char": "😹",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"heart_eyes_cat": {
		"keywords": [
			"animal",
			"love",
			"like",
			"affection",
			"cats",
			"valentines",
			"heart"
		],
		"char": "😻",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"smirk_cat": {
		"keywords": [
			"animal",
			"cats",
			"smirk"
		],
		"char": "😼",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kissing_cat": {
		"keywords": [
			"animal",
			"cats",
			"kiss"
		],
		"char": "😽",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"scream_cat": {
		"keywords": [
			"animal",
			"cats",
			"munch",
			"scared",
			"scream"
		],
		"char": "🙀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"crying_cat_face": {
		"keywords": [
			"animal",
			"tears",
			"weep",
			"sad",
			"cats",
			"upset",
			"cry"
		],
		"char": "😿",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"pouting_cat": {
		"keywords": [
			"animal",
			"cats"
		],
		"char": "😾",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"raised_hands": {
		"keywords": [
			"gesture",
			"hooray",
			"yea",
			"celebration",
			"hands"
		],
		"char": "🙌",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"clap": {
		"keywords": [
			"hands",
			"praise",
			"applause",
			"congrats",
			"yay"
		],
		"char": "👏",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"wave": {
		"keywords": [
			"hands",
			"gesture",
			"goodbye",
			"solong",
			"farewell",
			"hello",
			"hi",
			"palm"
		],
		"char": "👋",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"call_me_hand": {
		"keywords": [
			"hands",
			"gesture"
		],
		"char": "🤙",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"+1": {
		"keywords": [
			"thumbsup",
			"yes",
			"awesome",
			"good",
			"agree",
			"accept",
			"cool",
			"hand",
			"like"
		],
		"char": "👍",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"-1": {
		"keywords": [
			"thumbsdown",
			"no",
			"dislike",
			"hand"
		],
		"char": "👎",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"facepunch": {
		"keywords": [
			"angry",
			"violence",
			"fist",
			"hit",
			"attack",
			"hand"
		],
		"char": "👊",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"fist": {
		"keywords": [
			"fingers",
			"hand",
			"grasp"
		],
		"char": "✊",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"fist_left": {
		"keywords": [
			"hand",
			"fistbump"
		],
		"char": "🤛",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"fist_right": {
		"keywords": [
			"hand",
			"fistbump"
		],
		"char": "🤜",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"v": {
		"keywords": [
			"fingers",
			"ohyeah",
			"hand",
			"peace",
			"victory",
			"two"
		],
		"char": "✌",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"ok_hand": {
		"keywords": [
			"fingers",
			"limbs",
			"perfect",
			"ok"
		],
		"char": "👌",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"raised_hand": {
		"keywords": [
			"fingers",
			"stop",
			"highfive",
			"palm",
			"ban"
		],
		"char": "✋",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"raised_back_of_hand": {
		"keywords": [
			"fingers",
			"raised",
			"backhand"
		],
		"char": "🤚",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"open_hands": {
		"keywords": [
			"fingers",
			"butterfly",
			"hands",
			"open"
		],
		"char": "👐",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"muscle": {
		"keywords": [
			"arm",
			"flex",
			"hand",
			"summer",
			"strong",
			"biceps"
		],
		"char": "💪",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"pray": {
		"keywords": [
			"please",
			"hope",
			"wish",
			"namaste",
			"highfive"
		],
		"char": "🙏",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"handshake": {
		"keywords": [
			"agreement",
			"shake"
		],
		"char": "🤝",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"point_up": {
		"keywords": [
			"hand",
			"fingers",
			"direction",
			"up"
		],
		"char": "☝",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"point_up_2": {
		"keywords": [
			"fingers",
			"hand",
			"direction",
			"up"
		],
		"char": "👆",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"point_down": {
		"keywords": [
			"fingers",
			"hand",
			"direction",
			"down"
		],
		"char": "👇",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"point_left": {
		"keywords": [
			"direction",
			"fingers",
			"hand",
			"left"
		],
		"char": "👈",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"point_right": {
		"keywords": [
			"fingers",
			"hand",
			"direction",
			"right"
		],
		"char": "👉",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"fu": {
		"keywords": [
			"hand",
			"fingers",
			"rude"
		],
		"char": "🖕",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"raised_hand_with_fingers_splayed": {
		"keywords": [
			"hand",
			"fingers",
			"palm"
		],
		"char": "🖐",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"metal": {
		"keywords": [
			"hand",
			"fingers",
			"evil_eye",
			"sign_of_horns",
			"rock_on"
		],
		"char": "🤘",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"crossed_fingers": {
		"keywords": [
			"good",
			"lucky"
		],
		"char": "🤞",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"vulcan_salute": {
		"keywords": [
			"hand",
			"fingers",
			"spock",
			"star trek"
		],
		"char": "🖖",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"writing_hand": {
		"keywords": [
			"lower_left_ballpoint_pen",
			"stationery",
			"write"
		],
		"char": "✍",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"selfie": {
		"keywords": [
			"camera",
			"phone"
		],
		"char": "🤳",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"nail_care": {
		"keywords": [
			"beauty",
			"manicure",
			"finger",
			"fashion",
			"nail"
		],
		"char": "💅",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"lips": {
		"keywords": [
			"mouth",
			"kiss"
		],
		"char": "👄",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"tongue": {
		"keywords": [
			"mouth",
			"playful"
		],
		"char": "👅",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"ear": {
		"keywords": [
			"face",
			"hear",
			"sound",
			"listen"
		],
		"char": "👂",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"nose": {
		"keywords": [
			"smell",
			"sniff"
		],
		"char": "👃",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"eye": {
		"keywords": [
			"face",
			"look",
			"see",
			"watch",
			"stare"
		],
		"char": "👁",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"eyes": {
		"keywords": [
			"look",
			"watch",
			"stalk",
			"peek",
			"see"
		],
		"char": "👀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"bust_in_silhouette": {
		"keywords": [
			"user",
			"person",
			"human"
		],
		"char": "👤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"busts_in_silhouette": {
		"keywords": [
			"user",
			"person",
			"human",
			"group",
			"team"
		],
		"char": "👥",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"speaking_head": {
		"keywords": [
			"user",
			"person",
			"human"
		],
		"char": "🗣",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"baby": {
		"keywords": [
			"child",
			"boy",
			"girl",
			"toddler"
		],
		"char": "👶",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"boy": {
		"keywords": [
			"man",
			"male",
			"guy",
			"teenager"
		],
		"char": "👦",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"girl": {
		"keywords": [
			"female",
			"woman",
			"teenager"
		],
		"char": "👧",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man": {
		"keywords": [
			"mustache",
			"father",
			"dad",
			"guy",
			"classy",
			"sir",
			"moustache"
		],
		"char": "👨",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"woman": {
		"keywords": [
			"female",
			"girls",
			"lady"
		],
		"char": "👩",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"blonde_woman": {
		"keywords": [
			"woman",
			"female",
			"girl",
			"blonde",
			"person"
		],
		"char": "👱‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"blonde_man": {
		"keywords": [
			"man",
			"male",
			"boy",
			"blonde",
			"guy",
			"person"
		],
		"char": "👱",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"older_man": {
		"keywords": [
			"human",
			"male",
			"men",
			"old",
			"elder",
			"senior"
		],
		"char": "👴",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"older_woman": {
		"keywords": [
			"human",
			"female",
			"women",
			"lady",
			"old",
			"elder",
			"senior"
		],
		"char": "👵",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man_with_gua_pi_mao": {
		"keywords": [
			"male",
			"boy",
			"chinese"
		],
		"char": "👲",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"woman_with_turban": {
		"keywords": [
			"female",
			"indian",
			"hinduism",
			"arabs",
			"woman"
		],
		"char": "👳‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_with_turban": {
		"keywords": [
			"male",
			"indian",
			"hinduism",
			"arabs"
		],
		"char": "👳",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"policewoman": {
		"keywords": [
			"woman",
			"police",
			"law",
			"legal",
			"enforcement",
			"arrest",
			"911",
			"female"
		],
		"char": "👮‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"policeman": {
		"keywords": [
			"man",
			"police",
			"law",
			"legal",
			"enforcement",
			"arrest",
			"911"
		],
		"char": "👮",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"construction_worker_woman": {
		"keywords": [
			"female",
			"human",
			"wip",
			"build",
			"construction",
			"worker",
			"labor",
			"woman"
		],
		"char": "👷‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"construction_worker_man": {
		"keywords": [
			"male",
			"human",
			"wip",
			"guy",
			"build",
			"construction",
			"worker",
			"labor"
		],
		"char": "👷",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"guardswoman": {
		"keywords": [
			"uk",
			"gb",
			"british",
			"female",
			"royal",
			"woman"
		],
		"char": "💂‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"guardsman": {
		"keywords": [
			"uk",
			"gb",
			"british",
			"male",
			"guy",
			"royal"
		],
		"char": "💂",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"female_detective": {
		"keywords": [
			"human",
			"spy",
			"detective",
			"female",
			"woman"
		],
		"char": "🕵️‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"male_detective": {
		"keywords": [
			"human",
			"spy",
			"detective"
		],
		"char": "🕵",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"woman_health_worker": {
		"keywords": [
			"doctor",
			"nurse",
			"therapist",
			"healthcare",
			"woman",
			"human"
		],
		"char": "👩‍⚕️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_health_worker": {
		"keywords": [
			"doctor",
			"nurse",
			"therapist",
			"healthcare",
			"man",
			"human"
		],
		"char": "👨‍⚕️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_farmer": {
		"keywords": [
			"rancher",
			"gardener",
			"woman",
			"human"
		],
		"char": "👩‍🌾",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_farmer": {
		"keywords": [
			"rancher",
			"gardener",
			"man",
			"human"
		],
		"char": "👨‍🌾",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_cook": {
		"keywords": [
			"chef",
			"woman",
			"human"
		],
		"char": "👩‍🍳",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_cook": {
		"keywords": [
			"chef",
			"man",
			"human"
		],
		"char": "👨‍🍳",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_student": {
		"keywords": [
			"graduate",
			"woman",
			"human"
		],
		"char": "👩‍🎓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_student": {
		"keywords": [
			"graduate",
			"man",
			"human"
		],
		"char": "👨‍🎓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_singer": {
		"keywords": [
			"rockstar",
			"entertainer",
			"woman",
			"human"
		],
		"char": "👩‍🎤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_singer": {
		"keywords": [
			"rockstar",
			"entertainer",
			"man",
			"human"
		],
		"char": "👨‍🎤",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_teacher": {
		"keywords": [
			"instructor",
			"professor",
			"woman",
			"human"
		],
		"char": "👩‍🏫",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_teacher": {
		"keywords": [
			"instructor",
			"professor",
			"man",
			"human"
		],
		"char": "👨‍🏫",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_factory_worker": {
		"keywords": [
			"assembly",
			"industrial",
			"woman",
			"human"
		],
		"char": "👩‍🏭",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_factory_worker": {
		"keywords": [
			"assembly",
			"industrial",
			"man",
			"human"
		],
		"char": "👨‍🏭",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_technologist": {
		"keywords": [
			"coder",
			"developer",
			"engineer",
			"programmer",
			"software",
			"woman",
			"human"
		],
		"char": "👩‍💻",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_technologist": {
		"keywords": [
			"coder",
			"developer",
			"engineer",
			"programmer",
			"software",
			"man",
			"human"
		],
		"char": "👨‍💻",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_office_worker": {
		"keywords": [
			"business",
			"manager",
			"woman",
			"human"
		],
		"char": "👩‍💼",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_office_worker": {
		"keywords": [
			"business",
			"manager",
			"man",
			"human"
		],
		"char": "👨‍💼",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_mechanic": {
		"keywords": [
			"plumber",
			"woman",
			"human"
		],
		"char": "👩‍🔧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_mechanic": {
		"keywords": [
			"plumber",
			"man",
			"human"
		],
		"char": "👨‍🔧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_scientist": {
		"keywords": [
			"biologist",
			"chemist",
			"engineer",
			"physicist",
			"woman",
			"human"
		],
		"char": "👩‍🔬",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_scientist": {
		"keywords": [
			"biologist",
			"chemist",
			"engineer",
			"physicist",
			"man",
			"human"
		],
		"char": "👨‍🔬",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_artist": {
		"keywords": [
			"painter",
			"woman",
			"human"
		],
		"char": "👩‍🎨",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_artist": {
		"keywords": [
			"painter",
			"man",
			"human"
		],
		"char": "👨‍🎨",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_firefighter": {
		"keywords": [
			"fireman",
			"woman",
			"human"
		],
		"char": "👩‍🚒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_firefighter": {
		"keywords": [
			"fireman",
			"man",
			"human"
		],
		"char": "👨‍🚒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_pilot": {
		"keywords": [
			"aviator",
			"plane",
			"woman",
			"human"
		],
		"char": "👩‍✈️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_pilot": {
		"keywords": [
			"aviator",
			"plane",
			"man",
			"human"
		],
		"char": "👨‍✈️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_astronaut": {
		"keywords": [
			"space",
			"rocket",
			"woman",
			"human"
		],
		"char": "👩‍🚀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_astronaut": {
		"keywords": [
			"space",
			"rocket",
			"man",
			"human"
		],
		"char": "👨‍🚀",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_judge": {
		"keywords": [
			"justice",
			"court",
			"woman",
			"human"
		],
		"char": "👩‍⚖️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"man_judge": {
		"keywords": [
			"justice",
			"court",
			"man",
			"human"
		],
		"char": "👨‍⚖️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"mrs_claus": {
		"keywords": [
			"woman",
			"female",
			"xmas",
			"mother christmas"
		],
		"char": "🤶",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"santa": {
		"keywords": [
			"festival",
			"man",
			"male",
			"xmas",
			"father christmas"
		],
		"char": "🎅",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"angel": {
		"keywords": [
			"heaven",
			"wings",
			"halo"
		],
		"char": "👼",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"pregnant_woman": {
		"keywords": [
			"baby"
		],
		"char": "🤰",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"princess": {
		"keywords": [
			"girl",
			"woman",
			"female",
			"blond",
			"crown",
			"royal",
			"queen"
		],
		"char": "👸",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"prince": {
		"keywords": [
			"boy",
			"man",
			"male",
			"crown",
			"royal",
			"king"
		],
		"char": "🤴",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"bride_with_veil": {
		"keywords": [
			"couple",
			"marriage",
			"wedding",
			"woman",
			"bride"
		],
		"char": "👰",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man_in_tuxedo": {
		"keywords": [
			"couple",
			"marriage",
			"wedding",
			"groom"
		],
		"char": "🤵",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"running_woman": {
		"keywords": [
			"woman",
			"walking",
			"exercise",
			"race",
			"running",
			"female"
		],
		"char": "🏃‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"running_man": {
		"keywords": [
			"man",
			"walking",
			"exercise",
			"race",
			"running"
		],
		"char": "🏃",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"walking_woman": {
		"keywords": [
			"human",
			"feet",
			"steps",
			"woman",
			"female"
		],
		"char": "🚶‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"walking_man": {
		"keywords": [
			"human",
			"feet",
			"steps"
		],
		"char": "🚶",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"dancer": {
		"keywords": [
			"female",
			"girl",
			"woman",
			"fun"
		],
		"char": "💃",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man_dancing": {
		"keywords": [
			"male",
			"boy",
			"fun",
			"dancer"
		],
		"char": "🕺",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"dancing_women": {
		"keywords": [
			"female",
			"bunny",
			"women",
			"girls"
		],
		"char": "👯",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"dancing_men": {
		"keywords": [
			"male",
			"bunny",
			"men",
			"boys"
		],
		"char": "👯‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"couple": {
		"keywords": [
			"pair",
			"people",
			"human",
			"love",
			"date",
			"dating",
			"like",
			"affection",
			"valentines",
			"marriage"
		],
		"char": "👫",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"two_men_holding_hands": {
		"keywords": [
			"pair",
			"couple",
			"love",
			"like",
			"bromance",
			"friendship",
			"people",
			"human"
		],
		"char": "👬",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"two_women_holding_hands": {
		"keywords": [
			"pair",
			"friendship",
			"couple",
			"love",
			"like",
			"female",
			"people",
			"human"
		],
		"char": "👭",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"bowing_woman": {
		"keywords": [
			"woman",
			"female",
			"girl"
		],
		"char": "🙇‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"bowing_man": {
		"keywords": [
			"man",
			"male",
			"boy"
		],
		"char": "🙇",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man_facepalming": {
		"keywords": [
			"man",
			"male",
			"boy",
			"disbelief"
		],
		"char": "🤦",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"woman_facepalming": {
		"keywords": [
			"woman",
			"female",
			"girl",
			"disbelief"
		],
		"char": "🤦‍♀️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"woman_shrugging": {
		"keywords": [
			"woman",
			"female",
			"girl",
			"confused",
			"indifferent",
			"doubt"
		],
		"char": "🤷",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"man_shrugging": {
		"keywords": [
			"man",
			"male",
			"boy",
			"confused",
			"indifferent",
			"doubt"
		],
		"char": "🤷‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"tipping_hand_woman": {
		"keywords": [
			"female",
			"girl",
			"woman",
			"human",
			"information"
		],
		"char": "💁",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"tipping_hand_man": {
		"keywords": [
			"male",
			"boy",
			"man",
			"human",
			"information"
		],
		"char": "💁‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"no_good_woman": {
		"keywords": [
			"female",
			"girl",
			"woman",
			"nope"
		],
		"char": "🙅",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"no_good_man": {
		"keywords": [
			"male",
			"boy",
			"man",
			"nope"
		],
		"char": "🙅‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"ok_woman": {
		"keywords": [
			"women",
			"girl",
			"female",
			"pink",
			"human",
			"woman"
		],
		"char": "🙆",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"ok_man": {
		"keywords": [
			"men",
			"boy",
			"male",
			"blue",
			"human",
			"man"
		],
		"char": "🙆‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"raising_hand_woman": {
		"keywords": [
			"female",
			"girl",
			"woman"
		],
		"char": "🙋",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"raising_hand_man": {
		"keywords": [
			"male",
			"boy",
			"man"
		],
		"char": "🙋‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"pouting_woman": {
		"keywords": [
			"female",
			"girl",
			"woman"
		],
		"char": "🙎",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"pouting_man": {
		"keywords": [
			"male",
			"boy",
			"man"
		],
		"char": "🙎‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"frowning_woman": {
		"keywords": [
			"female",
			"girl",
			"woman",
			"sad",
			"depressed",
			"discouraged",
			"unhappy"
		],
		"char": "🙍",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"frowning_man": {
		"keywords": [
			"male",
			"boy",
			"man",
			"sad",
			"depressed",
			"discouraged",
			"unhappy"
		],
		"char": "🙍‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"haircut_woman": {
		"keywords": [
			"female",
			"girl",
			"woman"
		],
		"char": "💇",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"haircut_man": {
		"keywords": [
			"male",
			"boy",
			"man"
		],
		"char": "💇‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"massage_woman": {
		"keywords": [
			"female",
			"girl",
			"woman",
			"head"
		],
		"char": "💆",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"massage_man": {
		"keywords": [
			"male",
			"boy",
			"man",
			"head"
		],
		"char": "💆‍♂️",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"couple_with_heart_woman_man": {
		"keywords": [
			"pair",
			"love",
			"like",
			"affection",
			"human",
			"dating",
			"valentines",
			"marriage"
		],
		"char": "💑",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"couple_with_heart_woman_woman": {
		"keywords": [
			"pair",
			"love",
			"like",
			"affection",
			"human",
			"dating",
			"valentines",
			"marriage"
		],
		"char": "👩‍❤️‍👩",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"couple_with_heart_man_man": {
		"keywords": [
			"pair",
			"love",
			"like",
			"affection",
			"human",
			"dating",
			"valentines",
			"marriage"
		],
		"char": "👨‍❤️‍👨",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"couplekiss_man_woman": {
		"keywords": [
			"pair",
			"valentines",
			"love",
			"like",
			"dating",
			"marriage"
		],
		"char": "💏",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"couplekiss_woman_woman": {
		"keywords": [
			"pair",
			"valentines",
			"love",
			"like",
			"dating",
			"marriage"
		],
		"char": "👩‍❤️‍💋‍👩",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"couplekiss_man_man": {
		"keywords": [
			"pair",
			"valentines",
			"love",
			"like",
			"dating",
			"marriage"
		],
		"char": "👨‍❤️‍💋‍👨",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_woman_boy": {
		"keywords": [
			"home",
			"parents",
			"child",
			"mom",
			"dad",
			"father",
			"mother",
			"people",
			"human"
		],
		"char": "👪",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"family_man_woman_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"child"
		],
		"char": "👨‍👩‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_woman_girl_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👩‍👧‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_woman_boy_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👩‍👦‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_woman_girl_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👩‍👧‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_woman_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👩‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_woman_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👩‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_woman_girl_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👩‍👧‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_woman_boy_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👩‍👦‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_woman_girl_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👩‍👧‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_man_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👨‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_man_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👨‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_man_girl_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👨‍👧‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_man_boy_boy": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👨‍👦‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_man_girl_girl": {
		"keywords": [
			"home",
			"parents",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👨‍👧‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"child"
		],
		"char": "👩‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_girl": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"child"
		],
		"char": "👩‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_girl_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👧‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_boy_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👦‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_woman_girl_girl": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👩‍👧‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"child"
		],
		"char": "👨‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_girl": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"child"
		],
		"char": "👨‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_girl_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👧‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_boy_boy": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👦‍👦",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"family_man_girl_girl": {
		"keywords": [
			"home",
			"parent",
			"people",
			"human",
			"children"
		],
		"char": "👨‍👧‍👧",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"womans_clothes": {
		"keywords": [
			"fashion",
			"shopping_bags",
			"female"
		],
		"char": "👚",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"tshirt": {
		"keywords": [
			"fashion",
			"cloth",
			"casual",
			"shirt",
			"tee"
		],
		"char": "👕",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"jeans": {
		"keywords": [
			"fashion",
			"shopping"
		],
		"char": "👖",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"necktie": {
		"keywords": [
			"shirt",
			"suitup",
			"formal",
			"fashion",
			"cloth",
			"business"
		],
		"char": "👔",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"dress": {
		"keywords": [
			"clothes",
			"fashion",
			"shopping"
		],
		"char": "👗",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"bikini": {
		"keywords": [
			"swimming",
			"female",
			"woman",
			"girl",
			"fashion",
			"beach",
			"summer"
		],
		"char": "👙",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kimono": {
		"keywords": [
			"dress",
			"fashion",
			"women",
			"female",
			"japanese"
		],
		"char": "👘",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"lipstick": {
		"keywords": [
			"female",
			"girl",
			"fashion",
			"woman"
		],
		"char": "💄",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"kiss": {
		"keywords": [
			"face",
			"lips",
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💋",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"footprints": {
		"keywords": [
			"feet",
			"tracking",
			"walking",
			"beach"
		],
		"char": "👣",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"high_heel": {
		"keywords": [
			"fashion",
			"shoes",
			"female",
			"pumps",
			"stiletto"
		],
		"char": "👠",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"sandal": {
		"keywords": [
			"shoes",
			"fashion",
			"flip flops"
		],
		"char": "👡",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"boot": {
		"keywords": [
			"shoes",
			"fashion"
		],
		"char": "👢",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"mans_shoe": {
		"keywords": [
			"fashion",
			"male"
		],
		"char": "👞",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"athletic_shoe": {
		"keywords": [
			"shoes",
			"sports",
			"sneakers"
		],
		"char": "👟",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"womans_hat": {
		"keywords": [
			"fashion",
			"accessories",
			"female",
			"lady",
			"spring"
		],
		"char": "👒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"tophat": {
		"keywords": [
			"magic",
			"gentleman",
			"classy",
			"circus"
		],
		"char": "🎩",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"rescue_worker_helmet": {
		"keywords": [
			"construction",
			"build"
		],
		"char": "⛑",
		"fitzpatrick_scale": true,
		"category": "people"
	},
	"mortar_board": {
		"keywords": [
			"school",
			"college",
			"degree",
			"university",
			"graduation",
			"cap",
			"hat",
			"legal",
			"learn",
			"education"
		],
		"char": "🎓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"crown": {
		"keywords": [
			"king",
			"kod",
			"leader",
			"royalty",
			"lord"
		],
		"char": "👑",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"school_satchel": {
		"keywords": [
			"student",
			"education",
			"bag",
			"backpack"
		],
		"char": "🎒",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"pouch": {
		"keywords": [
			"bag",
			"accessories",
			"shopping"
		],
		"char": "👝",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"purse": {
		"keywords": [
			"fashion",
			"accessories",
			"money",
			"sales",
			"shopping"
		],
		"char": "👛",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"handbag": {
		"keywords": [
			"fashion",
			"accessory",
			"accessories",
			"shopping"
		],
		"char": "👜",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"briefcase": {
		"keywords": [
			"business",
			"documents",
			"work",
			"law",
			"legal"
		],
		"char": "💼",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"eyeglasses": {
		"keywords": [
			"fashion",
			"accessories",
			"eyesight",
			"nerdy",
			"dork",
			"geek"
		],
		"char": "👓",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"dark_sunglasses": {
		"keywords": [
			"face",
			"cool",
			"accessories"
		],
		"char": "🕶",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"ring": {
		"keywords": [
			"wedding",
			"propose",
			"marriage",
			"valentines",
			"diamond",
			"fashion",
			"jewelry",
			"gem",
			"engagement"
		],
		"char": "💍",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"closed_umbrella": {
		"keywords": [
			"weather",
			"rain",
			"drizzle"
		],
		"char": "🌂",
		"fitzpatrick_scale": false,
		"category": "people"
	},
	"dog": {
		"keywords": [
			"animal",
			"friend",
			"nature",
			"woof",
			"puppy",
			"pet",
			"faithful"
		],
		"char": "🐶",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cat": {
		"keywords": [
			"animal",
			"meow",
			"nature",
			"pet",
			"kitten"
		],
		"char": "🐱",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"mouse": {
		"keywords": [
			"animal",
			"nature",
			"cheese_wedge",
			"rodent"
		],
		"char": "🐭",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"hamster": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐹",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rabbit": {
		"keywords": [
			"animal",
			"nature",
			"pet",
			"spring",
			"magic",
			"bunny"
		],
		"char": "🐰",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"fox_face": {
		"keywords": [
			"animal",
			"nature",
			"face"
		],
		"char": "🦊",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bear": {
		"keywords": [
			"animal",
			"nature",
			"wild"
		],
		"char": "🐻",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"panda_face": {
		"keywords": [
			"animal",
			"nature",
			"panda"
		],
		"char": "🐼",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"koala": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐨",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tiger": {
		"keywords": [
			"animal",
			"cat",
			"danger",
			"wild",
			"nature",
			"roar"
		],
		"char": "🐯",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"lion": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🦁",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cow": {
		"keywords": [
			"beef",
			"ox",
			"animal",
			"nature",
			"moo",
			"milk"
		],
		"char": "🐮",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"pig": {
		"keywords": [
			"animal",
			"oink",
			"nature"
		],
		"char": "🐷",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"pig_nose": {
		"keywords": [
			"animal",
			"oink"
		],
		"char": "🐽",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"frog": {
		"keywords": [
			"animal",
			"nature",
			"croak",
			"toad"
		],
		"char": "🐸",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"squid": {
		"keywords": [
			"animal",
			"nature",
			"ocean",
			"sea"
		],
		"char": "🦑",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"octopus": {
		"keywords": [
			"animal",
			"creature",
			"ocean",
			"sea",
			"nature",
			"beach"
		],
		"char": "🐙",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"shrimp": {
		"keywords": [
			"animal",
			"ocean",
			"nature",
			"seafood"
		],
		"char": "🦐",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"monkey_face": {
		"keywords": [
			"animal",
			"nature",
			"circus"
		],
		"char": "🐵",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"gorilla": {
		"keywords": [
			"animal",
			"nature",
			"circus"
		],
		"char": "🦍",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"see_no_evil": {
		"keywords": [
			"monkey",
			"animal",
			"nature",
			"haha"
		],
		"char": "🙈",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"hear_no_evil": {
		"keywords": [
			"animal",
			"monkey",
			"nature"
		],
		"char": "🙉",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"speak_no_evil": {
		"keywords": [
			"monkey",
			"animal",
			"nature",
			"omg"
		],
		"char": "🙊",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"monkey": {
		"keywords": [
			"animal",
			"nature",
			"banana",
			"circus"
		],
		"char": "🐒",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"chicken": {
		"keywords": [
			"animal",
			"cluck",
			"nature",
			"bird"
		],
		"char": "🐔",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"penguin": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐧",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bird": {
		"keywords": [
			"animal",
			"nature",
			"fly",
			"tweet",
			"spring"
		],
		"char": "🐦",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"baby_chick": {
		"keywords": [
			"animal",
			"chicken",
			"bird"
		],
		"char": "🐤",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"hatching_chick": {
		"keywords": [
			"animal",
			"chicken",
			"egg",
			"born",
			"baby",
			"bird"
		],
		"char": "🐣",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"hatched_chick": {
		"keywords": [
			"animal",
			"chicken",
			"baby",
			"bird"
		],
		"char": "🐥",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"duck": {
		"keywords": [
			"animal",
			"nature",
			"bird",
			"mallard"
		],
		"char": "🦆",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"eagle": {
		"keywords": [
			"animal",
			"nature",
			"bird"
		],
		"char": "🦅",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"owl": {
		"keywords": [
			"animal",
			"nature",
			"bird",
			"hoot"
		],
		"char": "🦉",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bat": {
		"keywords": [
			"animal",
			"nature",
			"blind",
			"vampire"
		],
		"char": "🦇",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"wolf": {
		"keywords": [
			"animal",
			"nature",
			"wild"
		],
		"char": "🐺",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"boar": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐗",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"horse": {
		"keywords": [
			"animal",
			"brown",
			"nature"
		],
		"char": "🐴",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"unicorn": {
		"keywords": [
			"animal",
			"nature",
			"mystical"
		],
		"char": "🦄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"honeybee": {
		"keywords": [
			"animal",
			"insect",
			"nature",
			"bug",
			"spring",
			"honey"
		],
		"char": "🐝",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bug": {
		"keywords": [
			"animal",
			"insect",
			"nature",
			"worm"
		],
		"char": "🐛",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"butterfly": {
		"keywords": [
			"animal",
			"insect",
			"nature",
			"caterpillar"
		],
		"char": "🦋",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"snail": {
		"keywords": [
			"slow",
			"animal",
			"shell"
		],
		"char": "🐌",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"beetle": {
		"keywords": [
			"animal",
			"insect",
			"nature",
			"ladybug"
		],
		"char": "🐞",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"ant": {
		"keywords": [
			"animal",
			"insect",
			"nature",
			"bug"
		],
		"char": "🐜",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"spider": {
		"keywords": [
			"animal",
			"arachnid"
		],
		"char": "🕷",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"scorpion": {
		"keywords": [
			"animal",
			"arachnid"
		],
		"char": "🦂",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"crab": {
		"keywords": [
			"animal",
			"crustacean"
		],
		"char": "🦀",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"snake": {
		"keywords": [
			"animal",
			"evil",
			"nature",
			"hiss",
			"python"
		],
		"char": "🐍",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"lizard": {
		"keywords": [
			"animal",
			"nature",
			"reptile"
		],
		"char": "🦎",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"turtle": {
		"keywords": [
			"animal",
			"slow",
			"nature",
			"tortoise"
		],
		"char": "🐢",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tropical_fish": {
		"keywords": [
			"animal",
			"swim",
			"ocean",
			"beach",
			"nemo"
		],
		"char": "🐠",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"fish": {
		"keywords": [
			"animal",
			"food",
			"nature"
		],
		"char": "🐟",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"blowfish": {
		"keywords": [
			"animal",
			"nature",
			"food",
			"sea",
			"ocean"
		],
		"char": "🐡",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dolphin": {
		"keywords": [
			"animal",
			"nature",
			"fish",
			"sea",
			"ocean",
			"flipper",
			"fins",
			"beach"
		],
		"char": "🐬",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"shark": {
		"keywords": [
			"animal",
			"nature",
			"fish",
			"sea",
			"ocean",
			"jaws",
			"fins",
			"beach"
		],
		"char": "🦈",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"whale": {
		"keywords": [
			"animal",
			"nature",
			"sea",
			"ocean"
		],
		"char": "🐳",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"whale2": {
		"keywords": [
			"animal",
			"nature",
			"sea",
			"ocean"
		],
		"char": "🐋",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"crocodile": {
		"keywords": [
			"animal",
			"nature",
			"reptile",
			"lizard",
			"alligator"
		],
		"char": "🐊",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"leopard": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐆",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tiger2": {
		"keywords": [
			"animal",
			"nature",
			"roar"
		],
		"char": "🐅",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"water_buffalo": {
		"keywords": [
			"animal",
			"nature",
			"ox",
			"cow"
		],
		"char": "🐃",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"ox": {
		"keywords": [
			"animal",
			"cow",
			"beef"
		],
		"char": "🐂",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cow2": {
		"keywords": [
			"beef",
			"ox",
			"animal",
			"nature",
			"moo",
			"milk"
		],
		"char": "🐄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"deer": {
		"keywords": [
			"animal",
			"nature",
			"horns",
			"venison"
		],
		"char": "🦌",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dromedary_camel": {
		"keywords": [
			"animal",
			"hot",
			"desert",
			"hump"
		],
		"char": "🐪",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"camel": {
		"keywords": [
			"animal",
			"nature",
			"hot",
			"desert",
			"hump"
		],
		"char": "🐫",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"elephant": {
		"keywords": [
			"animal",
			"nature",
			"nose",
			"th",
			"circus"
		],
		"char": "🐘",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rhinoceros": {
		"keywords": [
			"animal",
			"nature",
			"horn"
		],
		"char": "🦏",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"goat": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐐",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"ram": {
		"keywords": [
			"animal",
			"sheep",
			"nature"
		],
		"char": "🐏",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sheep": {
		"keywords": [
			"animal",
			"nature",
			"wool",
			"shipit"
		],
		"char": "🐑",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"racehorse": {
		"keywords": [
			"animal",
			"gamble",
			"luck"
		],
		"char": "🐎",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"pig2": {
		"keywords": [
			"animal",
			"nature"
		],
		"char": "🐖",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rat": {
		"keywords": [
			"animal",
			"mouse",
			"rodent"
		],
		"char": "🐀",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"mouse2": {
		"keywords": [
			"animal",
			"nature",
			"rodent"
		],
		"char": "🐁",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rooster": {
		"keywords": [
			"animal",
			"nature",
			"chicken"
		],
		"char": "🐓",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"turkey": {
		"keywords": [
			"animal",
			"bird"
		],
		"char": "🦃",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dove": {
		"keywords": [
			"animal",
			"bird"
		],
		"char": "🕊",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dog2": {
		"keywords": [
			"animal",
			"nature",
			"friend",
			"doge",
			"pet",
			"faithful"
		],
		"char": "🐕",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"poodle": {
		"keywords": [
			"dog",
			"animal",
			"101",
			"nature",
			"pet"
		],
		"char": "🐩",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cat2": {
		"keywords": [
			"animal",
			"meow",
			"pet",
			"cats"
		],
		"char": "🐈",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rabbit2": {
		"keywords": [
			"animal",
			"nature",
			"pet",
			"magic",
			"spring"
		],
		"char": "🐇",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"chipmunk": {
		"keywords": [
			"animal",
			"nature",
			"rodent",
			"squirrel"
		],
		"char": "🐿",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"paw_prints": {
		"keywords": [
			"animal",
			"tracking",
			"footprints",
			"dog",
			"cat",
			"pet",
			"feet"
		],
		"char": "🐾",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dragon": {
		"keywords": [
			"animal",
			"myth",
			"nature",
			"chinese",
			"green"
		],
		"char": "🐉",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dragon_face": {
		"keywords": [
			"animal",
			"myth",
			"nature",
			"chinese",
			"green"
		],
		"char": "🐲",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cactus": {
		"keywords": [
			"vegetable",
			"plant",
			"nature"
		],
		"char": "🌵",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"christmas_tree": {
		"keywords": [
			"festival",
			"vacation",
			"december",
			"xmas",
			"celebration"
		],
		"char": "🎄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"evergreen_tree": {
		"keywords": [
			"plant",
			"nature"
		],
		"char": "🌲",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"deciduous_tree": {
		"keywords": [
			"plant",
			"nature"
		],
		"char": "🌳",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"palm_tree": {
		"keywords": [
			"plant",
			"vegetable",
			"nature",
			"summer",
			"beach",
			"mojito",
			"tropical"
		],
		"char": "🌴",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"seedling": {
		"keywords": [
			"plant",
			"nature",
			"grass",
			"lawn",
			"spring"
		],
		"char": "🌱",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"herb": {
		"keywords": [
			"vegetable",
			"plant",
			"medicine",
			"weed",
			"grass",
			"lawn"
		],
		"char": "🌿",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"shamrock": {
		"keywords": [
			"vegetable",
			"plant",
			"nature",
			"irish",
			"clover"
		],
		"char": "☘",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"four_leaf_clover": {
		"keywords": [
			"vegetable",
			"plant",
			"nature",
			"lucky",
			"irish"
		],
		"char": "🍀",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bamboo": {
		"keywords": [
			"plant",
			"nature",
			"vegetable",
			"panda",
			"pine_decoration"
		],
		"char": "🎍",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tanabata_tree": {
		"keywords": [
			"plant",
			"nature",
			"branch",
			"summer"
		],
		"char": "🎋",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"leaves": {
		"keywords": [
			"nature",
			"plant",
			"tree",
			"vegetable",
			"grass",
			"lawn",
			"spring"
		],
		"char": "🍃",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"fallen_leaf": {
		"keywords": [
			"nature",
			"plant",
			"vegetable",
			"leaves"
		],
		"char": "🍂",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"maple_leaf": {
		"keywords": [
			"nature",
			"plant",
			"vegetable",
			"ca",
			"fall"
		],
		"char": "🍁",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"ear_of_rice": {
		"keywords": [
			"nature",
			"plant"
		],
		"char": "🌾",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"hibiscus": {
		"keywords": [
			"plant",
			"vegetable",
			"flowers",
			"beach"
		],
		"char": "🌺",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sunflower": {
		"keywords": [
			"nature",
			"plant",
			"fall"
		],
		"char": "🌻",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"rose": {
		"keywords": [
			"flowers",
			"valentines",
			"love",
			"spring"
		],
		"char": "🌹",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"wilted_flower": {
		"keywords": [
			"plant",
			"nature",
			"flower"
		],
		"char": "🥀",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tulip": {
		"keywords": [
			"flowers",
			"plant",
			"nature",
			"summer",
			"spring"
		],
		"char": "🌷",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"blossom": {
		"keywords": [
			"nature",
			"flowers",
			"yellow"
		],
		"char": "🌼",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cherry_blossom": {
		"keywords": [
			"nature",
			"plant",
			"spring",
			"flower"
		],
		"char": "🌸",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"bouquet": {
		"keywords": [
			"flowers",
			"nature",
			"spring"
		],
		"char": "💐",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"mushroom": {
		"keywords": [
			"plant",
			"vegetable"
		],
		"char": "🍄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"chestnut": {
		"keywords": [
			"food",
			"squirrel"
		],
		"char": "🌰",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"jack_o_lantern": {
		"keywords": [
			"halloween",
			"light",
			"pumpkin",
			"creepy",
			"fall"
		],
		"char": "🎃",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"shell": {
		"keywords": [
			"nature",
			"sea",
			"beach"
		],
		"char": "🐚",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"spider_web": {
		"keywords": [
			"animal",
			"insect",
			"arachnid",
			"silk"
		],
		"char": "🕸",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"earth_americas": {
		"keywords": [
			"globe",
			"world",
			"USA",
			"international"
		],
		"char": "🌎",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"earth_africa": {
		"keywords": [
			"globe",
			"world",
			"international"
		],
		"char": "🌍",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"earth_asia": {
		"keywords": [
			"globe",
			"world",
			"east",
			"international"
		],
		"char": "🌏",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"full_moon": {
		"keywords": [
			"nature",
			"yellow",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌕",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"waning_gibbous_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep",
			"waxing_gibbous_moon"
		],
		"char": "🌖",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"last_quarter_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌗",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"waning_crescent_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌘",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"new_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌑",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"waxing_crescent_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌒",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"first_quarter_moon": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌓",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"waxing_gibbous_moon": {
		"keywords": [
			"nature",
			"night",
			"sky",
			"gray",
			"twilight",
			"planet",
			"space",
			"evening",
			"sleep"
		],
		"char": "🌔",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"new_moon_with_face": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌚",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"full_moon_with_face": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌝",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"first_quarter_moon_with_face": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌛",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"last_quarter_moon_with_face": {
		"keywords": [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		"char": "🌜",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sun_with_face": {
		"keywords": [
			"nature",
			"morning",
			"sky"
		],
		"char": "🌞",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"crescent_moon": {
		"keywords": [
			"night",
			"sleep",
			"sky",
			"evening",
			"magic"
		],
		"char": "🌙",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"star": {
		"keywords": [
			"night",
			"yellow"
		],
		"char": "⭐",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"star2": {
		"keywords": [
			"night",
			"sparkle",
			"awesome",
			"good",
			"magic"
		],
		"char": "🌟",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dizzy": {
		"keywords": [
			"star",
			"sparkle",
			"shoot",
			"magic"
		],
		"char": "💫",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sparkles": {
		"keywords": [
			"stars",
			"shine",
			"shiny",
			"cool",
			"awesome",
			"good",
			"magic"
		],
		"char": "✨",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"comet": {
		"keywords": [
			"space"
		],
		"char": "☄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sunny": {
		"keywords": [
			"weather",
			"nature",
			"brightness",
			"summer",
			"beach",
			"spring"
		],
		"char": "☀️",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sun_behind_small_cloud": {
		"keywords": [
			"weather"
		],
		"char": "🌤",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"partly_sunny": {
		"keywords": [
			"weather",
			"nature",
			"cloudy",
			"morning",
			"fall",
			"spring"
		],
		"char": "⛅",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sun_behind_large_cloud": {
		"keywords": [
			"weather"
		],
		"char": "🌥",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sun_behind_rain_cloud": {
		"keywords": [
			"weather"
		],
		"char": "🌦",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cloud": {
		"keywords": [
			"weather",
			"sky"
		],
		"char": "☁️",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cloud_with_rain": {
		"keywords": [
			"weather"
		],
		"char": "🌧",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cloud_with_lightning_and_rain": {
		"keywords": [
			"weather",
			"lightning"
		],
		"char": "⛈",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cloud_with_lightning": {
		"keywords": [
			"weather",
			"thunder"
		],
		"char": "🌩",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"zap": {
		"keywords": [
			"thunder",
			"weather",
			"lightning bolt",
			"fast"
		],
		"char": "⚡",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"fire": {
		"keywords": [
			"hot",
			"cook",
			"flame"
		],
		"char": "🔥",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"boom": {
		"keywords": [
			"bomb",
			"explode",
			"explosion",
			"collision",
			"blown"
		],
		"char": "💥",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"snowflake": {
		"keywords": [
			"winter",
			"season",
			"cold",
			"weather",
			"christmas",
			"xmas"
		],
		"char": "❄️",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"cloud_with_snow": {
		"keywords": [
			"weather"
		],
		"char": "🌨",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"snowman": {
		"keywords": [
			"winter",
			"season",
			"cold",
			"weather",
			"christmas",
			"xmas",
			"frozen",
			"without_snow"
		],
		"char": "⛄",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"snowman_with_snow": {
		"keywords": [
			"winter",
			"season",
			"cold",
			"weather",
			"christmas",
			"xmas",
			"frozen"
		],
		"char": "☃",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"wind_face": {
		"keywords": [
			"gust",
			"air"
		],
		"char": "🌬",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"dash": {
		"keywords": [
			"wind",
			"air",
			"fast",
			"shoo",
			"fart",
			"smoke",
			"puff"
		],
		"char": "💨",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"tornado": {
		"keywords": [
			"weather",
			"cyclone",
			"twister"
		],
		"char": "🌪",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"fog": {
		"keywords": [
			"weather"
		],
		"char": "🌫",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"open_umbrella": {
		"keywords": [
			"weather",
			"spring"
		],
		"char": "☂",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"umbrella": {
		"keywords": [
			"rainy",
			"weather",
			"spring"
		],
		"char": "☔",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"droplet": {
		"keywords": [
			"water",
			"drip",
			"faucet",
			"spring"
		],
		"char": "💧",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"sweat_drops": {
		"keywords": [
			"water",
			"drip",
			"oops"
		],
		"char": "💦",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"ocean": {
		"keywords": [
			"sea",
			"water",
			"wave",
			"nature",
			"tsunami",
			"disaster"
		],
		"char": "🌊",
		"fitzpatrick_scale": false,
		"category": "animals_and_nature"
	},
	"green_apple": {
		"keywords": [
			"fruit",
			"nature"
		],
		"char": "🍏",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"apple": {
		"keywords": [
			"fruit",
			"mac",
			"school"
		],
		"char": "🍎",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"pear": {
		"keywords": [
			"fruit",
			"nature",
			"food"
		],
		"char": "🍐",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"tangerine": {
		"keywords": [
			"food",
			"fruit",
			"nature",
			"orange"
		],
		"char": "🍊",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"lemon": {
		"keywords": [
			"fruit",
			"nature"
		],
		"char": "🍋",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"banana": {
		"keywords": [
			"fruit",
			"food",
			"monkey"
		],
		"char": "🍌",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"watermelon": {
		"keywords": [
			"fruit",
			"food",
			"picnic",
			"summer"
		],
		"char": "🍉",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"grapes": {
		"keywords": [
			"fruit",
			"food",
			"wine"
		],
		"char": "🍇",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"strawberry": {
		"keywords": [
			"fruit",
			"food",
			"nature"
		],
		"char": "🍓",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"melon": {
		"keywords": [
			"fruit",
			"nature",
			"food"
		],
		"char": "🍈",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cherries": {
		"keywords": [
			"food",
			"fruit"
		],
		"char": "🍒",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"peach": {
		"keywords": [
			"fruit",
			"nature",
			"food"
		],
		"char": "🍑",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"pineapple": {
		"keywords": [
			"fruit",
			"nature",
			"food"
		],
		"char": "🍍",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"kiwi_fruit": {
		"keywords": [
			"fruit",
			"food"
		],
		"char": "🥝",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"avocado": {
		"keywords": [
			"fruit",
			"food"
		],
		"char": "🥑",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"tomato": {
		"keywords": [
			"fruit",
			"vegetable",
			"nature",
			"food"
		],
		"char": "🍅",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"eggplant": {
		"keywords": [
			"vegetable",
			"nature",
			"food",
			"aubergine"
		],
		"char": "🍆",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cucumber": {
		"keywords": [
			"fruit",
			"food",
			"pickle"
		],
		"char": "🥒",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"carrot": {
		"keywords": [
			"vegetable",
			"food",
			"orange"
		],
		"char": "🥕",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"hot_pepper": {
		"keywords": [
			"food",
			"spicy",
			"chilli",
			"chili"
		],
		"char": "🌶",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"potato": {
		"keywords": [
			"food",
			"tuber",
			"vegatable",
			"starch"
		],
		"char": "🥔",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"corn": {
		"keywords": [
			"food",
			"vegetable",
			"plant"
		],
		"char": "🌽",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"sweet_potato": {
		"keywords": [
			"food",
			"nature"
		],
		"char": "🍠",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"peanuts": {
		"keywords": [
			"food",
			"nut"
		],
		"char": "🥜",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"honey_pot": {
		"keywords": [
			"bees",
			"sweet",
			"kitchen"
		],
		"char": "🍯",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"croissant": {
		"keywords": [
			"food",
			"bread",
			"french"
		],
		"char": "🥐",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"bread": {
		"keywords": [
			"food",
			"wheat",
			"breakfast",
			"toast"
		],
		"char": "🍞",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"baguette_bread": {
		"keywords": [
			"food",
			"bread",
			"french"
		],
		"char": "🥖",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cheese": {
		"keywords": [
			"food",
			"chadder"
		],
		"char": "🧀",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"egg": {
		"keywords": [
			"food",
			"chicken",
			"breakfast"
		],
		"char": "🥚",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"bacon": {
		"keywords": [
			"food",
			"breakfast",
			"pork",
			"pig",
			"meat"
		],
		"char": "🥓",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"pancakes": {
		"keywords": [
			"food",
			"breakfast",
			"flapjacks",
			"hotcakes"
		],
		"char": "🥞",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"poultry_leg": {
		"keywords": [
			"food",
			"meat",
			"drumstick",
			"bird",
			"chicken",
			"turkey"
		],
		"char": "🍗",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"meat_on_bone": {
		"keywords": [
			"good",
			"food",
			"drumstick"
		],
		"char": "🍖",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"fried_shrimp": {
		"keywords": [
			"food",
			"animal",
			"appetizer",
			"summer"
		],
		"char": "🍤",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"fried_egg": {
		"keywords": [
			"food",
			"breakfast",
			"kitchen",
			"egg"
		],
		"char": "🍳",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"hamburger": {
		"keywords": [
			"meat",
			"fast food",
			"beef",
			"cheeseburger",
			"mcdonalds",
			"burger king"
		],
		"char": "🍔",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"fries": {
		"keywords": [
			"chips",
			"snack",
			"fast food"
		],
		"char": "🍟",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"stuffed_flatbread": {
		"keywords": [
			"food",
			"flatbread",
			"stuffed",
			"gyro"
		],
		"char": "🥙",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"hotdog": {
		"keywords": [
			"food",
			"frankfurter"
		],
		"char": "🌭",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"pizza": {
		"keywords": [
			"food",
			"party"
		],
		"char": "🍕",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"spaghetti": {
		"keywords": [
			"food",
			"italian",
			"noodle"
		],
		"char": "🍝",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"taco": {
		"keywords": [
			"food",
			"mexican"
		],
		"char": "🌮",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"burrito": {
		"keywords": [
			"food",
			"mexican"
		],
		"char": "🌯",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"green_salad": {
		"keywords": [
			"food",
			"healthy",
			"lettuce"
		],
		"char": "🥗",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"shallow_pan_of_food": {
		"keywords": [
			"food",
			"cooking",
			"casserole",
			"paella"
		],
		"char": "🥘",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"ramen": {
		"keywords": [
			"food",
			"japanese",
			"noodle",
			"chopsticks"
		],
		"char": "🍜",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"stew": {
		"keywords": [
			"food",
			"meat",
			"soup"
		],
		"char": "🍲",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"fish_cake": {
		"keywords": [
			"food",
			"japan",
			"sea",
			"beach"
		],
		"char": "🍥",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"sushi": {
		"keywords": [
			"food",
			"fish",
			"japanese",
			"rice"
		],
		"char": "🍣",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"bento": {
		"keywords": [
			"food",
			"japanese",
			"box"
		],
		"char": "🍱",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"curry": {
		"keywords": [
			"food",
			"spicy",
			"hot",
			"indian"
		],
		"char": "🍛",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"rice_ball": {
		"keywords": [
			"food",
			"japanese"
		],
		"char": "🍙",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"rice": {
		"keywords": [
			"food",
			"china",
			"asian"
		],
		"char": "🍚",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"rice_cracker": {
		"keywords": [
			"food",
			"japanese"
		],
		"char": "🍘",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"oden": {
		"keywords": [
			"food",
			"japanese"
		],
		"char": "🍢",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"dango": {
		"keywords": [
			"food",
			"dessert",
			"sweet",
			"japanese",
			"barbecue",
			"meat"
		],
		"char": "🍡",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"shaved_ice": {
		"keywords": [
			"hot",
			"dessert",
			"summer"
		],
		"char": "🍧",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"ice_cream": {
		"keywords": [
			"food",
			"hot",
			"dessert"
		],
		"char": "🍨",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"icecream": {
		"keywords": [
			"food",
			"hot",
			"dessert",
			"summer"
		],
		"char": "🍦",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cake": {
		"keywords": [
			"food",
			"dessert"
		],
		"char": "🍰",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"birthday": {
		"keywords": [
			"food",
			"dessert",
			"cake"
		],
		"char": "🎂",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"custard": {
		"keywords": [
			"dessert",
			"food"
		],
		"char": "🍮",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"candy": {
		"keywords": [
			"snack",
			"dessert",
			"sweet",
			"lolly"
		],
		"char": "🍬",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"lollipop": {
		"keywords": [
			"food",
			"snack",
			"candy",
			"sweet"
		],
		"char": "🍭",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"chocolate_bar": {
		"keywords": [
			"food",
			"snack",
			"dessert",
			"sweet"
		],
		"char": "🍫",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"popcorn": {
		"keywords": [
			"food",
			"movie theater",
			"films",
			"snack"
		],
		"char": "🍿",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"doughnut": {
		"keywords": [
			"food",
			"dessert",
			"snack",
			"sweet",
			"donut"
		],
		"char": "🍩",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cookie": {
		"keywords": [
			"food",
			"snack",
			"oreo",
			"chocolate",
			"sweet",
			"dessert"
		],
		"char": "🍪",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"milk_glass": {
		"keywords": [
			"beverage",
			"drink",
			"cow"
		],
		"char": "🥛",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"beer": {
		"keywords": [
			"relax",
			"beverage",
			"drink",
			"drunk",
			"party",
			"pub",
			"summer",
			"alcohol",
			"booze"
		],
		"char": "🍺",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"beers": {
		"keywords": [
			"relax",
			"beverage",
			"drink",
			"drunk",
			"party",
			"pub",
			"summer",
			"alcohol",
			"booze"
		],
		"char": "🍻",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"clinking_glasses": {
		"keywords": [
			"beverage",
			"drink",
			"party",
			"alcohol",
			"celebrate",
			"cheers"
		],
		"char": "🥂",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"wine_glass": {
		"keywords": [
			"drink",
			"beverage",
			"drunk",
			"alcohol",
			"booze"
		],
		"char": "🍷",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"tumbler_glass": {
		"keywords": [
			"drink",
			"beverage",
			"drunk",
			"alcohol",
			"liquor",
			"booze",
			"bourbon",
			"scotch",
			"whisky",
			"glass",
			"shot"
		],
		"char": "🥃",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"cocktail": {
		"keywords": [
			"drink",
			"drunk",
			"alcohol",
			"beverage",
			"booze",
			"mojito"
		],
		"char": "🍸",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"tropical_drink": {
		"keywords": [
			"beverage",
			"cocktail",
			"summer",
			"beach",
			"alcohol",
			"booze",
			"mojito"
		],
		"char": "🍹",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"champagne": {
		"keywords": [
			"drink",
			"wine",
			"bottle",
			"celebration"
		],
		"char": "🍾",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"sake": {
		"keywords": [
			"wine",
			"drink",
			"drunk",
			"beverage",
			"japanese",
			"alcohol",
			"booze"
		],
		"char": "🍶",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"tea": {
		"keywords": [
			"drink",
			"bowl",
			"breakfast",
			"green",
			"british"
		],
		"char": "🍵",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"coffee": {
		"keywords": [
			"beverage",
			"caffeine",
			"latte",
			"espresso"
		],
		"char": "☕",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"baby_bottle": {
		"keywords": [
			"food",
			"container",
			"milk"
		],
		"char": "🍼",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"spoon": {
		"keywords": [
			"cutlery",
			"kitchen",
			"tableware"
		],
		"char": "🥄",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"fork_and_knife": {
		"keywords": [
			"cutlery",
			"kitchen"
		],
		"char": "🍴",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"plate_with_cutlery": {
		"keywords": [
			"food",
			"eat",
			"meal",
			"lunch",
			"dinner",
			"restaurant"
		],
		"char": "🍽",
		"fitzpatrick_scale": false,
		"category": "food_and_drink"
	},
	"soccer": {
		"keywords": [
			"sports",
			"football"
		],
		"char": "⚽",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"basketball": {
		"keywords": [
			"sports",
			"balls",
			"NBA"
		],
		"char": "🏀",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"football": {
		"keywords": [
			"sports",
			"balls",
			"NFL"
		],
		"char": "🏈",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"baseball": {
		"keywords": [
			"sports",
			"balls"
		],
		"char": "⚾",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"tennis": {
		"keywords": [
			"sports",
			"balls",
			"green"
		],
		"char": "🎾",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"volleyball": {
		"keywords": [
			"sports",
			"balls"
		],
		"char": "🏐",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"rugby_football": {
		"keywords": [
			"sports",
			"team"
		],
		"char": "🏉",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"8ball": {
		"keywords": [
			"pool",
			"hobby",
			"game",
			"luck",
			"magic"
		],
		"char": "🎱",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"golf": {
		"keywords": [
			"sports",
			"business",
			"flag",
			"hole",
			"summer"
		],
		"char": "⛳",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"golfing_woman": {
		"keywords": [
			"sports",
			"business",
			"woman",
			"female"
		],
		"char": "🏌️‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"golfing_man": {
		"keywords": [
			"sports",
			"business"
		],
		"char": "🏌",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"ping_pong": {
		"keywords": [
			"sports",
			"pingpong"
		],
		"char": "🏓",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"badminton": {
		"keywords": [
			"sports"
		],
		"char": "🏸",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"goal_net": {
		"keywords": [
			"sports"
		],
		"char": "🥅",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"ice_hockey": {
		"keywords": [
			"sports"
		],
		"char": "🏒",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"field_hockey": {
		"keywords": [
			"sports"
		],
		"char": "🏑",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"cricket": {
		"keywords": [
			"sports"
		],
		"char": "🏏",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"ski": {
		"keywords": [
			"sports",
			"winter",
			"cold",
			"snow"
		],
		"char": "🎿",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"skier": {
		"keywords": [
			"sports",
			"winter",
			"snow"
		],
		"char": "⛷",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"snowboarder": {
		"keywords": [
			"sports",
			"winter"
		],
		"char": "🏂",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"person_fencing": {
		"keywords": [
			"sports",
			"fencing",
			"sword"
		],
		"char": "🤺",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"women_wrestling": {
		"keywords": [
			"sports",
			"wrestlers"
		],
		"char": "🤼‍♀️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"men_wrestling": {
		"keywords": [
			"sports",
			"wrestlers"
		],
		"char": "🤼‍♂️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"woman_cartwheeling": {
		"keywords": [
			"gymnastics"
		],
		"char": "🤸‍♀️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"man_cartwheeling": {
		"keywords": [
			"gymnastics"
		],
		"char": "🤸‍♂️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"woman_playing_handball": {
		"keywords": [
			"sports"
		],
		"char": "🤾‍♀️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"man_playing_handball": {
		"keywords": [
			"sports"
		],
		"char": "🤾‍♂️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"ice_skate": {
		"keywords": [
			"sports"
		],
		"char": "⛸",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"bow_and_arrow": {
		"keywords": [
			"sports"
		],
		"char": "🏹",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"fishing_pole_and_fish": {
		"keywords": [
			"food",
			"hobby",
			"summer"
		],
		"char": "🎣",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"boxing_glove": {
		"keywords": [
			"sports",
			"fighting"
		],
		"char": "🥊",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"martial_arts_uniform": {
		"keywords": [
			"judo",
			"karate",
			"taekwondo"
		],
		"char": "🥋",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"rowing_woman": {
		"keywords": [
			"sports",
			"hobby",
			"water",
			"ship",
			"woman",
			"female"
		],
		"char": "🚣‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"rowing_man": {
		"keywords": [
			"sports",
			"hobby",
			"water",
			"ship"
		],
		"char": "🚣",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"swimming_woman": {
		"keywords": [
			"sports",
			"exercise",
			"human",
			"athlete",
			"water",
			"summer",
			"woman",
			"female"
		],
		"char": "🏊‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"swimming_man": {
		"keywords": [
			"sports",
			"exercise",
			"human",
			"athlete",
			"water",
			"summer"
		],
		"char": "🏊",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"woman_playing_water_polo": {
		"keywords": [
			"sports",
			"pool"
		],
		"char": "🤽‍♀️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"man_playing_water_polo": {
		"keywords": [
			"sports",
			"pool"
		],
		"char": "🤽‍♂️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"surfing_woman": {
		"keywords": [
			"sports",
			"ocean",
			"sea",
			"summer",
			"beach",
			"woman",
			"female"
		],
		"char": "🏄‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"surfing_man": {
		"keywords": [
			"sports",
			"ocean",
			"sea",
			"summer",
			"beach"
		],
		"char": "🏄",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"bath": {
		"keywords": [
			"clean",
			"shower",
			"bathroom"
		],
		"char": "🛀",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"basketball_woman": {
		"keywords": [
			"sports",
			"human",
			"woman",
			"female"
		],
		"char": "⛹️‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"basketball_man": {
		"keywords": [
			"sports",
			"human"
		],
		"char": "⛹",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"weight_lifting_woman": {
		"keywords": [
			"sports",
			"training",
			"exercise",
			"woman",
			"female"
		],
		"char": "🏋️‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"weight_lifting_man": {
		"keywords": [
			"sports",
			"training",
			"exercise"
		],
		"char": "🏋",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"biking_woman": {
		"keywords": [
			"sports",
			"bike",
			"exercise",
			"hipster",
			"woman",
			"female"
		],
		"char": "🚴‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"biking_man": {
		"keywords": [
			"sports",
			"bike",
			"exercise",
			"hipster"
		],
		"char": "🚴",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"mountain_biking_woman": {
		"keywords": [
			"transportation",
			"sports",
			"human",
			"race",
			"bike",
			"woman",
			"female"
		],
		"char": "🚵‍♀️",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"mountain_biking_man": {
		"keywords": [
			"transportation",
			"sports",
			"human",
			"race",
			"bike"
		],
		"char": "🚵",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"horse_racing": {
		"keywords": [
			"animal",
			"betting",
			"competition",
			"gambling",
			"luck"
		],
		"char": "🏇",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"business_suit_levitating": {
		"keywords": [
			"suit",
			"business",
			"levitate",
			"hover",
			"jump"
		],
		"char": "🕴",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"trophy": {
		"keywords": [
			"win",
			"award",
			"contest",
			"place",
			"ftw",
			"ceremony"
		],
		"char": "🏆",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"running_shirt_with_sash": {
		"keywords": [
			"play",
			"pageant"
		],
		"char": "🎽",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"medal_sports": {
		"keywords": [
			"award",
			"winning"
		],
		"char": "🏅",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"medal_military": {
		"keywords": [
			"award",
			"winning",
			"army"
		],
		"char": "🎖",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"1st_place_medal": {
		"keywords": [
			"award",
			"winning",
			"first"
		],
		"char": "🥇",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"2nd_place_medal": {
		"keywords": [
			"award",
			"second"
		],
		"char": "🥈",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"3rd_place_medal": {
		"keywords": [
			"award",
			"third"
		],
		"char": "🥉",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"reminder_ribbon": {
		"keywords": [
			"sports",
			"cause",
			"support",
			"awareness"
		],
		"char": "🎗",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"rosette": {
		"keywords": [
			"flower",
			"decoration",
			"military"
		],
		"char": "🏵",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"ticket": {
		"keywords": [
			"event",
			"concert",
			"pass"
		],
		"char": "🎫",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"tickets": {
		"keywords": [
			"sports",
			"concert",
			"entrance"
		],
		"char": "🎟",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"performing_arts": {
		"keywords": [
			"acting",
			"theater",
			"drama"
		],
		"char": "🎭",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"art": {
		"keywords": [
			"design",
			"paint",
			"draw",
			"colors"
		],
		"char": "🎨",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"circus_tent": {
		"keywords": [
			"festival",
			"carnival",
			"party"
		],
		"char": "🎪",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"woman_juggling": {
		"keywords": [
			"juggle",
			"balance",
			"skill",
			"multitask"
		],
		"char": "🤹‍♀️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"man_juggling": {
		"keywords": [
			"juggle",
			"balance",
			"skill",
			"multitask"
		],
		"char": "🤹‍♂️",
		"fitzpatrick_scale": true,
		"category": "activity"
	},
	"microphone": {
		"keywords": [
			"sound",
			"music",
			"PA"
		],
		"char": "🎤",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"headphones": {
		"keywords": [
			"music",
			"score",
			"gadgets"
		],
		"char": "🎧",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"musical_score": {
		"keywords": [
			"treble",
			"clef"
		],
		"char": "🎼",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"musical_keyboard": {
		"keywords": [
			"piano",
			"instrument"
		],
		"char": "🎹",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"drum": {
		"keywords": [
			"music",
			"instrument",
			"drumsticks"
		],
		"char": "🥁",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"saxophone": {
		"keywords": [
			"music",
			"instrument",
			"jazz",
			"blues"
		],
		"char": "🎷",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"trumpet": {
		"keywords": [
			"music",
			"brass"
		],
		"char": "🎺",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"guitar": {
		"keywords": [
			"music",
			"instrument"
		],
		"char": "🎸",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"violin": {
		"keywords": [
			"music",
			"instrument",
			"orchestra",
			"symphony"
		],
		"char": "🎻",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"clapper": {
		"keywords": [
			"movie",
			"film",
			"record"
		],
		"char": "🎬",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"video_game": {
		"keywords": [
			"play",
			"console",
			"PS4",
			"controller"
		],
		"char": "🎮",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"space_invader": {
		"keywords": [
			"game",
			"arcade",
			"play"
		],
		"char": "👾",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"dart": {
		"keywords": [
			"game",
			"play",
			"bar"
		],
		"char": "🎯",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"game_die": {
		"keywords": [
			"dice",
			"random",
			"tabletop",
			"play",
			"luck"
		],
		"char": "🎲",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"slot_machine": {
		"keywords": [
			"bet",
			"gamble",
			"vegas",
			"fruit machine",
			"luck",
			"casino"
		],
		"char": "🎰",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"bowling": {
		"keywords": [
			"sports",
			"fun",
			"play"
		],
		"char": "🎳",
		"fitzpatrick_scale": false,
		"category": "activity"
	},
	"red_car": {
		"keywords": [
			"red",
			"transportation",
			"vehicle"
		],
		"char": "🚗",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"taxi": {
		"keywords": [
			"uber",
			"vehicle",
			"cars",
			"transportation"
		],
		"char": "🚕",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"blue_car": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚙",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bus": {
		"keywords": [
			"car",
			"vehicle",
			"transportation"
		],
		"char": "🚌",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"trolleybus": {
		"keywords": [
			"bart",
			"transportation",
			"vehicle"
		],
		"char": "🚎",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"racing_car": {
		"keywords": [
			"sports",
			"race",
			"fast",
			"formula",
			"f1"
		],
		"char": "🏎",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"police_car": {
		"keywords": [
			"vehicle",
			"cars",
			"transportation",
			"law",
			"legal",
			"enforcement"
		],
		"char": "🚓",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"ambulance": {
		"keywords": [
			"health",
			"911",
			"hospital"
		],
		"char": "🚑",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"fire_engine": {
		"keywords": [
			"transportation",
			"cars",
			"vehicle"
		],
		"char": "🚒",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"minibus": {
		"keywords": [
			"vehicle",
			"car",
			"transportation"
		],
		"char": "🚐",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"truck": {
		"keywords": [
			"cars",
			"transportation"
		],
		"char": "🚚",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"articulated_lorry": {
		"keywords": [
			"vehicle",
			"cars",
			"transportation",
			"express"
		],
		"char": "🚛",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"tractor": {
		"keywords": [
			"vehicle",
			"car",
			"farming",
			"agriculture"
		],
		"char": "🚜",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"kick_scooter": {
		"keywords": [
			"vehicle",
			"kick",
			"razor"
		],
		"char": "🛴",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"motorcycle": {
		"keywords": [
			"race",
			"sports",
			"fast"
		],
		"char": "🏍",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bike": {
		"keywords": [
			"sports",
			"bicycle",
			"exercise",
			"hipster"
		],
		"char": "🚲",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"motor_scooter": {
		"keywords": [
			"vehicle",
			"vespa",
			"sasha"
		],
		"char": "🛵",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"rotating_light": {
		"keywords": [
			"police",
			"ambulance",
			"911",
			"emergency",
			"alert",
			"error",
			"pinged",
			"law",
			"legal"
		],
		"char": "🚨",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"oncoming_police_car": {
		"keywords": [
			"vehicle",
			"law",
			"legal",
			"enforcement",
			"911"
		],
		"char": "🚔",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"oncoming_bus": {
		"keywords": [
			"vehicle",
			"transportation"
		],
		"char": "🚍",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"oncoming_automobile": {
		"keywords": [
			"car",
			"vehicle",
			"transportation"
		],
		"char": "🚘",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"oncoming_taxi": {
		"keywords": [
			"vehicle",
			"cars",
			"uber"
		],
		"char": "🚖",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"aerial_tramway": {
		"keywords": [
			"transportation",
			"vehicle",
			"ski"
		],
		"char": "🚡",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mountain_cableway": {
		"keywords": [
			"transportation",
			"vehicle",
			"ski"
		],
		"char": "🚠",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"suspension_railway": {
		"keywords": [
			"vehicle",
			"transportation"
		],
		"char": "🚟",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"railway_car": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚃",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"train": {
		"keywords": [
			"transportation",
			"vehicle",
			"carriage",
			"public",
			"travel"
		],
		"char": "🚋",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"monorail": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚝",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bullettrain_side": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚄",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bullettrain_front": {
		"keywords": [
			"transportation",
			"vehicle",
			"speed",
			"fast",
			"public",
			"travel"
		],
		"char": "🚅",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"light_rail": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚈",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mountain_railway": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚞",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"steam_locomotive": {
		"keywords": [
			"transportation",
			"vehicle",
			"train"
		],
		"char": "🚂",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"train2": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚆",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"metro": {
		"keywords": [
			"transportation",
			"blue-square",
			"mrt",
			"underground",
			"tube"
		],
		"char": "🚇",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"tram": {
		"keywords": [
			"transportation",
			"vehicle"
		],
		"char": "🚊",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"station": {
		"keywords": [
			"transportation",
			"vehicle",
			"public"
		],
		"char": "🚉",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"helicopter": {
		"keywords": [
			"transportation",
			"vehicle",
			"fly"
		],
		"char": "🚁",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"small_airplane": {
		"keywords": [
			"flight",
			"transportation",
			"fly",
			"vehicle"
		],
		"char": "🛩",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"airplane": {
		"keywords": [
			"vehicle",
			"transportation",
			"flight",
			"fly"
		],
		"char": "✈️",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"flight_departure": {
		"keywords": [
			"airport",
			"flight",
			"landing"
		],
		"char": "🛫",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"flight_arrival": {
		"keywords": [
			"airport",
			"flight",
			"boarding"
		],
		"char": "🛬",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"sailboat": {
		"keywords": [
			"ship",
			"summer",
			"transportation",
			"water",
			"sailing"
		],
		"char": "⛵",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"motor_boat": {
		"keywords": [
			"ship"
		],
		"char": "🛥",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"speedboat": {
		"keywords": [
			"ship",
			"transportation",
			"vehicle",
			"summer"
		],
		"char": "🚤",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"ferry": {
		"keywords": [
			"boat",
			"ship",
			"yacht"
		],
		"char": "⛴",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"passenger_ship": {
		"keywords": [
			"yacht",
			"cruise",
			"ferry"
		],
		"char": "🛳",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"rocket": {
		"keywords": [
			"launch",
			"ship",
			"staffmode",
			"NASA",
			"outer space",
			"outer_space",
			"fly"
		],
		"char": "🚀",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"artificial_satellite": {
		"keywords": [
			"communication",
			"gps",
			"orbit",
			"spaceflight",
			"NASA",
			"ISS"
		],
		"char": "🛰",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"seat": {
		"keywords": [
			"sit",
			"airplane",
			"transport",
			"bus",
			"flight",
			"fly"
		],
		"char": "💺",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"canoe": {
		"keywords": [
			"boat",
			"paddle",
			"water",
			"ship"
		],
		"char": "🛶",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"anchor": {
		"keywords": [
			"ship",
			"ferry",
			"sea",
			"boat"
		],
		"char": "⚓",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"construction": {
		"keywords": [
			"wip",
			"progress",
			"caution",
			"warning"
		],
		"char": "🚧",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"fuelpump": {
		"keywords": [
			"gas station",
			"petroleum"
		],
		"char": "⛽",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"busstop": {
		"keywords": [
			"transportation",
			"wait"
		],
		"char": "🚏",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"vertical_traffic_light": {
		"keywords": [
			"transportation",
			"driving"
		],
		"char": "🚦",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"traffic_light": {
		"keywords": [
			"transportation",
			"signal"
		],
		"char": "🚥",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"checkered_flag": {
		"keywords": [
			"contest",
			"finishline",
			"race",
			"gokart"
		],
		"char": "🏁",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"ship": {
		"keywords": [
			"transportation",
			"titanic",
			"deploy"
		],
		"char": "🚢",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"ferris_wheel": {
		"keywords": [
			"photo",
			"carnival",
			"londoneye"
		],
		"char": "🎡",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"roller_coaster": {
		"keywords": [
			"carnival",
			"playground",
			"photo",
			"fun"
		],
		"char": "🎢",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"carousel_horse": {
		"keywords": [
			"photo",
			"carnival"
		],
		"char": "🎠",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"building_construction": {
		"keywords": [
			"wip",
			"working",
			"progress"
		],
		"char": "🏗",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"foggy": {
		"keywords": [
			"photo",
			"mountain"
		],
		"char": "🌁",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"tokyo_tower": {
		"keywords": [
			"photo",
			"japanese"
		],
		"char": "🗼",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"factory": {
		"keywords": [
			"building",
			"industry",
			"pollution",
			"smoke"
		],
		"char": "🏭",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"fountain": {
		"keywords": [
			"photo",
			"summer",
			"water",
			"fresh"
		],
		"char": "⛲",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"rice_scene": {
		"keywords": [
			"photo",
			"japan",
			"asia",
			"tsukimi"
		],
		"char": "🎑",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mountain": {
		"keywords": [
			"photo",
			"nature",
			"environment"
		],
		"char": "⛰",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mountain_snow": {
		"keywords": [
			"photo",
			"nature",
			"environment",
			"winter",
			"cold"
		],
		"char": "🏔",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mount_fuji": {
		"keywords": [
			"photo",
			"mountain",
			"nature",
			"japanese"
		],
		"char": "🗻",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"volcano": {
		"keywords": [
			"photo",
			"nature",
			"disaster"
		],
		"char": "🌋",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"japan": {
		"keywords": [
			"nation",
			"country",
			"japanese",
			"asia"
		],
		"char": "🗾",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"camping": {
		"keywords": [
			"photo",
			"outdoors",
			"tent"
		],
		"char": "🏕",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"tent": {
		"keywords": [
			"photo",
			"camping",
			"outdoors"
		],
		"char": "⛺",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"national_park": {
		"keywords": [
			"photo",
			"environment",
			"nature"
		],
		"char": "🏞",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"motorway": {
		"keywords": [
			"road",
			"cupertino",
			"interstate",
			"highway"
		],
		"char": "🛣",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"railway_track": {
		"keywords": [
			"train",
			"transportation"
		],
		"char": "🛤",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"sunrise": {
		"keywords": [
			"morning",
			"view",
			"vacation",
			"photo"
		],
		"char": "🌅",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"sunrise_over_mountains": {
		"keywords": [
			"view",
			"vacation",
			"photo"
		],
		"char": "🌄",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"desert": {
		"keywords": [
			"photo",
			"warm",
			"saharah"
		],
		"char": "🏜",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"beach_umbrella": {
		"keywords": [
			"weather",
			"summer",
			"sunny",
			"sand",
			"mojito"
		],
		"char": "🏖",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"desert_island": {
		"keywords": [
			"photo",
			"tropical",
			"mojito"
		],
		"char": "🏝",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"city_sunrise": {
		"keywords": [
			"photo",
			"good morning",
			"dawn"
		],
		"char": "🌇",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"city_sunset": {
		"keywords": [
			"photo",
			"evening",
			"sky",
			"buildings"
		],
		"char": "🌆",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"cityscape": {
		"keywords": [
			"photo",
			"night life",
			"urban"
		],
		"char": "🏙",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"night_with_stars": {
		"keywords": [
			"evening",
			"city",
			"downtown"
		],
		"char": "🌃",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bridge_at_night": {
		"keywords": [
			"photo",
			"sanfrancisco"
		],
		"char": "🌉",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"milky_way": {
		"keywords": [
			"photo",
			"space",
			"stars"
		],
		"char": "🌌",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"stars": {
		"keywords": [
			"night",
			"photo"
		],
		"char": "🌠",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"sparkler": {
		"keywords": [
			"stars",
			"night",
			"shine"
		],
		"char": "🎇",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"fireworks": {
		"keywords": [
			"photo",
			"festival",
			"carnival",
			"congratulations"
		],
		"char": "🎆",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"rainbow": {
		"keywords": [
			"nature",
			"happy",
			"unicorn_face",
			"photo",
			"sky",
			"spring"
		],
		"char": "🌈",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"houses": {
		"keywords": [
			"buildings",
			"photo"
		],
		"char": "🏘",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"european_castle": {
		"keywords": [
			"building",
			"royalty",
			"history"
		],
		"char": "🏰",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"japanese_castle": {
		"keywords": [
			"photo",
			"building"
		],
		"char": "🏯",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"stadium": {
		"keywords": [
			"photo",
			"place",
			"sports",
			"concert",
			"venue"
		],
		"char": "🏟",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"statue_of_liberty": {
		"keywords": [
			"american",
			"newyork"
		],
		"char": "🗽",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"house": {
		"keywords": [
			"building",
			"home"
		],
		"char": "🏠",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"house_with_garden": {
		"keywords": [
			"home",
			"plant",
			"nature"
		],
		"char": "🏡",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"derelict_house": {
		"keywords": [
			"abandon",
			"evict",
			"broken",
			"building"
		],
		"char": "🏚",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"office": {
		"keywords": [
			"building",
			"bureau",
			"work"
		],
		"char": "🏢",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"department_store": {
		"keywords": [
			"building",
			"shopping",
			"mall"
		],
		"char": "🏬",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"post_office": {
		"keywords": [
			"building",
			"envelope",
			"communication"
		],
		"char": "🏣",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"european_post_office": {
		"keywords": [
			"building",
			"email"
		],
		"char": "🏤",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"hospital": {
		"keywords": [
			"building",
			"health",
			"surgery",
			"doctor"
		],
		"char": "🏥",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"bank": {
		"keywords": [
			"building",
			"money",
			"sales",
			"cash",
			"business",
			"enterprise"
		],
		"char": "🏦",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"hotel": {
		"keywords": [
			"building",
			"accomodation",
			"checkin"
		],
		"char": "🏨",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"convenience_store": {
		"keywords": [
			"building",
			"shopping",
			"groceries"
		],
		"char": "🏪",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"school": {
		"keywords": [
			"building",
			"student",
			"education",
			"learn",
			"teach"
		],
		"char": "🏫",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"love_hotel": {
		"keywords": [
			"like",
			"affection",
			"dating"
		],
		"char": "🏩",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"wedding": {
		"keywords": [
			"love",
			"like",
			"affection",
			"couple",
			"marriage",
			"bride",
			"groom"
		],
		"char": "💒",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"classical_building": {
		"keywords": [
			"art",
			"culture",
			"history"
		],
		"char": "🏛",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"church": {
		"keywords": [
			"building",
			"religion",
			"christ"
		],
		"char": "⛪",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"mosque": {
		"keywords": [
			"islam",
			"worship",
			"minaret"
		],
		"char": "🕌",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"synagogue": {
		"keywords": [
			"judaism",
			"worship",
			"temple",
			"jewish"
		],
		"char": "🕍",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"kaaba": {
		"keywords": [
			"mecca",
			"mosque",
			"islam"
		],
		"char": "🕋",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"shinto_shrine": {
		"keywords": [
			"temple",
			"japan",
			"kyoto"
		],
		"char": "⛩",
		"fitzpatrick_scale": false,
		"category": "travel_and_places"
	},
	"watch": {
		"keywords": [
			"time",
			"accessories"
		],
		"char": "⌚",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"iphone": {
		"keywords": [
			"technology",
			"apple",
			"gadgets",
			"dial"
		],
		"char": "📱",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"calling": {
		"keywords": [
			"iphone",
			"incoming"
		],
		"char": "📲",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"computer": {
		"keywords": [
			"technology",
			"laptop",
			"screen",
			"display",
			"monitor"
		],
		"char": "💻",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"keyboard": {
		"keywords": [
			"technology",
			"computer",
			"type",
			"input",
			"text"
		],
		"char": "⌨",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"desktop_computer": {
		"keywords": [
			"technology",
			"computing",
			"screen"
		],
		"char": "🖥",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"printer": {
		"keywords": [
			"paper",
			"ink"
		],
		"char": "🖨",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"computer_mouse": {
		"keywords": [
			"click"
		],
		"char": "🖱",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"trackball": {
		"keywords": [
			"technology",
			"trackpad"
		],
		"char": "🖲",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"joystick": {
		"keywords": [
			"game",
			"play"
		],
		"char": "🕹",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"clamp": {
		"keywords": [
			"tool"
		],
		"char": "🗜",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"minidisc": {
		"keywords": [
			"technology",
			"record",
			"data",
			"disk",
			"90s"
		],
		"char": "💽",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"floppy_disk": {
		"keywords": [
			"oldschool",
			"technology",
			"save",
			"90s",
			"80s"
		],
		"char": "💾",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"cd": {
		"keywords": [
			"technology",
			"dvd",
			"disk",
			"disc",
			"90s"
		],
		"char": "💿",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"dvd": {
		"keywords": [
			"cd",
			"disk",
			"disc"
		],
		"char": "📀",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"vhs": {
		"keywords": [
			"record",
			"video",
			"oldschool",
			"90s",
			"80s"
		],
		"char": "📼",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"camera": {
		"keywords": [
			"gadgets",
			"photography"
		],
		"char": "📷",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"camera_flash": {
		"keywords": [
			"photography",
			"gadgets"
		],
		"char": "📸",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"video_camera": {
		"keywords": [
			"film",
			"record"
		],
		"char": "📹",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"movie_camera": {
		"keywords": [
			"film",
			"record"
		],
		"char": "🎥",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"film_projector": {
		"keywords": [
			"video",
			"tape",
			"record",
			"movie"
		],
		"char": "📽",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"film_strip": {
		"keywords": [
			"movie"
		],
		"char": "🎞",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"telephone_receiver": {
		"keywords": [
			"technology",
			"communication",
			"dial"
		],
		"char": "📞",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"phone": {
		"keywords": [
			"technology",
			"communication",
			"dial",
			"telephone"
		],
		"char": "☎️",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pager": {
		"keywords": [
			"bbcall",
			"oldschool",
			"90s"
		],
		"char": "📟",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"fax": {
		"keywords": [
			"communication",
			"technology"
		],
		"char": "📠",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"tv": {
		"keywords": [
			"technology",
			"program",
			"oldschool",
			"show",
			"television"
		],
		"char": "📺",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"radio": {
		"keywords": [
			"communication",
			"music",
			"podcast",
			"program"
		],
		"char": "📻",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"studio_microphone": {
		"keywords": [
			"singer",
			"recording",
			"artist"
		],
		"char": "🎙",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"level_slider": {
		"keywords": [
			"scale"
		],
		"char": "🎚",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"control_knobs": {
		"keywords": [
			"dial"
		],
		"char": "🎛",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"stopwatch": {
		"keywords": [
			"time",
			"deadline"
		],
		"char": "⏱",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"timer_clock": {
		"keywords": [
			"alarm"
		],
		"char": "⏲",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"alarm_clock": {
		"keywords": [
			"time",
			"wake"
		],
		"char": "⏰",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mantelpiece_clock": {
		"keywords": [
			"time"
		],
		"char": "🕰",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hourglass_flowing_sand": {
		"keywords": [
			"oldschool",
			"time",
			"countdown"
		],
		"char": "⏳",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hourglass": {
		"keywords": [
			"time",
			"clock",
			"oldschool",
			"limit",
			"exam",
			"quiz",
			"test"
		],
		"char": "⌛",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"satellite": {
		"keywords": [
			"communication",
			"future",
			"radio",
			"space"
		],
		"char": "📡",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"battery": {
		"keywords": [
			"power",
			"energy",
			"sustain"
		],
		"char": "🔋",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"electric_plug": {
		"keywords": [
			"charger",
			"power"
		],
		"char": "🔌",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bulb": {
		"keywords": [
			"light",
			"electricity",
			"idea"
		],
		"char": "💡",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"flashlight": {
		"keywords": [
			"dark",
			"camping",
			"sight",
			"night"
		],
		"char": "🔦",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"candle": {
		"keywords": [
			"fire",
			"wax"
		],
		"char": "🕯",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"wastebasket": {
		"keywords": [
			"bin",
			"trash",
			"rubbish",
			"garbage",
			"toss"
		],
		"char": "🗑",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"oil_drum": {
		"keywords": [
			"barrell"
		],
		"char": "🛢",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"money_with_wings": {
		"keywords": [
			"dollar",
			"bills",
			"payment",
			"sale"
		],
		"char": "💸",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"dollar": {
		"keywords": [
			"money",
			"sales",
			"bill",
			"currency"
		],
		"char": "💵",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"yen": {
		"keywords": [
			"money",
			"sales",
			"japanese",
			"dollar",
			"currency"
		],
		"char": "💴",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"euro": {
		"keywords": [
			"money",
			"sales",
			"dollar",
			"currency"
		],
		"char": "💶",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pound": {
		"keywords": [
			"british",
			"sterling",
			"money",
			"sales",
			"bills",
			"uk",
			"england",
			"currency"
		],
		"char": "💷",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"moneybag": {
		"keywords": [
			"dollar",
			"payment",
			"coins",
			"sale"
		],
		"char": "💰",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"credit_card": {
		"keywords": [
			"money",
			"sales",
			"dollar",
			"bill",
			"payment",
			"shopping"
		],
		"char": "💳",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"gem": {
		"keywords": [
			"blue",
			"ruby",
			"diamond",
			"jewelry"
		],
		"char": "💎",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"balance_scale": {
		"keywords": [
			"law",
			"fairness",
			"weight"
		],
		"char": "⚖",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"wrench": {
		"keywords": [
			"tools",
			"diy",
			"ikea",
			"fix",
			"maintainer"
		],
		"char": "🔧",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hammer": {
		"keywords": [
			"tools",
			"build",
			"create"
		],
		"char": "🔨",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hammer_and_pick": {
		"keywords": [
			"tools",
			"build",
			"create"
		],
		"char": "⚒",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hammer_and_wrench": {
		"keywords": [
			"tools",
			"build",
			"create"
		],
		"char": "🛠",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pick": {
		"keywords": [
			"tools",
			"dig"
		],
		"char": "⛏",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"nut_and_bolt": {
		"keywords": [
			"handy",
			"tools",
			"fix"
		],
		"char": "🔩",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"gear": {
		"keywords": [
			"cog"
		],
		"char": "⚙",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"chains": {
		"keywords": [
			"lock",
			"arrest"
		],
		"char": "⛓",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"gun": {
		"keywords": [
			"violence",
			"weapon",
			"pistol",
			"revolver"
		],
		"char": "🔫",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bomb": {
		"keywords": [
			"boom",
			"explode",
			"explosion",
			"terrorism"
		],
		"char": "💣",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hocho": {
		"keywords": [
			"knife",
			"blade",
			"cutlery",
			"kitchen",
			"weapon"
		],
		"char": "🔪",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"dagger": {
		"keywords": [
			"weapon"
		],
		"char": "🗡",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"crossed_swords": {
		"keywords": [
			"weapon"
		],
		"char": "⚔",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"shield": {
		"keywords": [
			"protection",
			"security"
		],
		"char": "🛡",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"smoking": {
		"keywords": [
			"kills",
			"tobacco",
			"cigarette",
			"joint",
			"smoke"
		],
		"char": "🚬",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"skull_and_crossbones": {
		"keywords": [
			"poison",
			"danger",
			"deadly",
			"scary"
		],
		"char": "☠",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"coffin": {
		"keywords": [
			"vampire",
			"dead",
			"die",
			"death",
			"rip",
			"graveyard",
			"cemetery"
		],
		"char": "⚰",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"funeral_urn": {
		"keywords": [
			"dead",
			"die",
			"death",
			"rip",
			"ashes"
		],
		"char": "⚱",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"amphora": {
		"keywords": [
			"vase",
			"jar"
		],
		"char": "🏺",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"crystal_ball": {
		"keywords": [
			"disco",
			"party",
			"magic",
			"circus",
			"fortune_teller"
		],
		"char": "🔮",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"prayer_beads": {
		"keywords": [
			"dhikr",
			"religious"
		],
		"char": "📿",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"barber": {
		"keywords": [
			"hair",
			"salon",
			"style"
		],
		"char": "💈",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"alembic": {
		"keywords": [
			"distilling",
			"science",
			"experiment"
		],
		"char": "⚗",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"telescope": {
		"keywords": [
			"stars",
			"space",
			"zoom"
		],
		"char": "🔭",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"microscope": {
		"keywords": [
			"laboratory",
			"experiment",
			"zoomin",
			"science",
			"study"
		],
		"char": "🔬",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"hole": {
		"keywords": [
			"embarrassing"
		],
		"char": "🕳",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pill": {
		"keywords": [
			"health",
			"medicine",
			"doctor",
			"pharmacy",
			"drug"
		],
		"char": "💊",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"syringe": {
		"keywords": [
			"health",
			"hospital",
			"drugs",
			"blood",
			"medicine",
			"needle",
			"doctor",
			"nurse"
		],
		"char": "💉",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"thermometer": {
		"keywords": [
			"weather",
			"temperature",
			"hot",
			"cold"
		],
		"char": "🌡",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"label": {
		"keywords": [
			"sale",
			"tag"
		],
		"char": "🏷",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bookmark": {
		"keywords": [
			"favorite",
			"label",
			"save"
		],
		"char": "🔖",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"toilet": {
		"keywords": [
			"restroom",
			"wc",
			"washroom",
			"bathroom",
			"potty"
		],
		"char": "🚽",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"shower": {
		"keywords": [
			"clean",
			"water",
			"bathroom"
		],
		"char": "🚿",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bathtub": {
		"keywords": [
			"clean",
			"shower",
			"bathroom"
		],
		"char": "🛁",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"key": {
		"keywords": [
			"lock",
			"door",
			"password"
		],
		"char": "🔑",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"old_key": {
		"keywords": [
			"lock",
			"door",
			"password"
		],
		"char": "🗝",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"couch_and_lamp": {
		"keywords": [
			"read",
			"chill"
		],
		"char": "🛋",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"sleeping_bed": {
		"keywords": [
			"bed",
			"rest"
		],
		"char": "🛌",
		"fitzpatrick_scale": true,
		"category": "objects"
	},
	"bed": {
		"keywords": [
			"sleep",
			"rest"
		],
		"char": "🛏",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"door": {
		"keywords": [
			"house",
			"entry",
			"exit"
		],
		"char": "🚪",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bellhop_bell": {
		"keywords": [
			"service"
		],
		"char": "🛎",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"framed_picture": {
		"keywords": [
			"photography"
		],
		"char": "🖼",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"world_map": {
		"keywords": [
			"location",
			"direction"
		],
		"char": "🗺",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"parasol_on_ground": {
		"keywords": [
			"weather",
			"summer"
		],
		"char": "⛱",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"moyai": {
		"keywords": [
			"rock",
			"easter island",
			"moai"
		],
		"char": "🗿",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"shopping": {
		"keywords": [
			"mall",
			"buy",
			"purchase"
		],
		"char": "🛍",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"shopping_cart": {
		"keywords": [
			"trolley"
		],
		"char": "🛒",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"balloon": {
		"keywords": [
			"party",
			"celebration",
			"birthday",
			"circus"
		],
		"char": "🎈",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"flags": {
		"keywords": [
			"fish",
			"japanese",
			"koinobori",
			"carp",
			"banner"
		],
		"char": "🎏",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"ribbon": {
		"keywords": [
			"decoration",
			"pink",
			"girl",
			"bowtie"
		],
		"char": "🎀",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"gift": {
		"keywords": [
			"present",
			"birthday",
			"christmas",
			"xmas"
		],
		"char": "🎁",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"confetti_ball": {
		"keywords": [
			"festival",
			"party",
			"birthday",
			"circus"
		],
		"char": "🎊",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"tada": {
		"keywords": [
			"party",
			"congratulations",
			"birthday",
			"magic",
			"circus",
			"celebration"
		],
		"char": "🎉",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"dolls": {
		"keywords": [
			"japanese",
			"toy",
			"kimono"
		],
		"char": "🎎",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"wind_chime": {
		"keywords": [
			"nature",
			"ding",
			"spring",
			"bell"
		],
		"char": "🎐",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"crossed_flags": {
		"keywords": [
			"japanese",
			"nation",
			"country",
			"border"
		],
		"char": "🎌",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"izakaya_lantern": {
		"keywords": [
			"light",
			"paper",
			"halloween",
			"spooky"
		],
		"char": "🏮",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"email": {
		"keywords": [
			"letter",
			"postal",
			"inbox",
			"communication"
		],
		"char": "✉️",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"envelope_with_arrow": {
		"keywords": [
			"email",
			"communication"
		],
		"char": "📩",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"incoming_envelope": {
		"keywords": [
			"email",
			"inbox"
		],
		"char": "📨",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"e-mail": {
		"keywords": [
			"communication",
			"inbox"
		],
		"char": "📧",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"love_letter": {
		"keywords": [
			"email",
			"like",
			"affection",
			"envelope",
			"valentines"
		],
		"char": "💌",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"postbox": {
		"keywords": [
			"email",
			"letter",
			"envelope"
		],
		"char": "📮",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mailbox_closed": {
		"keywords": [
			"email",
			"communication",
			"inbox"
		],
		"char": "📪",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mailbox": {
		"keywords": [
			"email",
			"inbox",
			"communication"
		],
		"char": "📫",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mailbox_with_mail": {
		"keywords": [
			"email",
			"inbox",
			"communication"
		],
		"char": "📬",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mailbox_with_no_mail": {
		"keywords": [
			"email",
			"inbox"
		],
		"char": "📭",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"package": {
		"keywords": [
			"mail",
			"gift",
			"cardboard",
			"box",
			"moving"
		],
		"char": "📦",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"postal_horn": {
		"keywords": [
			"instrument",
			"music"
		],
		"char": "📯",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"inbox_tray": {
		"keywords": [
			"email",
			"documents"
		],
		"char": "📥",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"outbox_tray": {
		"keywords": [
			"inbox",
			"email"
		],
		"char": "📤",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"scroll": {
		"keywords": [
			"documents",
			"ancient",
			"history",
			"paper"
		],
		"char": "📜",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"page_with_curl": {
		"keywords": [
			"documents",
			"office",
			"paper"
		],
		"char": "📃",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bookmark_tabs": {
		"keywords": [
			"favorite",
			"save",
			"order",
			"tidy"
		],
		"char": "📑",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"bar_chart": {
		"keywords": [
			"graph",
			"presentation",
			"stats"
		],
		"char": "📊",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"chart_with_upwards_trend": {
		"keywords": [
			"graph",
			"presentation",
			"stats",
			"recovery",
			"business",
			"economics",
			"money",
			"sales",
			"good",
			"success"
		],
		"char": "📈",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"chart_with_downwards_trend": {
		"keywords": [
			"graph",
			"presentation",
			"stats",
			"recession",
			"business",
			"economics",
			"money",
			"sales",
			"bad",
			"failure"
		],
		"char": "📉",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"page_facing_up": {
		"keywords": [
			"documents",
			"office",
			"paper",
			"information"
		],
		"char": "📄",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"date": {
		"keywords": [
			"calendar",
			"schedule"
		],
		"char": "📅",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"calendar": {
		"keywords": [
			"schedule",
			"date",
			"planning"
		],
		"char": "📆",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"spiral_calendar": {
		"keywords": [
			"date",
			"schedule",
			"planning"
		],
		"char": "🗓",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"card_index": {
		"keywords": [
			"business",
			"stationery"
		],
		"char": "📇",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"card_file_box": {
		"keywords": [
			"business",
			"stationery"
		],
		"char": "🗃",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"ballot_box": {
		"keywords": [
			"election",
			"vote"
		],
		"char": "🗳",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"file_cabinet": {
		"keywords": [
			"filing",
			"organizing"
		],
		"char": "🗄",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"clipboard": {
		"keywords": [
			"stationery",
			"documents"
		],
		"char": "📋",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"spiral_notepad": {
		"keywords": [
			"memo",
			"stationery"
		],
		"char": "🗒",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"file_folder": {
		"keywords": [
			"documents",
			"business",
			"office"
		],
		"char": "📁",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"open_file_folder": {
		"keywords": [
			"documents",
			"load"
		],
		"char": "📂",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"card_index_dividers": {
		"keywords": [
			"organizing",
			"business",
			"stationery"
		],
		"char": "🗂",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"newspaper_roll": {
		"keywords": [
			"press",
			"headline"
		],
		"char": "🗞",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"newspaper": {
		"keywords": [
			"press",
			"headline"
		],
		"char": "📰",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"notebook": {
		"keywords": [
			"stationery",
			"record",
			"notes",
			"paper",
			"study"
		],
		"char": "📓",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"closed_book": {
		"keywords": [
			"read",
			"library",
			"knowledge",
			"textbook",
			"learn"
		],
		"char": "📕",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"green_book": {
		"keywords": [
			"read",
			"library",
			"knowledge",
			"study"
		],
		"char": "📗",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"blue_book": {
		"keywords": [
			"read",
			"library",
			"knowledge",
			"learn",
			"study"
		],
		"char": "📘",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"orange_book": {
		"keywords": [
			"read",
			"library",
			"knowledge",
			"textbook",
			"study"
		],
		"char": "📙",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"notebook_with_decorative_cover": {
		"keywords": [
			"classroom",
			"notes",
			"record",
			"paper",
			"study"
		],
		"char": "📔",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"ledger": {
		"keywords": [
			"notes",
			"paper"
		],
		"char": "📒",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"books": {
		"keywords": [
			"literature",
			"library",
			"study"
		],
		"char": "📚",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"open_book": {
		"keywords": [
			"book",
			"read",
			"library",
			"knowledge",
			"literature",
			"learn",
			"study"
		],
		"char": "📖",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"link": {
		"keywords": [
			"rings",
			"url"
		],
		"char": "🔗",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"paperclip": {
		"keywords": [
			"documents",
			"stationery"
		],
		"char": "📎",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"paperclips": {
		"keywords": [
			"documents",
			"stationery"
		],
		"char": "🖇",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"scissors": {
		"keywords": [
			"stationery",
			"cut"
		],
		"char": "✂️",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"triangular_ruler": {
		"keywords": [
			"stationery",
			"math",
			"architect",
			"sketch"
		],
		"char": "📐",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"straight_ruler": {
		"keywords": [
			"stationery",
			"calculate",
			"length",
			"math",
			"school",
			"drawing",
			"architect",
			"sketch"
		],
		"char": "📏",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pushpin": {
		"keywords": [
			"stationery",
			"mark",
			"here"
		],
		"char": "📌",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"round_pushpin": {
		"keywords": [
			"stationery",
			"location",
			"map",
			"here"
		],
		"char": "📍",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"triangular_flag_on_post": {
		"keywords": [
			"mark",
			"milestone",
			"place"
		],
		"char": "🚩",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"white_flag": {
		"keywords": [
			"losing",
			"loser",
			"lost",
			"surrender",
			"give up",
			"fail"
		],
		"char": "🏳",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"black_flag": {
		"keywords": [
			"pirate"
		],
		"char": "🏴",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"rainbow_flag": {
		"keywords": [
			"flag",
			"rainbow"
		],
		"char": "🏳️‍🌈",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"closed_lock_with_key": {
		"keywords": [
			"security",
			"privacy"
		],
		"char": "🔐",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"lock": {
		"keywords": [
			"security",
			"password",
			"padlock"
		],
		"char": "🔒",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"unlock": {
		"keywords": [
			"privacy",
			"security"
		],
		"char": "🔓",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"lock_with_ink_pen": {
		"keywords": [
			"security",
			"secret"
		],
		"char": "🔏",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pen": {
		"keywords": [
			"stationery",
			"writing",
			"write"
		],
		"char": "🖊",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"fountain_pen": {
		"keywords": [
			"stationery",
			"writing",
			"write"
		],
		"char": "🖋",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"black_nib": {
		"keywords": [
			"pen",
			"stationery",
			"writing",
			"write"
		],
		"char": "✒️",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"memo": {
		"keywords": [
			"write",
			"documents",
			"stationery",
			"pencil",
			"paper",
			"writing",
			"legal",
			"exam",
			"quiz",
			"test",
			"study"
		],
		"char": "📝",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"pencil2": {
		"keywords": [
			"stationery",
			"write",
			"paper",
			"writing",
			"school",
			"study"
		],
		"char": "✏️",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"crayon": {
		"keywords": [
			"drawing",
			"creativity"
		],
		"char": "🖍",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"paintbrush": {
		"keywords": [
			"drawing",
			"creativity",
			"art"
		],
		"char": "🖌",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mag": {
		"keywords": [
			"search",
			"zoom",
			"find",
			"detective"
		],
		"char": "🔍",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"mag_right": {
		"keywords": [
			"search",
			"zoom",
			"find",
			"detective"
		],
		"char": "🔎",
		"fitzpatrick_scale": false,
		"category": "objects"
	},
	"heart": {
		"keywords": [
			"love",
			"like",
			"valentines"
		],
		"char": "❤️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"yellow_heart": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"green_heart": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💚",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"blue_heart": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💙",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"purple_heart": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💜",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_heart": {
		"keywords": [
			"evil"
		],
		"char": "🖤",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"broken_heart": {
		"keywords": [
			"sad",
			"sorry",
			"break",
			"heart",
			"heartbreak"
		],
		"char": "💔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_heart_exclamation": {
		"keywords": [
			"decoration",
			"love"
		],
		"char": "❣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"two_hearts": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines",
			"heart"
		],
		"char": "💕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"revolving_hearts": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💞",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heartbeat": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines",
			"pink",
			"heart"
		],
		"char": "💓",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heartpulse": {
		"keywords": [
			"like",
			"love",
			"affection",
			"valentines",
			"pink"
		],
		"char": "💗",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sparkling_heart": {
		"keywords": [
			"love",
			"like",
			"affection",
			"valentines"
		],
		"char": "💖",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cupid": {
		"keywords": [
			"love",
			"like",
			"heart",
			"affection",
			"valentines"
		],
		"char": "💘",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"gift_heart": {
		"keywords": [
			"love",
			"valentines"
		],
		"char": "💝",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heart_decoration": {
		"keywords": [
			"purple-square",
			"love",
			"like"
		],
		"char": "💟",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"peace_symbol": {
		"keywords": [
			"hippie"
		],
		"char": "☮",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"latin_cross": {
		"keywords": [
			"christianity"
		],
		"char": "✝",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"star_and_crescent": {
		"keywords": [
			"islam"
		],
		"char": "☪",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"om": {
		"keywords": [
			"hinduism",
			"buddhism",
			"sikhism",
			"jainism"
		],
		"char": "🕉",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"wheel_of_dharma": {
		"keywords": [
			"hinduism",
			"buddhism",
			"sikhism",
			"jainism"
		],
		"char": "☸",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"star_of_david": {
		"keywords": [
			"judaism"
		],
		"char": "✡",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"six_pointed_star": {
		"keywords": [
			"purple-square",
			"religion",
			"jewish",
			"hexagram"
		],
		"char": "🔯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"menorah": {
		"keywords": [
			"hanukkah",
			"candles",
			"jewish"
		],
		"char": "🕎",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"yin_yang": {
		"keywords": [
			"balance"
		],
		"char": "☯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"orthodox_cross": {
		"keywords": [
			"suppedaneum",
			"religion"
		],
		"char": "☦",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"place_of_worship": {
		"keywords": [
			"religion",
			"church",
			"temple",
			"prayer"
		],
		"char": "🛐",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ophiuchus": {
		"keywords": [
			"sign",
			"purple-square",
			"constellation",
			"astrology"
		],
		"char": "⛎",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"aries": {
		"keywords": [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		"char": "♈",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"taurus": {
		"keywords": [
			"purple-square",
			"sign",
			"zodiac",
			"astrology"
		],
		"char": "♉",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"gemini": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		"char": "♊",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cancer": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		"char": "♋",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"leo": {
		"keywords": [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		"char": "♌",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"virgo": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		"char": "♍",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"libra": {
		"keywords": [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		"char": "♎",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"scorpius": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology",
			"scorpio"
		],
		"char": "♏",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sagittarius": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		"char": "♐",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"capricorn": {
		"keywords": [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		"char": "♑",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"aquarius": {
		"keywords": [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		"char": "♒",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"pisces": {
		"keywords": [
			"purple-square",
			"sign",
			"zodiac",
			"astrology"
		],
		"char": "♓",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"id": {
		"keywords": [
			"purple-square",
			"words"
		],
		"char": "🆔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"atom_symbol": {
		"keywords": [
			"science"
		],
		"char": "⚛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u7a7a": {
		"keywords": [
			"kanji",
			"japanese",
			"chinese",
			"empty",
			"sky",
			"blue-square"
		],
		"char": "🈳",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u5272": {
		"keywords": [
			"cut",
			"divide",
			"chinese",
			"kanji",
			"pink-square"
		],
		"char": "🈹",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"radioactive": {
		"keywords": [
			"nuclear",
			"danger"
		],
		"char": "☢",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"biohazard": {
		"keywords": [
			"danger"
		],
		"char": "☣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"mobile_phone_off": {
		"keywords": [
			"mute",
			"orange-square",
			"silence",
			"quiet"
		],
		"char": "📴",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"vibration_mode": {
		"keywords": [
			"orange-square",
			"phone"
		],
		"char": "📳",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u6709": {
		"keywords": [
			"orange-square",
			"chinese",
			"have",
			"kanji"
		],
		"char": "🈶",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u7121": {
		"keywords": [
			"nothing",
			"chinese",
			"kanji",
			"japanese",
			"orange-square"
		],
		"char": "🈚",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u7533": {
		"keywords": [
			"chinese",
			"japanese",
			"kanji",
			"orange-square"
		],
		"char": "🈸",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u55b6": {
		"keywords": [
			"japanese",
			"opening hours",
			"orange-square"
		],
		"char": "🈺",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u6708": {
		"keywords": [
			"chinese",
			"month",
			"moon",
			"japanese",
			"orange-square",
			"kanji"
		],
		"char": "🈷️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"eight_pointed_black_star": {
		"keywords": [
			"orange-square",
			"shape",
			"polygon"
		],
		"char": "✴️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"vs": {
		"keywords": [
			"words",
			"orange-square"
		],
		"char": "🆚",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"accept": {
		"keywords": [
			"ok",
			"good",
			"chinese",
			"kanji",
			"agree",
			"yes",
			"orange-circle"
		],
		"char": "🉑",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_flower": {
		"keywords": [
			"japanese",
			"spring"
		],
		"char": "💮",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ideograph_advantage": {
		"keywords": [
			"chinese",
			"kanji",
			"obtain",
			"get",
			"circle"
		],
		"char": "🉐",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"secret": {
		"keywords": [
			"privacy",
			"chinese",
			"sshh",
			"kanji",
			"red-circle"
		],
		"char": "㊙️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"congratulations": {
		"keywords": [
			"chinese",
			"kanji",
			"japanese",
			"red-circle"
		],
		"char": "㊗️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u5408": {
		"keywords": [
			"japanese",
			"chinese",
			"join",
			"kanji",
			"red-square"
		],
		"char": "🈴",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u6e80": {
		"keywords": [
			"full",
			"chinese",
			"japanese",
			"red-square",
			"kanji"
		],
		"char": "🈵",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u7981": {
		"keywords": [
			"kanji",
			"japanese",
			"chinese",
			"forbidden",
			"limit",
			"restricted",
			"red-square"
		],
		"char": "🈲",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"a": {
		"keywords": [
			"red-square",
			"alphabet",
			"letter"
		],
		"char": "🅰️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"b": {
		"keywords": [
			"red-square",
			"alphabet",
			"letter"
		],
		"char": "🅱️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ab": {
		"keywords": [
			"red-square",
			"alphabet"
		],
		"char": "🆎",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cl": {
		"keywords": [
			"alphabet",
			"words",
			"red-square"
		],
		"char": "🆑",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"o2": {
		"keywords": [
			"alphabet",
			"red-square",
			"letter"
		],
		"char": "🅾️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sos": {
		"keywords": [
			"help",
			"red-square",
			"words",
			"emergency",
			"911"
		],
		"char": "🆘",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_entry": {
		"keywords": [
			"limit",
			"security",
			"privacy",
			"bad",
			"denied",
			"stop",
			"circle"
		],
		"char": "⛔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"name_badge": {
		"keywords": [
			"fire",
			"forbid"
		],
		"char": "📛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_entry_sign": {
		"keywords": [
			"forbid",
			"stop",
			"limit",
			"denied",
			"disallow",
			"circle"
		],
		"char": "🚫",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"x": {
		"keywords": [
			"no",
			"delete",
			"remove",
			"cancel"
		],
		"char": "❌",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"o": {
		"keywords": [
			"circle",
			"round"
		],
		"char": "⭕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"stop_sign": {
		"keywords": [
			"stop"
		],
		"char": "🛑",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"anger": {
		"keywords": [
			"angry",
			"mad"
		],
		"char": "💢",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"hotsprings": {
		"keywords": [
			"bath",
			"warm",
			"relax"
		],
		"char": "♨️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_pedestrians": {
		"keywords": [
			"rules",
			"crossing",
			"walking",
			"circle"
		],
		"char": "🚷",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"do_not_litter": {
		"keywords": [
			"trash",
			"bin",
			"garbage",
			"circle"
		],
		"char": "🚯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_bicycles": {
		"keywords": [
			"cyclist",
			"prohibited",
			"circle"
		],
		"char": "🚳",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"non-potable_water": {
		"keywords": [
			"drink",
			"faucet",
			"tap",
			"circle"
		],
		"char": "🚱",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"underage": {
		"keywords": [
			"18",
			"drink",
			"pub",
			"night",
			"minor",
			"circle"
		],
		"char": "🔞",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_mobile_phones": {
		"keywords": [
			"iphone",
			"mute",
			"circle"
		],
		"char": "📵",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"exclamation": {
		"keywords": [
			"heavy_exclamation_mark",
			"danger",
			"surprise",
			"punctuation",
			"wow",
			"warning"
		],
		"char": "❗",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"grey_exclamation": {
		"keywords": [
			"surprise",
			"punctuation",
			"gray",
			"wow",
			"warning"
		],
		"char": "❕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"question": {
		"keywords": [
			"doubt",
			"confused"
		],
		"char": "❓",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"grey_question": {
		"keywords": [
			"doubts",
			"gray",
			"huh",
			"confused"
		],
		"char": "❔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"bangbang": {
		"keywords": [
			"exclamation",
			"surprise"
		],
		"char": "‼️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"interrobang": {
		"keywords": [
			"wat",
			"punctuation",
			"surprise"
		],
		"char": "⁉️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"low_brightness": {
		"keywords": [
			"sun",
			"afternoon",
			"warm",
			"summer"
		],
		"char": "🔅",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"high_brightness": {
		"keywords": [
			"sun",
			"light"
		],
		"char": "🔆",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"trident": {
		"keywords": [
			"weapon",
			"spear"
		],
		"char": "🔱",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"fleur_de_lis": {
		"keywords": [
			"decorative",
			"scout"
		],
		"char": "⚜",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"part_alternation_mark": {
		"keywords": [
			"graph",
			"presentation",
			"stats",
			"business",
			"economics",
			"bad"
		],
		"char": "〽️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"warning": {
		"keywords": [
			"exclamation",
			"wip",
			"alert",
			"error",
			"problem",
			"issue"
		],
		"char": "⚠️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"children_crossing": {
		"keywords": [
			"school",
			"warning",
			"danger",
			"sign",
			"driving",
			"yellow-diamond"
		],
		"char": "🚸",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"beginner": {
		"keywords": [
			"badge",
			"shield"
		],
		"char": "🔰",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"recycle": {
		"keywords": [
			"arrow",
			"environment",
			"garbage",
			"trash"
		],
		"char": "♻️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"u6307": {
		"keywords": [
			"chinese",
			"point",
			"green-square",
			"kanji"
		],
		"char": "🈯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"chart": {
		"keywords": [
			"green-square",
			"graph",
			"presentation",
			"stats"
		],
		"char": "💹",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sparkle": {
		"keywords": [
			"stars",
			"green-square",
			"awesome",
			"good",
			"fireworks"
		],
		"char": "❇️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"eight_spoked_asterisk": {
		"keywords": [
			"star",
			"sparkle",
			"green-square"
		],
		"char": "✳️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"negative_squared_cross_mark": {
		"keywords": [
			"x",
			"green-square",
			"no",
			"deny"
		],
		"char": "❎",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_check_mark": {
		"keywords": [
			"green-square",
			"ok",
			"agree",
			"vote",
			"election",
			"answer",
			"tick"
		],
		"char": "✅",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"diamond_shape_with_a_dot_inside": {
		"keywords": [
			"jewel",
			"blue",
			"gem",
			"crystal",
			"fancy"
		],
		"char": "💠",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cyclone": {
		"keywords": [
			"weather",
			"swirl",
			"blue",
			"cloud",
			"vortex",
			"spiral",
			"whirlpool",
			"spin"
		],
		"char": "🌀",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"loop": {
		"keywords": [
			"tape",
			"cassette"
		],
		"char": "➿",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"globe_with_meridians": {
		"keywords": [
			"earth",
			"international",
			"world",
			"internet",
			"interweb",
			"i18n"
		],
		"char": "🌐",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"m": {
		"keywords": [
			"alphabet",
			"blue-circle",
			"letter"
		],
		"char": "Ⓜ️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"atm": {
		"keywords": [
			"money",
			"sales",
			"cash",
			"blue-square",
			"payment",
			"bank"
		],
		"char": "🏧",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sa": {
		"keywords": [
			"japanese",
			"blue-square",
			"katakana"
		],
		"char": "🈂️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"passport_control": {
		"keywords": [
			"custom",
			"blue-square"
		],
		"char": "🛂",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"customs": {
		"keywords": [
			"passport",
			"border",
			"blue-square"
		],
		"char": "🛃",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"baggage_claim": {
		"keywords": [
			"blue-square",
			"airport",
			"transport"
		],
		"char": "🛄",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"left_luggage": {
		"keywords": [
			"blue-square",
			"travel"
		],
		"char": "🛅",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"wheelchair": {
		"keywords": [
			"blue-square",
			"disabled",
			"a11y",
			"accessibility"
		],
		"char": "♿",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_smoking": {
		"keywords": [
			"cigarette",
			"blue-square",
			"smell",
			"smoke"
		],
		"char": "🚭",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"wc": {
		"keywords": [
			"toilet",
			"restroom",
			"blue-square"
		],
		"char": "🚾",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"parking": {
		"keywords": [
			"cars",
			"blue-square",
			"alphabet",
			"letter"
		],
		"char": "🅿️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"potable_water": {
		"keywords": [
			"blue-square",
			"liquid",
			"restroom",
			"cleaning",
			"faucet"
		],
		"char": "🚰",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"mens": {
		"keywords": [
			"toilet",
			"restroom",
			"wc",
			"blue-square",
			"gender",
			"male"
		],
		"char": "🚹",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"womens": {
		"keywords": [
			"purple-square",
			"woman",
			"female",
			"toilet",
			"loo",
			"restroom",
			"gender"
		],
		"char": "🚺",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"baby_symbol": {
		"keywords": [
			"orange-square",
			"child"
		],
		"char": "🚼",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"restroom": {
		"keywords": [
			"blue-square",
			"toilet",
			"refresh",
			"wc",
			"gender"
		],
		"char": "🚻",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"put_litter_in_its_place": {
		"keywords": [
			"blue-square",
			"sign",
			"human",
			"info"
		],
		"char": "🚮",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cinema": {
		"keywords": [
			"blue-square",
			"record",
			"film",
			"movie",
			"curtain",
			"stage",
			"theater"
		],
		"char": "🎦",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"signal_strength": {
		"keywords": [
			"blue-square",
			"reception",
			"phone",
			"internet",
			"connection",
			"wifi",
			"bluetooth",
			"bars"
		],
		"char": "📶",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"koko": {
		"keywords": [
			"blue-square",
			"here",
			"katakana",
			"japanese",
			"destination"
		],
		"char": "🈁",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ng": {
		"keywords": [
			"blue-square",
			"words",
			"shape",
			"icon"
		],
		"char": "🆖",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ok": {
		"keywords": [
			"good",
			"agree",
			"yes",
			"blue-square"
		],
		"char": "🆗",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"up": {
		"keywords": [
			"blue-square",
			"above",
			"high"
		],
		"char": "🆙",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"cool": {
		"keywords": [
			"words",
			"blue-square"
		],
		"char": "🆒",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"new": {
		"keywords": [
			"blue-square",
			"words",
			"start"
		],
		"char": "🆕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"free": {
		"keywords": [
			"blue-square",
			"words"
		],
		"char": "🆓",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"zero": {
		"keywords": [
			"0",
			"numbers",
			"blue-square",
			"null"
		],
		"char": "0️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"one": {
		"keywords": [
			"blue-square",
			"numbers",
			"1"
		],
		"char": "1️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"two": {
		"keywords": [
			"numbers",
			"2",
			"prime",
			"blue-square"
		],
		"char": "2️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"three": {
		"keywords": [
			"3",
			"numbers",
			"prime",
			"blue-square"
		],
		"char": "3️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"four": {
		"keywords": [
			"4",
			"numbers",
			"blue-square"
		],
		"char": "4️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"five": {
		"keywords": [
			"5",
			"numbers",
			"blue-square",
			"prime"
		],
		"char": "5️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"six": {
		"keywords": [
			"6",
			"numbers",
			"blue-square"
		],
		"char": "6️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"seven": {
		"keywords": [
			"7",
			"numbers",
			"blue-square",
			"prime"
		],
		"char": "7️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"eight": {
		"keywords": [
			"8",
			"blue-square",
			"numbers"
		],
		"char": "8️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"nine": {
		"keywords": [
			"blue-square",
			"numbers",
			"9"
		],
		"char": "9️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"keycap_ten": {
		"keywords": [
			"numbers",
			"10",
			"blue-square"
		],
		"char": "🔟",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"asterisk": {
		"keywords": [
			"star",
			"keycap"
		],
		"char": "*⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_forward": {
		"keywords": [
			"blue-square",
			"right",
			"direction",
			"play"
		],
		"char": "▶️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"pause_button": {
		"keywords": [
			"pause",
			"blue-square"
		],
		"char": "⏸",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"next_track_button": {
		"keywords": [
			"forward",
			"next",
			"blue-square"
		],
		"char": "⏭",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"stop_button": {
		"keywords": [
			"blue-square"
		],
		"char": "⏹",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"record_button": {
		"keywords": [
			"blue-square"
		],
		"char": "⏺",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"play_or_pause_button": {
		"keywords": [
			"blue-square",
			"play",
			"pause"
		],
		"char": "⏯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"previous_track_button": {
		"keywords": [
			"backward"
		],
		"char": "⏮",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"fast_forward": {
		"keywords": [
			"blue-square",
			"play",
			"speed",
			"continue"
		],
		"char": "⏩",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"rewind": {
		"keywords": [
			"play",
			"blue-square"
		],
		"char": "⏪",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"twisted_rightwards_arrows": {
		"keywords": [
			"blue-square",
			"shuffle",
			"music",
			"random"
		],
		"char": "🔀",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"repeat": {
		"keywords": [
			"loop",
			"record"
		],
		"char": "🔁",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"repeat_one": {
		"keywords": [
			"blue-square",
			"loop"
		],
		"char": "🔂",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_backward": {
		"keywords": [
			"blue-square",
			"left",
			"direction"
		],
		"char": "◀️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_up_small": {
		"keywords": [
			"blue-square",
			"triangle",
			"direction",
			"point",
			"forward",
			"top"
		],
		"char": "🔼",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_down_small": {
		"keywords": [
			"blue-square",
			"direction",
			"bottom"
		],
		"char": "🔽",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_double_up": {
		"keywords": [
			"blue-square",
			"direction",
			"top"
		],
		"char": "⏫",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_double_down": {
		"keywords": [
			"blue-square",
			"direction",
			"bottom"
		],
		"char": "⏬",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_right": {
		"keywords": [
			"blue-square",
			"next"
		],
		"char": "➡️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_left": {
		"keywords": [
			"blue-square",
			"previous",
			"back"
		],
		"char": "⬅️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_up": {
		"keywords": [
			"blue-square",
			"continue",
			"top",
			"direction"
		],
		"char": "⬆️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_down": {
		"keywords": [
			"blue-square",
			"direction",
			"bottom"
		],
		"char": "⬇️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_upper_right": {
		"keywords": [
			"blue-square",
			"point",
			"direction",
			"diagonal",
			"northeast"
		],
		"char": "↗️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_lower_right": {
		"keywords": [
			"blue-square",
			"direction",
			"diagonal",
			"southeast"
		],
		"char": "↘️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_lower_left": {
		"keywords": [
			"blue-square",
			"direction",
			"diagonal",
			"southwest"
		],
		"char": "↙️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_upper_left": {
		"keywords": [
			"blue-square",
			"point",
			"direction",
			"diagonal",
			"northwest"
		],
		"char": "↖️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_up_down": {
		"keywords": [
			"blue-square",
			"direction",
			"way",
			"vertical"
		],
		"char": "↕️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"left_right_arrow": {
		"keywords": [
			"shape",
			"direction",
			"horizontal",
			"sideways"
		],
		"char": "↔️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrows_counterclockwise": {
		"keywords": [
			"blue-square",
			"sync",
			"cycle"
		],
		"char": "🔄",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_right_hook": {
		"keywords": [
			"blue-square",
			"return",
			"rotate",
			"direction"
		],
		"char": "↪️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"leftwards_arrow_with_hook": {
		"keywords": [
			"back",
			"return",
			"blue-square",
			"undo",
			"enter"
		],
		"char": "↩️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_heading_up": {
		"keywords": [
			"blue-square",
			"direction",
			"top"
		],
		"char": "⤴️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrow_heading_down": {
		"keywords": [
			"blue-square",
			"direction",
			"bottom"
		],
		"char": "⤵️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"hash": {
		"keywords": [
			"symbol",
			"blue-square",
			"twitter"
		],
		"char": "#️⃣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"information_source": {
		"keywords": [
			"blue-square",
			"alphabet",
			"letter"
		],
		"char": "ℹ️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"abc": {
		"keywords": [
			"blue-square",
			"alphabet"
		],
		"char": "🔤",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"abcd": {
		"keywords": [
			"blue-square",
			"alphabet"
		],
		"char": "🔡",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"capital_abcd": {
		"keywords": [
			"alphabet",
			"words",
			"blue-square"
		],
		"char": "🔠",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"symbols": {
		"keywords": [
			"blue-square",
			"music",
			"note",
			"ampersand",
			"percent",
			"glyphs",
			"characters"
		],
		"char": "🔣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"musical_note": {
		"keywords": [
			"score",
			"tone",
			"sound"
		],
		"char": "🎵",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"notes": {
		"keywords": [
			"music",
			"score"
		],
		"char": "🎶",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"wavy_dash": {
		"keywords": [
			"draw",
			"line",
			"moustache",
			"mustache",
			"squiggle",
			"scribble"
		],
		"char": "〰️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"curly_loop": {
		"keywords": [
			"scribble",
			"draw",
			"shape",
			"squiggle"
		],
		"char": "➰",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_check_mark": {
		"keywords": [
			"ok",
			"nike",
			"answer",
			"yes",
			"tick"
		],
		"char": "✔️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"arrows_clockwise": {
		"keywords": [
			"sync",
			"cycle",
			"round",
			"repeat"
		],
		"char": "🔃",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_plus_sign": {
		"keywords": [
			"math",
			"calculation",
			"addition",
			"more",
			"increase"
		],
		"char": "➕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_minus_sign": {
		"keywords": [
			"math",
			"calculation",
			"subtract",
			"less"
		],
		"char": "➖",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_division_sign": {
		"keywords": [
			"divide",
			"math",
			"calculation"
		],
		"char": "➗",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_multiplication_x": {
		"keywords": [
			"math",
			"calculation"
		],
		"char": "✖️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"heavy_dollar_sign": {
		"keywords": [
			"money",
			"sales",
			"payment",
			"currency",
			"buck"
		],
		"char": "💲",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"currency_exchange": {
		"keywords": [
			"money",
			"sales",
			"dollar",
			"travel"
		],
		"char": "💱",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"copyright": {
		"keywords": [
			"ip",
			"license",
			"circle",
			"law",
			"legal"
		],
		"char": "©️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"registered": {
		"keywords": [
			"alphabet",
			"circle"
		],
		"char": "®️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"tm": {
		"keywords": [
			"trademark",
			"brand",
			"law",
			"legal"
		],
		"char": "™️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"end": {
		"keywords": [
			"words",
			"arrow"
		],
		"char": "🔚",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"back": {
		"keywords": [
			"arrow",
			"words",
			"return"
		],
		"char": "🔙",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"on": {
		"keywords": [
			"arrow",
			"words"
		],
		"char": "🔛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"top": {
		"keywords": [
			"words",
			"blue-square"
		],
		"char": "🔝",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"soon": {
		"keywords": [
			"arrow",
			"words"
		],
		"char": "🔜",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"ballot_box_with_check": {
		"keywords": [
			"ok",
			"agree",
			"confirm",
			"black-square",
			"vote",
			"election",
			"yes",
			"tick"
		],
		"char": "☑️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"radio_button": {
		"keywords": [
			"input",
			"old",
			"music",
			"circle"
		],
		"char": "🔘",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_circle": {
		"keywords": [
			"shape",
			"round"
		],
		"char": "⚪",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_circle": {
		"keywords": [
			"shape",
			"button",
			"round"
		],
		"char": "⚫",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"red_circle": {
		"keywords": [
			"shape",
			"error",
			"danger"
		],
		"char": "🔴",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"large_blue_circle": {
		"keywords": [
			"shape",
			"icon",
			"button"
		],
		"char": "🔵",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"small_orange_diamond": {
		"keywords": [
			"shape",
			"jewel",
			"gem"
		],
		"char": "🔸",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"small_blue_diamond": {
		"keywords": [
			"shape",
			"jewel",
			"gem"
		],
		"char": "🔹",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"large_orange_diamond": {
		"keywords": [
			"shape",
			"jewel",
			"gem"
		],
		"char": "🔶",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"large_blue_diamond": {
		"keywords": [
			"shape",
			"jewel",
			"gem"
		],
		"char": "🔷",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"small_red_triangle": {
		"keywords": [
			"shape",
			"direction",
			"up",
			"top"
		],
		"char": "🔺",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_small_square": {
		"keywords": [
			"shape",
			"icon"
		],
		"char": "▪️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_small_square": {
		"keywords": [
			"shape",
			"icon"
		],
		"char": "▫️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_large_square": {
		"keywords": [
			"shape",
			"icon",
			"button"
		],
		"char": "⬛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_large_square": {
		"keywords": [
			"shape",
			"icon",
			"stone",
			"button"
		],
		"char": "⬜",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"small_red_triangle_down": {
		"keywords": [
			"shape",
			"direction",
			"bottom"
		],
		"char": "🔻",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_medium_square": {
		"keywords": [
			"shape",
			"button",
			"icon"
		],
		"char": "◼️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_medium_square": {
		"keywords": [
			"shape",
			"stone",
			"icon"
		],
		"char": "◻️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_medium_small_square": {
		"keywords": [
			"icon",
			"shape",
			"button"
		],
		"char": "◾",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_medium_small_square": {
		"keywords": [
			"shape",
			"stone",
			"icon",
			"button"
		],
		"char": "◽",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_square_button": {
		"keywords": [
			"shape",
			"input",
			"frame"
		],
		"char": "🔲",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"white_square_button": {
		"keywords": [
			"shape",
			"input"
		],
		"char": "🔳",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"speaker": {
		"keywords": [
			"sound",
			"volume",
			"silence",
			"broadcast"
		],
		"char": "🔈",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"sound": {
		"keywords": [
			"volume",
			"speaker",
			"broadcast"
		],
		"char": "🔉",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"loud_sound": {
		"keywords": [
			"volume",
			"noise",
			"noisy",
			"speaker",
			"broadcast"
		],
		"char": "🔊",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"mute": {
		"keywords": [
			"sound",
			"volume",
			"silence",
			"quiet"
		],
		"char": "🔇",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"mega": {
		"keywords": [
			"sound",
			"speaker",
			"volume"
		],
		"char": "📣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"loudspeaker": {
		"keywords": [
			"volume",
			"sound"
		],
		"char": "📢",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"bell": {
		"keywords": [
			"sound",
			"notification",
			"christmas",
			"xmas",
			"chime"
		],
		"char": "🔔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"no_bell": {
		"keywords": [
			"sound",
			"volume",
			"mute",
			"quiet",
			"silent"
		],
		"char": "🔕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"black_joker": {
		"keywords": [
			"poker",
			"cards",
			"game",
			"play",
			"magic"
		],
		"char": "🃏",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"mahjong": {
		"keywords": [
			"game",
			"play",
			"chinese",
			"kanji"
		],
		"char": "🀄",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"spades": {
		"keywords": [
			"poker",
			"cards",
			"suits",
			"magic"
		],
		"char": "♠️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clubs": {
		"keywords": [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		"char": "♣️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"hearts": {
		"keywords": [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		"char": "♥️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"diamonds": {
		"keywords": [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		"char": "♦️",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"flower_playing_cards": {
		"keywords": [
			"game",
			"sunset",
			"red"
		],
		"char": "🎴",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"thought_balloon": {
		"keywords": [
			"bubble",
			"cloud",
			"speech",
			"thinking"
		],
		"char": "💭",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"right_anger_bubble": {
		"keywords": [
			"caption",
			"speech",
			"thinking",
			"mad"
		],
		"char": "🗯",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"speech_balloon": {
		"keywords": [
			"bubble",
			"words",
			"message",
			"talk",
			"chatting"
		],
		"char": "💬",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"left_speech_bubble": {
		"keywords": [
			"words",
			"message",
			"talk",
			"chatting"
		],
		"char": "🗨",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock1": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕐",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock2": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕑",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock3": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕒",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock4": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕓",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock5": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕔",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock6": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule",
			"dawn",
			"dusk"
		],
		"char": "🕕",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock7": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕖",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock8": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕗",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock9": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕘",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock10": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕙",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock11": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕚",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock12": {
		"keywords": [
			"time",
			"noon",
			"midnight",
			"midday",
			"late",
			"early",
			"schedule"
		],
		"char": "🕛",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock130": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕜",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock230": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕝",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock330": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕞",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock430": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕟",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock530": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕠",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock630": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕡",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock730": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕢",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock830": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕣",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock930": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕤",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock1030": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕥",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock1130": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕦",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"clock1230": {
		"keywords": [
			"time",
			"late",
			"early",
			"schedule"
		],
		"char": "🕧",
		"fitzpatrick_scale": false,
		"category": "symbols"
	},
	"afghanistan": {
		"keywords": [
			"af",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"aland_islands": {
		"keywords": [
			"Åland",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇽",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"albania": {
		"keywords": [
			"al",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"algeria": {
		"keywords": [
			"dz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇩🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"american_samoa": {
		"keywords": [
			"american",
			"ws",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"andorra": {
		"keywords": [
			"ad",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"angola": {
		"keywords": [
			"ao",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"anguilla": {
		"keywords": [
			"ai",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"antarctica": {
		"keywords": [
			"aq",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇶",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"antigua_barbuda": {
		"keywords": [
			"antigua",
			"barbuda",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"argentina": {
		"keywords": [
			"ar",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"armenia": {
		"keywords": [
			"am",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"aruba": {
		"keywords": [
			"aw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"australia": {
		"keywords": [
			"au",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"austria": {
		"keywords": [
			"at",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"azerbaijan": {
		"keywords": [
			"az",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bahamas": {
		"keywords": [
			"bs",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bahrain": {
		"keywords": [
			"bh",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bangladesh": {
		"keywords": [
			"bd",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"barbados": {
		"keywords": [
			"bb",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇧",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"belarus": {
		"keywords": [
			"by",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"belgium": {
		"keywords": [
			"be",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"belize": {
		"keywords": [
			"bz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"benin": {
		"keywords": [
			"bj",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇯",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bermuda": {
		"keywords": [
			"bm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bhutan": {
		"keywords": [
			"bt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bolivia": {
		"keywords": [
			"bo",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"caribbean_netherlands": {
		"keywords": [
			"bonaire",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇶",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bosnia_herzegovina": {
		"keywords": [
			"bosnia",
			"herzegovina",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"botswana": {
		"keywords": [
			"bw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"brazil": {
		"keywords": [
			"br",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"british_indian_ocean_territory": {
		"keywords": [
			"british",
			"indian",
			"ocean",
			"territory",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"british_virgin_islands": {
		"keywords": [
			"british",
			"virgin",
			"islands",
			"bvi",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"brunei": {
		"keywords": [
			"bn",
			"darussalam",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"bulgaria": {
		"keywords": [
			"bg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"burkina_faso": {
		"keywords": [
			"burkina",
			"faso",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"burundi": {
		"keywords": [
			"bi",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cape_verde": {
		"keywords": [
			"cabo",
			"verde",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇻",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cambodia": {
		"keywords": [
			"kh",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cameroon": {
		"keywords": [
			"cm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"canada": {
		"keywords": [
			"ca",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"canary_islands": {
		"keywords": [
			"canary",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cayman_islands": {
		"keywords": [
			"cayman",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"central_african_republic": {
		"keywords": [
			"central",
			"african",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"chad": {
		"keywords": [
			"td",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"chile": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cn": {
		"keywords": [
			"china",
			"chinese",
			"prc",
			"flag",
			"country",
			"nation",
			"banner"
		],
		"char": "🇨🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"christmas_island": {
		"keywords": [
			"christmas",
			"island",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇽",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cocos_islands": {
		"keywords": [
			"cocos",
			"keeling",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"colombia": {
		"keywords": [
			"co",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"comoros": {
		"keywords": [
			"km",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"congo_brazzaville": {
		"keywords": [
			"congo",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"congo_kinshasa": {
		"keywords": [
			"congo",
			"democratic",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cook_islands": {
		"keywords": [
			"cook",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"costa_rica": {
		"keywords": [
			"costa",
			"rica",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"croatia": {
		"keywords": [
			"hr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇭🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cuba": {
		"keywords": [
			"cu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"curacao": {
		"keywords": [
			"curaçao",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cyprus": {
		"keywords": [
			"cy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"czech_republic": {
		"keywords": [
			"cz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"denmark": {
		"keywords": [
			"dk",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇩🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"djibouti": {
		"keywords": [
			"dj",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇩🇯",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"dominica": {
		"keywords": [
			"dm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇩🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"dominican_republic": {
		"keywords": [
			"dominican",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇩🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ecuador": {
		"keywords": [
			"ec",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"egypt": {
		"keywords": [
			"eg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"el_salvador": {
		"keywords": [
			"el",
			"salvador",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇻",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"equatorial_guinea": {
		"keywords": [
			"equatorial",
			"gn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇶",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"eritrea": {
		"keywords": [
			"er",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"estonia": {
		"keywords": [
			"ee",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ethiopia": {
		"keywords": [
			"et",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"eu": {
		"keywords": [
			"european",
			"union",
			"flag",
			"banner"
		],
		"char": "🇪🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"falkland_islands": {
		"keywords": [
			"falkland",
			"islands",
			"malvinas",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇫🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"faroe_islands": {
		"keywords": [
			"faroe",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇫🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"fiji": {
		"keywords": [
			"fj",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇫🇯",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"finland": {
		"keywords": [
			"fi",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇫🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"fr": {
		"keywords": [
			"banner",
			"flag",
			"nation",
			"france",
			"french",
			"country"
		],
		"char": "🇫🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"french_guiana": {
		"keywords": [
			"french",
			"guiana",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"french_polynesia": {
		"keywords": [
			"french",
			"polynesia",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"french_southern_territories": {
		"keywords": [
			"french",
			"southern",
			"territories",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"gabon": {
		"keywords": [
			"ga",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"gambia": {
		"keywords": [
			"gm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"georgia": {
		"keywords": [
			"ge",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"de": {
		"keywords": [
			"german",
			"nation",
			"flag",
			"country",
			"banner"
		],
		"char": "🇩🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ghana": {
		"keywords": [
			"gh",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"gibraltar": {
		"keywords": [
			"gi",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"greece": {
		"keywords": [
			"gr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"greenland": {
		"keywords": [
			"gl",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"grenada": {
		"keywords": [
			"gd",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guadeloupe": {
		"keywords": [
			"gp",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇵",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guam": {
		"keywords": [
			"gu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guatemala": {
		"keywords": [
			"gt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guernsey": {
		"keywords": [
			"gg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guinea": {
		"keywords": [
			"gn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guinea_bissau": {
		"keywords": [
			"gw",
			"bissau",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"guyana": {
		"keywords": [
			"gy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"haiti": {
		"keywords": [
			"ht",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇭🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"honduras": {
		"keywords": [
			"hn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇭🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"hong_kong": {
		"keywords": [
			"hong",
			"kong",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇭🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"hungary": {
		"keywords": [
			"hu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇭🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"iceland": {
		"keywords": [
			"is",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"india": {
		"keywords": [
			"in",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"indonesia": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"iran": {
		"keywords": [
			"iran,",
			"islamic",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"iraq": {
		"keywords": [
			"iq",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇶",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ireland": {
		"keywords": [
			"ie",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"isle_of_man": {
		"keywords": [
			"isle",
			"man",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"israel": {
		"keywords": [
			"il",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"it": {
		"keywords": [
			"italy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇮🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"cote_divoire": {
		"keywords": [
			"ivory",
			"coast",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"jamaica": {
		"keywords": [
			"jm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇯🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"jp": {
		"keywords": [
			"japanese",
			"nation",
			"flag",
			"country",
			"banner"
		],
		"char": "🇯🇵",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"jersey": {
		"keywords": [
			"je",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇯🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"jordan": {
		"keywords": [
			"jo",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇯🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kazakhstan": {
		"keywords": [
			"kz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kenya": {
		"keywords": [
			"ke",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kiribati": {
		"keywords": [
			"ki",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kosovo": {
		"keywords": [
			"xk",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇽🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kuwait": {
		"keywords": [
			"kw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kyrgyzstan": {
		"keywords": [
			"kg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"laos": {
		"keywords": [
			"lao",
			"democratic",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"latvia": {
		"keywords": [
			"lv",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇻",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"lebanon": {
		"keywords": [
			"lb",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇧",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"lesotho": {
		"keywords": [
			"ls",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"liberia": {
		"keywords": [
			"lr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"libya": {
		"keywords": [
			"ly",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"liechtenstein": {
		"keywords": [
			"li",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"lithuania": {
		"keywords": [
			"lt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"luxembourg": {
		"keywords": [
			"lu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"macau": {
		"keywords": [
			"macao",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"macedonia": {
		"keywords": [
			"macedonia,",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"madagascar": {
		"keywords": [
			"mg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"malawi": {
		"keywords": [
			"mw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"malaysia": {
		"keywords": [
			"my",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"maldives": {
		"keywords": [
			"mv",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇻",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mali": {
		"keywords": [
			"ml",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"malta": {
		"keywords": [
			"mt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"marshall_islands": {
		"keywords": [
			"marshall",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"martinique": {
		"keywords": [
			"mq",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇶",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mauritania": {
		"keywords": [
			"mr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mauritius": {
		"keywords": [
			"mu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mayotte": {
		"keywords": [
			"yt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇾🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mexico": {
		"keywords": [
			"mx",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇽",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"micronesia": {
		"keywords": [
			"micronesia,",
			"federated",
			"states",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇫🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"moldova": {
		"keywords": [
			"moldova,",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"monaco": {
		"keywords": [
			"mc",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mongolia": {
		"keywords": [
			"mn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"montenegro": {
		"keywords": [
			"me",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"montserrat": {
		"keywords": [
			"ms",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"morocco": {
		"keywords": [
			"ma",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"mozambique": {
		"keywords": [
			"mz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"myanmar": {
		"keywords": [
			"mm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"namibia": {
		"keywords": [
			"na",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"nauru": {
		"keywords": [
			"nr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"nepal": {
		"keywords": [
			"np",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇵",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"netherlands": {
		"keywords": [
			"nl",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"new_caledonia": {
		"keywords": [
			"new",
			"caledonia",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"new_zealand": {
		"keywords": [
			"new",
			"zealand",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"nicaragua": {
		"keywords": [
			"ni",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"niger": {
		"keywords": [
			"ne",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"nigeria": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"niue": {
		"keywords": [
			"nu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"norfolk_island": {
		"keywords": [
			"norfolk",
			"island",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"northern_mariana_islands": {
		"keywords": [
			"northern",
			"mariana",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇲🇵",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"north_korea": {
		"keywords": [
			"north",
			"korea",
			"nation",
			"flag",
			"country",
			"banner"
		],
		"char": "🇰🇵",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"norway": {
		"keywords": [
			"no",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇳🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"oman": {
		"keywords": [
			"om_symbol",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇴🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"pakistan": {
		"keywords": [
			"pk",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"palau": {
		"keywords": [
			"pw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"palestinian_territories": {
		"keywords": [
			"palestine",
			"palestinian",
			"territories",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"panama": {
		"keywords": [
			"pa",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"papua_new_guinea": {
		"keywords": [
			"papua",
			"new",
			"guinea",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"paraguay": {
		"keywords": [
			"py",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"peru": {
		"keywords": [
			"pe",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"philippines": {
		"keywords": [
			"ph",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"pitcairn_islands": {
		"keywords": [
			"pitcairn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"poland": {
		"keywords": [
			"pl",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"portugal": {
		"keywords": [
			"pt",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"puerto_rico": {
		"keywords": [
			"puerto",
			"rico",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"qatar": {
		"keywords": [
			"qa",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇶🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"reunion": {
		"keywords": [
			"réunion",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇷🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"romania": {
		"keywords": [
			"ro",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇷🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ru": {
		"keywords": [
			"russian",
			"federation",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇷🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"rwanda": {
		"keywords": [
			"rw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇷🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_barthelemy": {
		"keywords": [
			"saint",
			"barthélemy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇧🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_helena": {
		"keywords": [
			"saint",
			"helena",
			"ascension",
			"tristan",
			"cunha",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_kitts_nevis": {
		"keywords": [
			"saint",
			"kitts",
			"nevis",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇰🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_lucia": {
		"keywords": [
			"saint",
			"lucia",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_pierre_miquelon": {
		"keywords": [
			"saint",
			"pierre",
			"miquelon",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇵🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"st_vincent_grenadines": {
		"keywords": [
			"saint",
			"vincent",
			"grenadines",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"samoa": {
		"keywords": [
			"ws",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇼🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"san_marino": {
		"keywords": [
			"san",
			"marino",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sao_tome_principe": {
		"keywords": [
			"sao",
			"tome",
			"principe",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"saudi_arabia": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"senegal": {
		"keywords": [
			"sn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"serbia": {
		"keywords": [
			"rs",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇷🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"seychelles": {
		"keywords": [
			"sc",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sierra_leone": {
		"keywords": [
			"sierra",
			"leone",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"singapore": {
		"keywords": [
			"sg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sint_maarten": {
		"keywords": [
			"sint",
			"maarten",
			"dutch",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇽",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"slovakia": {
		"keywords": [
			"sk",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"slovenia": {
		"keywords": [
			"si",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"solomon_islands": {
		"keywords": [
			"solomon",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇧",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"somalia": {
		"keywords": [
			"so",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"south_africa": {
		"keywords": [
			"south",
			"africa",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇿🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"south_georgia_south_sandwich_islands": {
		"keywords": [
			"south",
			"georgia",
			"sandwich",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇬🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"kr": {
		"keywords": [
			"south",
			"korea",
			"nation",
			"flag",
			"country",
			"banner"
		],
		"char": "🇰🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"south_sudan": {
		"keywords": [
			"south",
			"sd",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"es": {
		"keywords": [
			"spain",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sri_lanka": {
		"keywords": [
			"sri",
			"lanka",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇱🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sudan": {
		"keywords": [
			"sd",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇩",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"suriname": {
		"keywords": [
			"sr",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"swaziland": {
		"keywords": [
			"sz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"sweden": {
		"keywords": [
			"se",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"switzerland": {
		"keywords": [
			"ch",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇨🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"syria": {
		"keywords": [
			"syrian",
			"arab",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇸🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"taiwan": {
		"keywords": [
			"tw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tajikistan": {
		"keywords": [
			"tj",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇯",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tanzania": {
		"keywords": [
			"tanzania,",
			"united",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"thailand": {
		"keywords": [
			"th",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"timor_leste": {
		"keywords": [
			"timor",
			"leste",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇱",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"togo": {
		"keywords": [
			"tg",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tokelau": {
		"keywords": [
			"tk",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇰",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tonga": {
		"keywords": [
			"to",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇴",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"trinidad_tobago": {
		"keywords": [
			"trinidad",
			"tobago",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇹",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tunisia": {
		"keywords": [
			"tn",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tr": {
		"keywords": [
			"turkey",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇷",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"turkmenistan": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"turks_caicos_islands": {
		"keywords": [
			"turks",
			"caicos",
			"islands",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇨",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"tuvalu": {
		"keywords": [
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇹🇻",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"uganda": {
		"keywords": [
			"ug",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇺🇬",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"ukraine": {
		"keywords": [
			"ua",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇺🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"united_arab_emirates": {
		"keywords": [
			"united",
			"arab",
			"emirates",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇦🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"uk": {
		"keywords": [
			"united",
			"kingdom",
			"great",
			"britain",
			"northern",
			"ireland",
			"flag",
			"nation",
			"country",
			"banner",
			"british",
			"UK",
			"english",
			"england",
			"union jack"
		],
		"char": "🇬🇧",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"us": {
		"keywords": [
			"united",
			"states",
			"america",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇺🇸",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"us_virgin_islands": {
		"keywords": [
			"virgin",
			"islands",
			"us",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇮",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"uruguay": {
		"keywords": [
			"uy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇺🇾",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"uzbekistan": {
		"keywords": [
			"uz",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇺🇿",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"vanuatu": {
		"keywords": [
			"vu",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇺",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"vatican_city": {
		"keywords": [
			"vatican",
			"city",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇦",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"venezuela": {
		"keywords": [
			"ve",
			"bolivarian",
			"republic",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"vietnam": {
		"keywords": [
			"viet",
			"nam",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇻🇳",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"wallis_futuna": {
		"keywords": [
			"wallis",
			"futuna",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇼🇫",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"western_sahara": {
		"keywords": [
			"western",
			"sahara",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇪🇭",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"yemen": {
		"keywords": [
			"ye",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇾🇪",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"zambia": {
		"keywords": [
			"zm",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇿🇲",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"zimbabwe": {
		"keywords": [
			"zw",
			"flag",
			"nation",
			"country",
			"banner"
		],
		"char": "🇿🇼",
		"fitzpatrick_scale": false,
		"category": "flags"
	},
	"octocat": {
		"keywords": [
			"animal",
			"octopus",
			"github",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"shipit": {
		"keywords": [
			"squirrel",
			"detective",
			"animal",
			"sherlock",
			"inspector",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"bowtie": {
		"keywords": [
			"face",
			"formal",
			"fashion",
			"suit",
			"classy",
			"magic",
			"circus"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"neckbeard": {
		"keywords": [
			"nerdy",
			"face",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"trollface": {
		"keywords": [
			"internet",
			"meme",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"godmode": {
		"keywords": [
			"doom",
			"oldschool"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"goberserk": {
		"keywords": [
			"doom",
			"rage",
			"bloody",
			"hurt"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"finnadie": {
		"keywords": [
			"doom",
			"oldschool"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"feelsgood": {
		"keywords": [
			"doom",
			"oldschool"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"rage1": {
		"keywords": [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"rage2": {
		"keywords": [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"rage3": {
		"keywords": [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"rage4": {
		"keywords": [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"suspect": {
		"keywords": [
			"mad",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	},
	"hurtrealbad": {
		"keywords": [
			"mad",
			"injured",
			"doom",
			"oldschool",
			"custom_"
		],
		"char": null,
		"fitzpatrick_scale": false,
		"category": "_custom"
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  lib: __webpack_require__(1),
  ordered: __webpack_require__(3),
  fitzpatrick_scale_modifiers: ["🏻", "🏼", "🏽", "🏾", "🏿"]
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = [
	"grinning",
	"grimacing",
	"grin",
	"joy",
	"rofl",
	"smiley",
	"smile",
	"sweat_smile",
	"laughing",
	"innocent",
	"wink",
	"blush",
	"slightly_smiling_face",
	"upside_down_face",
	"relaxed",
	"yum",
	"relieved",
	"heart_eyes",
	"kissing_heart",
	"kissing",
	"kissing_smiling_eyes",
	"kissing_closed_eyes",
	"stuck_out_tongue_winking_eye",
	"stuck_out_tongue_closed_eyes",
	"stuck_out_tongue",
	"money_mouth_face",
	"nerd_face",
	"sunglasses",
	"clown_face",
	"cowboy_hat_face",
	"hugs",
	"smirk",
	"no_mouth",
	"neutral_face",
	"expressionless",
	"unamused",
	"roll_eyes",
	"thinking",
	"lying_face",
	"flushed",
	"disappointed",
	"worried",
	"angry",
	"rage",
	"pensive",
	"confused",
	"slightly_frowning_face",
	"frowning_face",
	"persevere",
	"confounded",
	"tired_face",
	"weary",
	"triumph",
	"open_mouth",
	"scream",
	"fearful",
	"cold_sweat",
	"hushed",
	"frowning",
	"anguished",
	"cry",
	"disappointed_relieved",
	"drooling_face",
	"sleepy",
	"sweat",
	"sob",
	"dizzy_face",
	"astonished",
	"zipper_mouth_face",
	"nauseated_face",
	"sneezing_face",
	"mask",
	"face_with_thermometer",
	"face_with_head_bandage",
	"sleeping",
	"zzz",
	"poop",
	"smiling_imp",
	"imp",
	"japanese_ogre",
	"japanese_goblin",
	"skull",
	"ghost",
	"alien",
	"robot",
	"smiley_cat",
	"smile_cat",
	"joy_cat",
	"heart_eyes_cat",
	"smirk_cat",
	"kissing_cat",
	"scream_cat",
	"crying_cat_face",
	"pouting_cat",
	"raised_hands",
	"clap",
	"wave",
	"call_me_hand",
	"+1",
	"-1",
	"facepunch",
	"fist",
	"fist_left",
	"fist_right",
	"v",
	"ok_hand",
	"raised_hand",
	"raised_back_of_hand",
	"open_hands",
	"muscle",
	"pray",
	"handshake",
	"point_up",
	"point_up_2",
	"point_down",
	"point_left",
	"point_right",
	"fu",
	"raised_hand_with_fingers_splayed",
	"metal",
	"crossed_fingers",
	"vulcan_salute",
	"writing_hand",
	"selfie",
	"nail_care",
	"lips",
	"tongue",
	"ear",
	"nose",
	"eye",
	"eyes",
	"bust_in_silhouette",
	"busts_in_silhouette",
	"speaking_head",
	"baby",
	"boy",
	"girl",
	"man",
	"woman",
	"blonde_woman",
	"blonde_man",
	"older_man",
	"older_woman",
	"man_with_gua_pi_mao",
	"woman_with_turban",
	"man_with_turban",
	"policewoman",
	"policeman",
	"construction_worker_woman",
	"construction_worker_man",
	"guardswoman",
	"guardsman",
	"female_detective",
	"male_detective",
	"woman_health_worker",
	"man_health_worker",
	"woman_farmer",
	"man_farmer",
	"woman_cook",
	"man_cook",
	"woman_student",
	"man_student",
	"woman_singer",
	"man_singer",
	"woman_teacher",
	"man_teacher",
	"woman_factory_worker",
	"man_factory_worker",
	"woman_technologist",
	"man_technologist",
	"woman_office_worker",
	"man_office_worker",
	"woman_mechanic",
	"man_mechanic",
	"woman_scientist",
	"man_scientist",
	"woman_artist",
	"man_artist",
	"woman_firefighter",
	"man_firefighter",
	"woman_pilot",
	"man_pilot",
	"woman_astronaut",
	"man_astronaut",
	"woman_judge",
	"man_judge",
	"mrs_claus",
	"santa",
	"angel",
	"pregnant_woman",
	"princess",
	"prince",
	"bride_with_veil",
	"man_in_tuxedo",
	"running_woman",
	"running_man",
	"walking_woman",
	"walking_man",
	"dancer",
	"man_dancing",
	"dancing_women",
	"dancing_men",
	"couple",
	"two_men_holding_hands",
	"two_women_holding_hands",
	"bowing_woman",
	"bowing_man",
	"man_facepalming",
	"woman_facepalming",
	"woman_shrugging",
	"man_shrugging",
	"tipping_hand_woman",
	"tipping_hand_man",
	"no_good_woman",
	"no_good_man",
	"ok_woman",
	"ok_man",
	"raising_hand_woman",
	"raising_hand_man",
	"pouting_woman",
	"pouting_man",
	"frowning_woman",
	"frowning_man",
	"haircut_woman",
	"haircut_man",
	"massage_woman",
	"massage_man",
	"couple_with_heart_woman_man",
	"couple_with_heart_woman_woman",
	"couple_with_heart_man_man",
	"couplekiss_man_woman",
	"couplekiss_woman_woman",
	"couplekiss_man_man",
	"family_man_woman_boy",
	"family_man_woman_girl",
	"family_man_woman_girl_boy",
	"family_man_woman_boy_boy",
	"family_man_woman_girl_girl",
	"family_woman_woman_boy",
	"family_woman_woman_girl",
	"family_woman_woman_girl_boy",
	"family_woman_woman_boy_boy",
	"family_woman_woman_girl_girl",
	"family_man_man_boy",
	"family_man_man_girl",
	"family_man_man_girl_boy",
	"family_man_man_boy_boy",
	"family_man_man_girl_girl",
	"family_woman_boy",
	"family_woman_girl",
	"family_woman_girl_boy",
	"family_woman_boy_boy",
	"family_woman_girl_girl",
	"family_man_boy",
	"family_man_girl",
	"family_man_girl_boy",
	"family_man_boy_boy",
	"family_man_girl_girl",
	"womans_clothes",
	"tshirt",
	"jeans",
	"necktie",
	"dress",
	"bikini",
	"kimono",
	"lipstick",
	"kiss",
	"footprints",
	"high_heel",
	"sandal",
	"boot",
	"mans_shoe",
	"athletic_shoe",
	"womans_hat",
	"tophat",
	"rescue_worker_helmet",
	"mortar_board",
	"crown",
	"school_satchel",
	"pouch",
	"purse",
	"handbag",
	"briefcase",
	"eyeglasses",
	"dark_sunglasses",
	"ring",
	"closed_umbrella",
	"dog",
	"cat",
	"mouse",
	"hamster",
	"rabbit",
	"fox_face",
	"bear",
	"panda_face",
	"koala",
	"tiger",
	"lion",
	"cow",
	"pig",
	"pig_nose",
	"frog",
	"squid",
	"octopus",
	"shrimp",
	"monkey_face",
	"gorilla",
	"see_no_evil",
	"hear_no_evil",
	"speak_no_evil",
	"monkey",
	"chicken",
	"penguin",
	"bird",
	"baby_chick",
	"hatching_chick",
	"hatched_chick",
	"duck",
	"eagle",
	"owl",
	"bat",
	"wolf",
	"boar",
	"horse",
	"unicorn",
	"honeybee",
	"bug",
	"butterfly",
	"snail",
	"beetle",
	"ant",
	"spider",
	"scorpion",
	"crab",
	"snake",
	"lizard",
	"turtle",
	"tropical_fish",
	"fish",
	"blowfish",
	"dolphin",
	"shark",
	"whale",
	"whale2",
	"crocodile",
	"leopard",
	"tiger2",
	"water_buffalo",
	"ox",
	"cow2",
	"deer",
	"dromedary_camel",
	"camel",
	"elephant",
	"rhinoceros",
	"goat",
	"ram",
	"sheep",
	"racehorse",
	"pig2",
	"rat",
	"mouse2",
	"rooster",
	"turkey",
	"dove",
	"dog2",
	"poodle",
	"cat2",
	"rabbit2",
	"chipmunk",
	"paw_prints",
	"dragon",
	"dragon_face",
	"cactus",
	"christmas_tree",
	"evergreen_tree",
	"deciduous_tree",
	"palm_tree",
	"seedling",
	"herb",
	"shamrock",
	"four_leaf_clover",
	"bamboo",
	"tanabata_tree",
	"leaves",
	"fallen_leaf",
	"maple_leaf",
	"ear_of_rice",
	"hibiscus",
	"sunflower",
	"rose",
	"wilted_flower",
	"tulip",
	"blossom",
	"cherry_blossom",
	"bouquet",
	"mushroom",
	"chestnut",
	"jack_o_lantern",
	"shell",
	"spider_web",
	"earth_americas",
	"earth_africa",
	"earth_asia",
	"full_moon",
	"waning_gibbous_moon",
	"last_quarter_moon",
	"waning_crescent_moon",
	"new_moon",
	"waxing_crescent_moon",
	"first_quarter_moon",
	"waxing_gibbous_moon",
	"new_moon_with_face",
	"full_moon_with_face",
	"first_quarter_moon_with_face",
	"last_quarter_moon_with_face",
	"sun_with_face",
	"crescent_moon",
	"star",
	"star2",
	"dizzy",
	"sparkles",
	"comet",
	"sunny",
	"sun_behind_small_cloud",
	"partly_sunny",
	"sun_behind_large_cloud",
	"sun_behind_rain_cloud",
	"cloud",
	"cloud_with_rain",
	"cloud_with_lightning_and_rain",
	"cloud_with_lightning",
	"zap",
	"fire",
	"boom",
	"snowflake",
	"cloud_with_snow",
	"snowman",
	"snowman_with_snow",
	"wind_face",
	"dash",
	"tornado",
	"fog",
	"open_umbrella",
	"umbrella",
	"droplet",
	"sweat_drops",
	"ocean",
	"green_apple",
	"apple",
	"pear",
	"tangerine",
	"lemon",
	"banana",
	"watermelon",
	"grapes",
	"strawberry",
	"melon",
	"cherries",
	"peach",
	"pineapple",
	"kiwi_fruit",
	"avocado",
	"tomato",
	"eggplant",
	"cucumber",
	"carrot",
	"hot_pepper",
	"potato",
	"corn",
	"sweet_potato",
	"peanuts",
	"honey_pot",
	"croissant",
	"bread",
	"baguette_bread",
	"cheese",
	"egg",
	"bacon",
	"pancakes",
	"poultry_leg",
	"meat_on_bone",
	"fried_shrimp",
	"fried_egg",
	"hamburger",
	"fries",
	"stuffed_flatbread",
	"hotdog",
	"pizza",
	"spaghetti",
	"taco",
	"burrito",
	"green_salad",
	"shallow_pan_of_food",
	"ramen",
	"stew",
	"fish_cake",
	"sushi",
	"bento",
	"curry",
	"rice_ball",
	"rice",
	"rice_cracker",
	"oden",
	"dango",
	"shaved_ice",
	"ice_cream",
	"icecream",
	"cake",
	"birthday",
	"custard",
	"candy",
	"lollipop",
	"chocolate_bar",
	"popcorn",
	"doughnut",
	"cookie",
	"milk_glass",
	"beer",
	"beers",
	"clinking_glasses",
	"wine_glass",
	"tumbler_glass",
	"cocktail",
	"tropical_drink",
	"champagne",
	"sake",
	"tea",
	"coffee",
	"baby_bottle",
	"spoon",
	"fork_and_knife",
	"plate_with_cutlery",
	"soccer",
	"basketball",
	"football",
	"baseball",
	"tennis",
	"volleyball",
	"rugby_football",
	"8ball",
	"golf",
	"golfing_woman",
	"golfing_man",
	"ping_pong",
	"badminton",
	"goal_net",
	"ice_hockey",
	"field_hockey",
	"cricket",
	"ski",
	"skier",
	"snowboarder",
	"person_fencing",
	"women_wrestling",
	"men_wrestling",
	"woman_cartwheeling",
	"man_cartwheeling",
	"woman_playing_handball",
	"man_playing_handball",
	"ice_skate",
	"bow_and_arrow",
	"fishing_pole_and_fish",
	"boxing_glove",
	"martial_arts_uniform",
	"rowing_woman",
	"rowing_man",
	"swimming_woman",
	"swimming_man",
	"woman_playing_water_polo",
	"man_playing_water_polo",
	"surfing_woman",
	"surfing_man",
	"bath",
	"basketball_woman",
	"basketball_man",
	"weight_lifting_woman",
	"weight_lifting_man",
	"biking_woman",
	"biking_man",
	"mountain_biking_woman",
	"mountain_biking_man",
	"horse_racing",
	"business_suit_levitating",
	"trophy",
	"running_shirt_with_sash",
	"medal_sports",
	"medal_military",
	"1st_place_medal",
	"2nd_place_medal",
	"3rd_place_medal",
	"reminder_ribbon",
	"rosette",
	"ticket",
	"tickets",
	"performing_arts",
	"art",
	"circus_tent",
	"woman_juggling",
	"man_juggling",
	"microphone",
	"headphones",
	"musical_score",
	"musical_keyboard",
	"drum",
	"saxophone",
	"trumpet",
	"guitar",
	"violin",
	"clapper",
	"video_game",
	"space_invader",
	"dart",
	"game_die",
	"slot_machine",
	"bowling",
	"red_car",
	"taxi",
	"blue_car",
	"bus",
	"trolleybus",
	"racing_car",
	"police_car",
	"ambulance",
	"fire_engine",
	"minibus",
	"truck",
	"articulated_lorry",
	"tractor",
	"kick_scooter",
	"motorcycle",
	"bike",
	"motor_scooter",
	"rotating_light",
	"oncoming_police_car",
	"oncoming_bus",
	"oncoming_automobile",
	"oncoming_taxi",
	"aerial_tramway",
	"mountain_cableway",
	"suspension_railway",
	"railway_car",
	"train",
	"monorail",
	"bullettrain_side",
	"bullettrain_front",
	"light_rail",
	"mountain_railway",
	"steam_locomotive",
	"train2",
	"metro",
	"tram",
	"station",
	"helicopter",
	"small_airplane",
	"airplane",
	"flight_departure",
	"flight_arrival",
	"sailboat",
	"motor_boat",
	"speedboat",
	"ferry",
	"passenger_ship",
	"rocket",
	"artificial_satellite",
	"seat",
	"canoe",
	"anchor",
	"construction",
	"fuelpump",
	"busstop",
	"vertical_traffic_light",
	"traffic_light",
	"checkered_flag",
	"ship",
	"ferris_wheel",
	"roller_coaster",
	"carousel_horse",
	"building_construction",
	"foggy",
	"tokyo_tower",
	"factory",
	"fountain",
	"rice_scene",
	"mountain",
	"mountain_snow",
	"mount_fuji",
	"volcano",
	"japan",
	"camping",
	"tent",
	"national_park",
	"motorway",
	"railway_track",
	"sunrise",
	"sunrise_over_mountains",
	"desert",
	"beach_umbrella",
	"desert_island",
	"city_sunrise",
	"city_sunset",
	"cityscape",
	"night_with_stars",
	"bridge_at_night",
	"milky_way",
	"stars",
	"sparkler",
	"fireworks",
	"rainbow",
	"houses",
	"european_castle",
	"japanese_castle",
	"stadium",
	"statue_of_liberty",
	"house",
	"house_with_garden",
	"derelict_house",
	"office",
	"department_store",
	"post_office",
	"european_post_office",
	"hospital",
	"bank",
	"hotel",
	"convenience_store",
	"school",
	"love_hotel",
	"wedding",
	"classical_building",
	"church",
	"mosque",
	"synagogue",
	"kaaba",
	"shinto_shrine",
	"watch",
	"iphone",
	"calling",
	"computer",
	"keyboard",
	"desktop_computer",
	"printer",
	"computer_mouse",
	"trackball",
	"joystick",
	"clamp",
	"minidisc",
	"floppy_disk",
	"cd",
	"dvd",
	"vhs",
	"camera",
	"camera_flash",
	"video_camera",
	"movie_camera",
	"film_projector",
	"film_strip",
	"telephone_receiver",
	"phone",
	"pager",
	"fax",
	"tv",
	"radio",
	"studio_microphone",
	"level_slider",
	"control_knobs",
	"stopwatch",
	"timer_clock",
	"alarm_clock",
	"mantelpiece_clock",
	"hourglass_flowing_sand",
	"hourglass",
	"satellite",
	"battery",
	"electric_plug",
	"bulb",
	"flashlight",
	"candle",
	"wastebasket",
	"oil_drum",
	"money_with_wings",
	"dollar",
	"yen",
	"euro",
	"pound",
	"moneybag",
	"credit_card",
	"gem",
	"balance_scale",
	"wrench",
	"hammer",
	"hammer_and_pick",
	"hammer_and_wrench",
	"pick",
	"nut_and_bolt",
	"gear",
	"chains",
	"gun",
	"bomb",
	"hocho",
	"dagger",
	"crossed_swords",
	"shield",
	"smoking",
	"skull_and_crossbones",
	"coffin",
	"funeral_urn",
	"amphora",
	"crystal_ball",
	"prayer_beads",
	"barber",
	"alembic",
	"telescope",
	"microscope",
	"hole",
	"pill",
	"syringe",
	"thermometer",
	"label",
	"bookmark",
	"toilet",
	"shower",
	"bathtub",
	"key",
	"old_key",
	"couch_and_lamp",
	"sleeping_bed",
	"bed",
	"door",
	"bellhop_bell",
	"framed_picture",
	"world_map",
	"parasol_on_ground",
	"moyai",
	"shopping",
	"shopping_cart",
	"balloon",
	"flags",
	"ribbon",
	"gift",
	"confetti_ball",
	"tada",
	"dolls",
	"wind_chime",
	"crossed_flags",
	"izakaya_lantern",
	"email",
	"envelope_with_arrow",
	"incoming_envelope",
	"e-mail",
	"love_letter",
	"postbox",
	"mailbox_closed",
	"mailbox",
	"mailbox_with_mail",
	"mailbox_with_no_mail",
	"package",
	"postal_horn",
	"inbox_tray",
	"outbox_tray",
	"scroll",
	"page_with_curl",
	"bookmark_tabs",
	"bar_chart",
	"chart_with_upwards_trend",
	"chart_with_downwards_trend",
	"page_facing_up",
	"date",
	"calendar",
	"spiral_calendar",
	"card_index",
	"card_file_box",
	"ballot_box",
	"file_cabinet",
	"clipboard",
	"spiral_notepad",
	"file_folder",
	"open_file_folder",
	"card_index_dividers",
	"newspaper_roll",
	"newspaper",
	"notebook",
	"closed_book",
	"green_book",
	"blue_book",
	"orange_book",
	"notebook_with_decorative_cover",
	"ledger",
	"books",
	"open_book",
	"link",
	"paperclip",
	"paperclips",
	"scissors",
	"triangular_ruler",
	"straight_ruler",
	"pushpin",
	"round_pushpin",
	"triangular_flag_on_post",
	"white_flag",
	"black_flag",
	"rainbow_flag",
	"closed_lock_with_key",
	"lock",
	"unlock",
	"lock_with_ink_pen",
	"pen",
	"fountain_pen",
	"black_nib",
	"memo",
	"pencil2",
	"crayon",
	"paintbrush",
	"mag",
	"mag_right",
	"heart",
	"yellow_heart",
	"green_heart",
	"blue_heart",
	"purple_heart",
	"black_heart",
	"broken_heart",
	"heavy_heart_exclamation",
	"two_hearts",
	"revolving_hearts",
	"heartbeat",
	"heartpulse",
	"sparkling_heart",
	"cupid",
	"gift_heart",
	"heart_decoration",
	"peace_symbol",
	"latin_cross",
	"star_and_crescent",
	"om",
	"wheel_of_dharma",
	"star_of_david",
	"six_pointed_star",
	"menorah",
	"yin_yang",
	"orthodox_cross",
	"place_of_worship",
	"ophiuchus",
	"aries",
	"taurus",
	"gemini",
	"cancer",
	"leo",
	"virgo",
	"libra",
	"scorpius",
	"sagittarius",
	"capricorn",
	"aquarius",
	"pisces",
	"id",
	"atom_symbol",
	"u7a7a",
	"u5272",
	"radioactive",
	"biohazard",
	"mobile_phone_off",
	"vibration_mode",
	"u6709",
	"u7121",
	"u7533",
	"u55b6",
	"u6708",
	"eight_pointed_black_star",
	"vs",
	"accept",
	"white_flower",
	"ideograph_advantage",
	"secret",
	"congratulations",
	"u5408",
	"u6e80",
	"u7981",
	"a",
	"b",
	"ab",
	"cl",
	"o2",
	"sos",
	"no_entry",
	"name_badge",
	"no_entry_sign",
	"x",
	"o",
	"stop_sign",
	"anger",
	"hotsprings",
	"no_pedestrians",
	"do_not_litter",
	"no_bicycles",
	"non-potable_water",
	"underage",
	"no_mobile_phones",
	"exclamation",
	"grey_exclamation",
	"question",
	"grey_question",
	"bangbang",
	"interrobang",
	"100",
	"low_brightness",
	"high_brightness",
	"trident",
	"fleur_de_lis",
	"part_alternation_mark",
	"warning",
	"children_crossing",
	"beginner",
	"recycle",
	"u6307",
	"chart",
	"sparkle",
	"eight_spoked_asterisk",
	"negative_squared_cross_mark",
	"white_check_mark",
	"diamond_shape_with_a_dot_inside",
	"cyclone",
	"loop",
	"globe_with_meridians",
	"m",
	"atm",
	"sa",
	"passport_control",
	"customs",
	"baggage_claim",
	"left_luggage",
	"wheelchair",
	"no_smoking",
	"wc",
	"parking",
	"potable_water",
	"mens",
	"womens",
	"baby_symbol",
	"restroom",
	"put_litter_in_its_place",
	"cinema",
	"signal_strength",
	"koko",
	"ng",
	"ok",
	"up",
	"cool",
	"new",
	"free",
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"keycap_ten",
	"asterisk",
	"1234",
	"arrow_forward",
	"pause_button",
	"next_track_button",
	"stop_button",
	"record_button",
	"play_or_pause_button",
	"previous_track_button",
	"fast_forward",
	"rewind",
	"twisted_rightwards_arrows",
	"repeat",
	"repeat_one",
	"arrow_backward",
	"arrow_up_small",
	"arrow_down_small",
	"arrow_double_up",
	"arrow_double_down",
	"arrow_right",
	"arrow_left",
	"arrow_up",
	"arrow_down",
	"arrow_upper_right",
	"arrow_lower_right",
	"arrow_lower_left",
	"arrow_upper_left",
	"arrow_up_down",
	"left_right_arrow",
	"arrows_counterclockwise",
	"arrow_right_hook",
	"leftwards_arrow_with_hook",
	"arrow_heading_up",
	"arrow_heading_down",
	"hash",
	"information_source",
	"abc",
	"abcd",
	"capital_abcd",
	"symbols",
	"musical_note",
	"notes",
	"wavy_dash",
	"curly_loop",
	"heavy_check_mark",
	"arrows_clockwise",
	"heavy_plus_sign",
	"heavy_minus_sign",
	"heavy_division_sign",
	"heavy_multiplication_x",
	"heavy_dollar_sign",
	"currency_exchange",
	"copyright",
	"registered",
	"tm",
	"end",
	"back",
	"on",
	"top",
	"soon",
	"ballot_box_with_check",
	"radio_button",
	"white_circle",
	"black_circle",
	"red_circle",
	"large_blue_circle",
	"small_orange_diamond",
	"small_blue_diamond",
	"large_orange_diamond",
	"large_blue_diamond",
	"small_red_triangle",
	"black_small_square",
	"white_small_square",
	"black_large_square",
	"white_large_square",
	"small_red_triangle_down",
	"black_medium_square",
	"white_medium_square",
	"black_medium_small_square",
	"white_medium_small_square",
	"black_square_button",
	"white_square_button",
	"speaker",
	"sound",
	"loud_sound",
	"mute",
	"mega",
	"loudspeaker",
	"bell",
	"no_bell",
	"black_joker",
	"mahjong",
	"spades",
	"clubs",
	"hearts",
	"diamonds",
	"flower_playing_cards",
	"thought_balloon",
	"right_anger_bubble",
	"speech_balloon",
	"left_speech_bubble",
	"clock1",
	"clock2",
	"clock3",
	"clock4",
	"clock5",
	"clock6",
	"clock7",
	"clock8",
	"clock9",
	"clock10",
	"clock11",
	"clock12",
	"clock130",
	"clock230",
	"clock330",
	"clock430",
	"clock530",
	"clock630",
	"clock730",
	"clock830",
	"clock930",
	"clock1030",
	"clock1130",
	"clock1230",
	"afghanistan",
	"aland_islands",
	"albania",
	"algeria",
	"american_samoa",
	"andorra",
	"angola",
	"anguilla",
	"antarctica",
	"antigua_barbuda",
	"argentina",
	"armenia",
	"aruba",
	"australia",
	"austria",
	"azerbaijan",
	"bahamas",
	"bahrain",
	"bangladesh",
	"barbados",
	"belarus",
	"belgium",
	"belize",
	"benin",
	"bermuda",
	"bhutan",
	"bolivia",
	"caribbean_netherlands",
	"bosnia_herzegovina",
	"botswana",
	"brazil",
	"british_indian_ocean_territory",
	"british_virgin_islands",
	"brunei",
	"bulgaria",
	"burkina_faso",
	"burundi",
	"cape_verde",
	"cambodia",
	"cameroon",
	"canada",
	"canary_islands",
	"cayman_islands",
	"central_african_republic",
	"chad",
	"chile",
	"cn",
	"christmas_island",
	"cocos_islands",
	"colombia",
	"comoros",
	"congo_brazzaville",
	"congo_kinshasa",
	"cook_islands",
	"costa_rica",
	"croatia",
	"cuba",
	"curacao",
	"cyprus",
	"czech_republic",
	"denmark",
	"djibouti",
	"dominica",
	"dominican_republic",
	"ecuador",
	"egypt",
	"el_salvador",
	"equatorial_guinea",
	"eritrea",
	"estonia",
	"ethiopia",
	"eu",
	"falkland_islands",
	"faroe_islands",
	"fiji",
	"finland",
	"fr",
	"french_guiana",
	"french_polynesia",
	"french_southern_territories",
	"gabon",
	"gambia",
	"georgia",
	"de",
	"ghana",
	"gibraltar",
	"greece",
	"greenland",
	"grenada",
	"guadeloupe",
	"guam",
	"guatemala",
	"guernsey",
	"guinea",
	"guinea_bissau",
	"guyana",
	"haiti",
	"honduras",
	"hong_kong",
	"hungary",
	"iceland",
	"india",
	"indonesia",
	"iran",
	"iraq",
	"ireland",
	"isle_of_man",
	"israel",
	"it",
	"cote_divoire",
	"jamaica",
	"jp",
	"jersey",
	"jordan",
	"kazakhstan",
	"kenya",
	"kiribati",
	"kosovo",
	"kuwait",
	"kyrgyzstan",
	"laos",
	"latvia",
	"lebanon",
	"lesotho",
	"liberia",
	"libya",
	"liechtenstein",
	"lithuania",
	"luxembourg",
	"macau",
	"macedonia",
	"madagascar",
	"malawi",
	"malaysia",
	"maldives",
	"mali",
	"malta",
	"marshall_islands",
	"martinique",
	"mauritania",
	"mauritius",
	"mayotte",
	"mexico",
	"micronesia",
	"moldova",
	"monaco",
	"mongolia",
	"montenegro",
	"montserrat",
	"morocco",
	"mozambique",
	"myanmar",
	"namibia",
	"nauru",
	"nepal",
	"netherlands",
	"new_caledonia",
	"new_zealand",
	"nicaragua",
	"niger",
	"nigeria",
	"niue",
	"norfolk_island",
	"northern_mariana_islands",
	"north_korea",
	"norway",
	"oman",
	"pakistan",
	"palau",
	"palestinian_territories",
	"panama",
	"papua_new_guinea",
	"paraguay",
	"peru",
	"philippines",
	"pitcairn_islands",
	"poland",
	"portugal",
	"puerto_rico",
	"qatar",
	"reunion",
	"romania",
	"ru",
	"rwanda",
	"st_barthelemy",
	"st_helena",
	"st_kitts_nevis",
	"st_lucia",
	"st_pierre_miquelon",
	"st_vincent_grenadines",
	"samoa",
	"san_marino",
	"sao_tome_principe",
	"saudi_arabia",
	"senegal",
	"serbia",
	"seychelles",
	"sierra_leone",
	"singapore",
	"sint_maarten",
	"slovakia",
	"slovenia",
	"solomon_islands",
	"somalia",
	"south_africa",
	"south_georgia_south_sandwich_islands",
	"kr",
	"south_sudan",
	"es",
	"sri_lanka",
	"sudan",
	"suriname",
	"swaziland",
	"sweden",
	"switzerland",
	"syria",
	"taiwan",
	"tajikistan",
	"tanzania",
	"thailand",
	"timor_leste",
	"togo",
	"tokelau",
	"tonga",
	"trinidad_tobago",
	"tunisia",
	"tr",
	"turkmenistan",
	"turks_caicos_islands",
	"tuvalu",
	"uganda",
	"ukraine",
	"united_arab_emirates",
	"uk",
	"us",
	"us_virgin_islands",
	"uruguay",
	"uzbekistan",
	"vanuatu",
	"vatican_city",
	"venezuela",
	"vietnam",
	"wallis_futuna",
	"western_sahara",
	"yemen",
	"zambia",
	"zimbabwe",
	"octocat",
	"shipit",
	"bowtie",
	"neckbeard",
	"trollface",
	"godmode",
	"goberserk",
	"finnadie",
	"feelsgood",
	"rage1",
	"rage2",
	"rage3",
	"rage4",
	"suspect",
	"hurtrealbad"
];

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji_translate_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji_translate_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__emoji_translate_js__);

window.EmojiTranslate = __WEBPACK_IMPORTED_MODULE_0__emoji_translate_js___default.a;


/***/ })
/******/ ]);