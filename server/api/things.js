const router = require('express').Router()

module.exports = router

// Test this route by going to: localhost:[PORT]/api/things
router.get('/', (req, res, next) => {
  try {
    res.json(["things"])
  } catch (err) {
    next(err)
  }
})
