import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

const wholeStarUrl = '/icons/whole_star.png'
const halfStarUrl = '/icons/half_star.png'
const emptyStarUrl = '/icons/empty_star.png'
const maxStars = 5
const styleClass = 'star-rating'

stars.PropTypes = {
  num: PropTypes.number.isRequired  // number of stars. Ex: 3.4
}

export default function stars({num = 0}) {
  // Output number of stars
  const numWhole = Math.floor(num)
  const rem = num - numWhole
  const numHalf = rem > 0 ? 1 : 0
  let imgDataArr = []
  let count = 0
  for (let i = 0; i < numWhole; i++) {
    imgDataArr.push({ key: count, url: wholeStarUrl})
    count++
  }
  if (numHalf) {
    imgDataArr.push({ key: count, url: halfStarUrl})
  }
  // If there's less than maxStars stars, pad it out with empty stars
  while (imgDataArr.length < maxStars) {
    imgDataArr.push({ key: imgDataArr.length, url: emptyStarUrl})
  }
  return (
    <Fragment>
      {imgDataArr.map(obj => (<img className={styleClass} key={obj.key} src={obj.url}/>))}
    </Fragment>
  )
}
