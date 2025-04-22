enum Difficulty {
    Easy = "easy",
    Medium= "medium",
    Hard= "hard",
}

export default Difficulty
  
export type DifficultyType = typeof Difficulty[keyof typeof Difficulty];
