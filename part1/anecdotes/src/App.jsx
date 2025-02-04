import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.heading}</h1>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const heading = 'Anecdote of the day'
  const heading2 = 'Anecdote with most votes'
   
  const [selected, setSelected] = useState(0)

  const num = Math.floor(Math.random()*8)

  // This would not work because it is not reactive
  // const votes = [0,0,0,0,0,0,0,0]
  const [votes, setVotes] = useState(new Array(8).fill(0));
  // modifying copy[selected] directly, which is not allowed in React state updates
  const copy = [...votes]
  // correct, create function for it
  const handleVote = () => {
    const newVotes = [...votes]; // Correctly copy the array
    newVotes[selected] += 1; // Update selected index
    setVotes(newVotes); // Set new state
  };

  // get quote with the most votes
  let maxVotes = Math.max.apply(Math, votes)
  let maxIndex = votes.indexOf(maxVotes);


  return (
    <div>
      <Header heading={heading} />
      {anecdotes[selected]}
      <p>has {copy[selected]} votes</p>
      <p>
        <Button onClick={handleVote} text="vote" />
        <Button onClick={() => setSelected(num)} text="next anecdote" />
      </p>
      <Header heading={heading2} />
      {anecdotes[maxIndex]}
    </div>
  )
}

export default App

