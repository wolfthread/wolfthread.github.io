/*
This code was initially done by Brad Traversy in his Modern HTML & CSS From The Beginning Udemy course.
See typewriter_original.js for that version.
The version here my customizations to have different delete modes to bring more variety to the deletion look on the page.
Further improvements should include speed variations on the deletion modes, also randomly, as well
as text highlight.
*/

class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 8);
    this.type();
    this.isDeleting = false;
    // Modes
    this.defaultMode = 'letter';
    this.otherModes = ['word', 'sentence'];
    // Ratio for default mode value, which will be run against each other mode values
    // This is the value you need to adjust if you want more letter deletion vs the other modes
    // The highest the ration, the more letter deletion there will be
    this.ratio = 3;
    // Delete mode attributes
    this.deleteMode = this.defaultMode;
    this.deletedWord = false;
  }

  getDeleteMode() {
    //const modes = Array(this.otherModes).fill(this.defaultMode, this.ratio);
    const modes = new Array(this.ratio)
      .fill(this.defaultMode)
      .flat()
      .concat(this.otherModes);
    // const modes = this.defaultMode.concat(this.otherModes);
    const choice = Math.random() * modes.length;
    return modes[Math.floor(choice)];
  }

  reset() {
    this.isDeleting = false;
    this.deletedWord = false;
    // Move to next word
    this.wordIndex++;
    this.deleteMode = this.getDeleteMode();
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      switch (this.deleteMode) {
        case 'letter':
          // Check if deletion of word is completed
          if (this.txt[this.txt.length - 1] === ' ') {
            this.deletedWord = true;
          }
          // Remove char
          this.txt = fullTxt.substring(0, this.txt.length - 1);
          break;
        case 'word':
          const currentWordLength = (str) => {
            let pointer = str.length;
            while (pointer > 0) {
              if (str[pointer] === ' ') {
                return pointer;
              }
              pointer--;
              this.deletedWord = true;
            }
            return 0;
          };
          this.txt = this.txt.substring(0, currentWordLength(this.txt));
          break;
        case 'sentence':
          this.txt = '';
          this.reset();
          break;
        default:
          break;
      }
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial typespeed
    let typeSpeed = 80;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt !== '' && this.deletedWord) {
      const deleteMode = this.getDeleteMode();
      this.deleteMode = deleteMode;
    } else if (this.isDeleting && this.txt === '') {
      this.reset();
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait);
}
