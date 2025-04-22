enum ProblemStatus {
    Published = "published",
    Draft =  "draft",
}

export default ProblemStatus;

export type ProblemStatusType = typeof ProblemStatus[keyof typeof ProblemStatus];

  