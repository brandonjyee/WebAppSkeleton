/*
// ==== Postgres & Sequelize ====

==== Regular Dependencies (use 'npm i'): ====
pg
sequelize

Optional:
pg-hstore     // Allows serial/deserial of JSON objs

// Make sure the postgres db service is running (especially if running locally) and running on the right port (default 5432)
// For Ubuntu 16.04
// https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04
// or https://www.postgresql.org/download/linux/ubuntu/
sudo apt-get update
sudo apt-get install postgresql-10

// To start/restart the postgres service
sudo service postgresql restart
// On Ubuntu 16.04/18.04
sudo systemctl start postgresql.service
sudo systemctl restart postgresql.service
sudo systemctl status postgresql.service


// Create a new database for the project
createdb <db-name>

*/


// ==== In server/index.js: ====
const db = require('./db')

db.sync()




// ==== In server/db/index.js: ====
const db = require('./db')

// register models
require('./models')

module.exports = db


// ==== In server/db/db.js: ====
const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false
  }
)
module.exports = db


// ==== In server/db/models/index.js ====
// will be where you export all the models. Client-code can just import from this centralized file. // Also put associations in this file. Ex: Blog.belongsTo(User)


// ==== Sample model in server/db/models/Thing.js ====
const Sequelize = require('sequelize')
const db = require('../db')

const Thing = db.define('thing', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

})




// ==== In script/seed.js ====
'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}



// ==== In package.json ====
// Under "scripts", add:
// "seed": "node script/seed.js"
