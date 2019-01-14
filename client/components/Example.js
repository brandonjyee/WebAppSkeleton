import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  if (count === 3) {
    throw new Error('throwing a fake error');
  }
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>*Will throw a fake error on the 3rd click*</p>
    </div>
  );
}

export default Example;
