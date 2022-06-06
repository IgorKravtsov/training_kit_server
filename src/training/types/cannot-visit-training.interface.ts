export enum CannotVisitTrainingType {
  Time = 'time',
  AlreadyMarked = 'alreadyMarked',
}

export interface CannotVisitTraining {
  type: CannotVisitTrainingType
  canBeVisited: boolean
}
