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
  var container = document.createElement('span');

  var allLines = text.split('\n');
  for (var line = 0; line < allLines.length; line++ ){
    if (allLines[line] == '')
      continue

    var words = allLines[line].split(' ');
    // Re-add the translated words.
    for (var i = 0; i < words.length; i++ ) {
      container.appendChild(translateWord(words[i]));
    }
    var newLine = document.createElement('br');
    container.appendChild(newLine);
  }

  return container;
}
