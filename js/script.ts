import zxcvbn from 'zxcvbn';
import wordlist from './wordlist';

let passwordField: HTMLInputElement | undefined;

// Cryptographic replacement for Math.random()
function randomNumberBetweenZeroAndOne(): number {
  const crypto = window.crypto;
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function generatePassword(numberOfWords: number): string {
  // Empty array to be filled with wordlist
  const generatedPasswordArray: string[] = [];

  // Grab a random word, push it to the password array
  for (let i = 0; i < numberOfWords; i++) {
    const index = Math.min(
      Math.floor(randomNumberBetweenZeroAndOne() * wordlist.length),
      wordlist.length - 1,
    );
    generatedPasswordArray.push(wordlist[index]);
  }

  return generatedPasswordArray.join(' ');
}

function setStyleFromWordNumber(passwordField: HTMLElement, numberOfWords: number): void {
  const baseSize = 40;
  const newSize = baseSize * (4 / numberOfWords);
  passwordField.setAttribute('style', 'font-size: ' + String(newSize) + 'px;');
}

function convertSecondsToReadable(seconds: number): string {
  let timeString = '';

  // Enumerate all the numbers
  const numMilliseconds = seconds * 1000;
  const numSeconds = Math.floor(seconds);
  const numMinutes = Math.floor(numSeconds / 60);
  const numHours = Math.floor(numSeconds / (60 * 60));
  const numDays = Math.floor(numSeconds / (60 * 60 * 24));
  const numYears = Math.floor(numSeconds / (60 * 60 * 24 * 365));
  const numCenturies = Math.floor(numSeconds / (60 * 60 * 24 * 365 * 100));

  if (numMilliseconds < 1) {
    timeString = 'less than 1 millisecond';
  } else if (numMilliseconds < 1000) {
    timeString =
      Math.floor(numMilliseconds) +
      ' millisecond' +
      (numMilliseconds === 1 ? '' : 's');
  } else if (numSeconds < 60) {
    timeString = numSeconds + ' second' + (numSeconds === 1 ? '' : 's');
  } else if (numMinutes < 60) {
    timeString = numMinutes + ' minute' + (numMinutes === 1 ? '' : 's');
  } else if (numHours < 24) {
    timeString = numHours + ' hour' + (numHours === 1 ? '' : 's');
  } else if (numDays < 365) {
    timeString = numDays + ' day' + (numDays === 1 ? '' : 's');
  } else if (numYears < 1000000) {
    timeString = numYears + ' year' + (numYears === 1 ? '' : 's');
  } else {
    timeString = numCenturies + ' centur' + (numCenturies === 1 ? 'y' : 'ies');
  }

  return timeString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calculateAndSetCrackTime(): void {
  const timeToCrack = zxcvbn(passwordField.value);
  const readableCrackTime = convertSecondsToReadable(
    timeToCrack.crack_times_seconds.offline_fast_hashing_1e10_per_second,
  );
  document.querySelector('.crack-time').innerHTML = readableCrackTime;
}

function init(): void {
  const selectField: HTMLSelectElement = document.getElementById(
    'passphrase_select',
  ) as HTMLSelectElement;
  passwordField = document.getElementById('passphrase') as HTMLInputElement;
  const button = document.querySelector('.btn-generate');

  // Initially run it upon load
  const passphrase = generatePassword(4);
  passwordField.setAttribute('value', passphrase);
  calculateAndSetCrackTime();

  // Listen for a button click
  button.addEventListener('click', () => {
    const numberOfWordsString = selectField.options[selectField.selectedIndex].value;
    const numberOfWords = parseInt(numberOfWordsString, 10);
    passwordField.value = generatePassword(numberOfWords);
    setStyleFromWordNumber(passwordField, numberOfWords);
    calculateAndSetCrackTime();
  });

  // Listen for password value change
  passwordField.addEventListener('input', (_evt) => {
    calculateAndSetCrackTime();
  });
}

document.addEventListener('DOMContentLoaded', init);
