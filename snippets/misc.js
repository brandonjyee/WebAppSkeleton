
/**
 * Shuffles array in place. Fisher-Yates algo.
 * @param {Array} a items An array containing the items.
 */
const shuffle = function(arr) {
  // Start i from the last element and move left. Swap with a random element to the left of i
  for (let i = arr.length - 1; i > 0; i--) {
    // j is a random element to the left of i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};



// ==== Read input synchronously from commandline =====
// npm i readline-sync
const readlineSync = require('readline-sync');

// Wait for user's response.
const userName = readlineSync.question('May I have your name? ');
console.log('Hi ' + userName + '!');

// Handle the secret text (e.g. password).
const favFood = readlineSync.question('What is your favorite food? ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
console.log('Oh, ' + userName + ' loves ' + favFood + '!');

// ==== Read input asynchronously from command line ====
// npm i readline
const readline = require('readline')

const rl = rl.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter your name', (ans) => {
  console.log(ans)
})




