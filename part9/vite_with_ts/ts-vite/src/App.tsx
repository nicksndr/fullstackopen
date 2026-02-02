const Header = (props: { heading: string }) => {
  return (
    <h1>{props.heading}</h1>
  );
};

const Content = (props: { name: string, exerciseCount: number }) => {
  return (
    <p>
    {props.name} {props.exerciseCount}
  </p>
  );
};

const Total = (props: { totalExercises: number }) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header heading={courseName} />
      <Content name={courseParts[0].name} exerciseCount={courseParts[0].exerciseCount} />
      <Content name={courseParts[1].name} exerciseCount={courseParts[1].exerciseCount} />
      <Content name={courseParts[2].name} exerciseCount={courseParts[2].exerciseCount} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;