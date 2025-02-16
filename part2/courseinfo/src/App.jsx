const Course = (props) => (
  <div>
    <Header name={props.course.name} />
    <Content parts={props.course.parts} />
    <Total parts={props.course.parts}/>
  </div>
);

const Header = (props) => <h1>{props.name}</h1>


const Content = (props) => (
  <div>
    {props.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = ({parts}) => {
  const total = 
    parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>
      total of {total} exercise
    </p>
  );
};

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App