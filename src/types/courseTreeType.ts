import Difficulty from "../models/enums/difficulty";
import ProblemStatus from "../models/enums/problemStatus";

interface Problem {
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  status: ProblemStatus;
  youtubeLink?: string;
}

interface Lecture {
  title: string;
  order: number;
  description: string;
  problems: Problem[];
}

interface StepWithLectures {
  title: string;
  order: number;
  lectures: Lecture[];
}

interface CourseTree {
  title: string;
  description: string;
  steps: StepWithLectures[];
}

export default CourseTree;