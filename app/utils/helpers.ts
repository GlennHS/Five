export const calculateTotal = (five: number[]) : number => {
  if (five.length !== 5)
    return 0
  else
    return five.reduce((a,b) => a + b) / 5
}