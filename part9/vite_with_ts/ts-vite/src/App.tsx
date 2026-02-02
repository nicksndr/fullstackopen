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
  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }
  
  interface CoursePartWithDescription extends CoursePartBase {
    description: string;
  }
  
  interface CoursePartBasic extends CoursePartWithDescription {
    kind: "basic"
  }
  
  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }
  
  interface CoursePartBackground extends CoursePartWithDescription {
    backgroundMaterial: string;
    kind: "background"
  }
  
  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
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