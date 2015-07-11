function translateAllTheThings() {
  // Find everything that has a text, isn't just a space, and wrap it
  // in something we can track later. Unless we've already done so.
  if (document.getElementById('#did-the-parsing-bit'))
    return;

  //TODO: Get rid of wrap and make this jquery-freeeeeeee.
  // function recurse(element) {
  //   if (element.childNodes.length > 0) {
  //     for (var i = 0; i < element.childNodes.length; i++)
  //       recurse(element.childNodes[i]);
  //   }
  //
  //   if (element.nodeType == Node.TEXT_NODE && /\S/.test(element.nodeValue)) {
  //     $(element).wrap("<span class='text-chunk'></span>");
  //   }
  // }
  // recurse(document.body);

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
