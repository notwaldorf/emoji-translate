$(document).on('emoji:ready', function () {
  updateOutput();

  document.getElementById('input').addEventListener('input', function() {
    updateOutput();
  });
});

function updateOutput() {
  document.getElementById('output').innerHTML = '';
  document.getElementById('output').appendChild(translateInputChunk());
}
function translateInputChunk() {
  var text = document.getElementById('input').value;
  var newText = ''
  var words = text.split(' ');

  var container = document.createElement('span');
  // Re-add the translated words.
  for (var i = 0; i < words.length; i++ ) {
    container.appendChild(translateWord(words[i]));
  }
  return container;
}
