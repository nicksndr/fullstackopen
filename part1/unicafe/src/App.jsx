import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.heading}</h1>
  );
};


const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};


const Content = (props) => {
  return (
    <p>
    {props.text} {props.eval}
  </p>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : good / total

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="Total" value={total} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={positive} />
    </table>
  );
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
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
    setNeutral(neutral + 1)
  }

  const increaseBadByOne = () => {
    console.log('increasing, value before', bad)
    setBad(bad + 1)
  }

  const heading = "give feedback"
  const heading2 = "statistics"

  return (
    <div>
      <Header heading={heading} />
  
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
  
      <Header heading={heading2} />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App