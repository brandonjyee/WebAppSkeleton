// ==== Command line IO ====

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

// ==== File System IO ====

// ==== Read file synchronously ====
const fs = require('fs')

const inputFile = '/root/devops/Files.in'
const contents = fs.readFileSync(inputFile, 'utf8')

// ==== List files in a directory synchronousy ====
const dir = '/root/devops'
const files = fs.readdirSync(dir)
for (let file of files) {
  console.log(file)
}

// ==== Synchronously determine if file is a directory or file ====
const filePath = '/root/devops/myDir'

const statObj = fs.lstatSync(filePath)
console.log(statObj.isDirectory())
