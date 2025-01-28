import { useState } from 'react'

const Header = (props) => {
  console.log(props)
  return (
    <h1>{props.heading}</h1>
  );
};


const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <p>
    {props.text} {props.eval}
  </p>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGoodByOne = () => {
    console.log('increasing, value before', good)
    setGood(good + 1)
  }

  const increaseNeutralByOne = () => {
    console.log('increasing, value before', neutral)
    setGood(neutral + 1)
  }

  const increaseBadByOne = () => {
    console.log('increasing, value before', bad)
    setGood(bad + 1)
  }

  const heading = "give feedback"
  const heading2 = "statistics"

  return (
    <div>
      <Header heading={heading}/>

      <Button onClick={increaseGoodByOne} text="good" />
      <Button onClick={increaseNeutralByOne} text="neutral" />
      <Button onClick={increaseBadByOne} text="bad" />

      <Header heading={heading2}/>
      <Content eval={good} text="good"/>
      <Content eval={good} text="neutral"/>
      <Content eval={good} text="bad"/>
    </div>
  )
}

export default App