const calculateBmi = (height: number, weight: number,) : string => {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)

    if(bmi < 18.5) {
        return 'Underweight'
    }
    if(bmi >= 18.5 && bmi <= 24.9) {
        return 'Normal weight'
    }
    if(bmi >= 25 && bmi <= 29.9) {
        return 'Overweight'
    }
    if(bmi >= 30) {
        return 'Obesity'
    }
}

try {
  console.log(calculateBmi(185, 100))
  console.log(calculateBmi(185, 70))
  console.log(calculateBmi(185, 90))
  console.log(calculateBmi(185, 65))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}