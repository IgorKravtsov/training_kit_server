export const checkCanVisit = (trainingDate: Date | string): boolean => {
  if (!trainingDate) return false

  const tDate = new Date(trainingDate)

  const THIRTY_MINUTES = 30
  const startVisitTime = new Date(tDate)
  const endVisitTime = new Date(tDate)

  startVisitTime.setMinutes(tDate.getMinutes() - THIRTY_MINUTES)
  endVisitTime.setMinutes(tDate.getMinutes() + THIRTY_MINUTES)

  return new Date() > startVisitTime && new Date() < endVisitTime
}
