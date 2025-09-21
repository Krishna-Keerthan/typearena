// enums
export enum TestTime {
    T15 = "T15",   
    T30 = "T30",   
    T60 = "T60",   
  }
  
  export enum WordCount {
    W15 = "W10",
    W20 = "W25",  
    W30 = "W50",   
  }
  
  export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
  }
  
  // Leaderboard type
  export type LeaderBoard = {
    id: string
    userId: string
    wpm: number
    time: TestTime
    wordCount: WordCount
    difficulty: Difficulty
    createdAt: Date
  }