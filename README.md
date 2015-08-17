## emoji-translate

You know how sometimes you type English and it has all these letters and words and no emoji? Yeah, emoji-translate fixes that.

## Packaged demos
![omg emoji](https://cloud.githubusercontent.com/assets/1369170/8635052/e333474e-27c7-11e5-8af8-5b0bc2281095.gif)

This is what you actually want, right? Can't blame you. [Here](http://meowni.ca/emoji-translate) you go. 👏

There's also a Chrome  [extension](https://chrome.google.com/webstore/detail/emoji-translate/kkkfndlpdajmbgofkidemhkjoinhmojl) that lets you translate any page on the internet to emoji. Your nightmares are finally over.

## Emoji-translate as a library
You can also use this as a standalone library for your own translation purposes.

### Install
```
bower install emoji-translate
```

### Usage
When `emoji-translate.js` is loaded, it will load json of emoji names and keywords, save it in a global called `allEmojis`, and fire an `emoji-ready` event. `allEmojis` has this structure:
```json
{
  "grinning": {
    "keywords": ["face", "smile", "happy", "joy"],
    "char": "😀",
    "category": "people"
  },
  "grin": {
    "keywords": ["face", "happy", "smile", "joy"],
    "char": "😁",
    "category": "people"
  },
  ...
}
```
The `emoji-translate` api has 2 methods:
  * `getMeAnEmoji(word)` -- returns the emoji translation of the english `word`, or the empty string if one doesn't exist.
  * `translateWord(word)` -- returns a `<span>` element that contains either the
  original english `word`, or the emoji translation, ready for display.

## ❤
This was made as part of an ⚡️emoji hackday⚡️ and  is powered by [emojilib](https://github.com/muan/emojilib), a magical `json` file of emoji names and keywords y'all should use in all your projects.
