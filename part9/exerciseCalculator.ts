interface exerciseSummary {
    value1: number;
    value2: number;
    value3: boolean;
    value4: number;
    value5: string;
    value6: number;
    value7: number;
  }

  const calculateExercises = (args: number[], target: number): exerciseSummary => {
    const periodLength = args.length
    const trainingDays = args.filter(day => day > 0).length
    const average = args.reduce((a, b) => a + b, 0) / args.length
    const success = target <= average ? true : false
    const ratio = average / target
    const rating = ratio >= 1 ? 3 : ratio >= 0.5 ? 2 : 1
    const ratingDescription = ratio >= 1 ? 'You are doing great!' : ratio >= 0.5 ? 'You are doing ok' : 'You need to work more on your exercises'

    return {
        value1: periodLength,
        value2: trainingDays,
        value3: success,
        value4: rating,
        value5: ratingDescription,
        value6: target,
        value7: average
    }

  }
  
  try {
    console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }