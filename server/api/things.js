const router = require('express').Router()

module.exports = router

router.get('/', (req, res, next) => {
  try {
    res.json(["things"])
  } catch (err) {
    next(err)
  }
})
