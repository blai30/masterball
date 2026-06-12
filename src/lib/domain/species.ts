export function calculateCatchProbability(captureRate: number): number {
  const base = captureRate / 3
  const captureValue = 65535 / Math.pow(255 / base, 0.1875)
  const captureProbability = Math.pow(captureValue / 65535, 4)
  return Math.fround(captureProbability) * 100
}

export function convertHeight(heightInDecimeters: number): { meters: string } {
  return { meters: Math.fround(heightInDecimeters / 10).toFixed(1) }
}

export function convertWeight(weightInHectograms: number): { kilograms: string } {
  return { kilograms: (weightInHectograms / 10).toFixed(1) }
}

export function calculateGenderRates(genderRate: number): {
  maleRate: string
  femaleRate: string
} {
  return {
    maleRate: Math.fround((1 - genderRate / 8) * 100).toFixed(1),
    femaleRate: Math.fround((genderRate / 8) * 100).toFixed(1),
  }
}
