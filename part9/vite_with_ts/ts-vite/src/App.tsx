// Continue with exercise 9.16: create component part that renders...
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

  interface CoursePartSpecial extends CoursePartWithDescription {
    requirements : string[];
    kind: "special"
  }
  
  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;


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
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

const Header = (props: { heading: string }) => {
  return (
    <h1>{props.heading}</h1>
  );
};

// const Content = (props: { name: string, exerciseCount: number }) => {
//   return (
//     <p>
//     {props.name} {props.exerciseCount}
//   </p>
//   );
// };

const Part = (props: { part: CoursePart }) => {
  switch (props.part.kind) {
    case "basic":
      return (
        <div>
          <p><strong>{props.part.name} {props.part.exerciseCount}</strong></p>
          <p><i>{props.part.description}</i></p>
        </div>
      );
    case "group":
      return (
        <div>
          <p><strong>{props.part.name} {props.part.exerciseCount}</strong></p>
          <p>project exercises {props.part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <p><strong>{props.part.name} {props.part.exerciseCount}</strong></p>
          <p><i>{props.part.description}</i></p>
          <p>submit to {props.part.backgroundMaterial}</p>
        </div>
      );
      case "special":
        return (
          <div>
            <p><strong>{props.part.name} {props.part.exerciseCount}</strong></p>
            <p><i>{props.part.description}</i></p>
            <p>submit to {props.part.backgroundMaterial}</p>
          </div>
        );
    default:
      return null;
  }
};


const Total = (props: { totalExercises: number }) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  );
};

const App = () => {
  
  return (
    <div>
      <Header heading={courseName} />
      {courseParts.map(part => (
        <Part key={part.name} part={part} />
      ))}
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;