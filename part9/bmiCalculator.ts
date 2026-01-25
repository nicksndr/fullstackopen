interface bmiValues {
    value1: number;
    value2: number;
}

const parseArguments = (args: string[]): bmiValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            value1: Number(args[2]),
            value2: Number(args[3])
        }
    } else {
        throw new Error('Provided values were not numbers!');
    }
}

const calculateBmi = (height: number, weight: number,): string => {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)

    if (bmi < 18.5) {
        return 'Underweight'
    }
    if (bmi >= 18.5 && bmi <= 24.9) {
        return 'Normal weight'
    }
    if (bmi >= 25 && bmi <= 29.9) {
        return 'Overweight'
    }
    if (bmi >= 30) {
        return 'Obesity'
    }
    return 'Invalid BMI';
}

if (require.main === module){
    try {
        const { value1, value2 } = parseArguments(process.argv);
        console.log(calculateBmi(value1, value2))
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong: '
        if (error instanceof Error) {
            errorMessage += error.message;
        }
        console.log(errorMessage);
    }
}

export default calculateBmi;



// try {
//   console.log(calculateBmi(185, 100))
//   console.log(calculateBmi(185, 70))
//   console.log(calculateBmi(185, 90))
//   console.log(calculateBmi(185, 65))
// } catch (error: unknown) {
//   let errorMessage = 'Something went wrong: '
//   if (error instanceof Error) {
//     errorMessage += error.message;
//   }
//   console.log(errorMessage);
// }