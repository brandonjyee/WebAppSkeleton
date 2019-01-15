import React, { useState } from 'react';

export default function Home() {
  return (
    <div>
      <Example />
      <Example2 />
    </div>
  );
}

export function Example() {
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

export class Example2 extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  myFunc = () => {
    console.log('in my callback');
  };

  render() {
    return (
      <div>
        <button onClick={this.myFunc}>My callback btn</button>
      </div>
    );
  }
}
