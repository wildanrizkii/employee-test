import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage, getStorageInfo } from "@/utils/safeStorage";

interface MBTIQuestion {
  _id: {
    $oid: string;
  };
  soal?: string;
  soalA?: string;
  soalB?: string;
  jawabanA: string;
  jawabanB: string;
  tipe: string;
  valueA: string;
  valueB: string;
  bagian: string;
}

interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

interface MBTIResult {
  type: string;
  scores: MBTIScores;
}

interface MBTIState {
  // Data
  questions: MBTIQuestion[];
  answers: string[];
  currentQuestion: number;

  // UI State
  autoNext: boolean;
  testCompleted: boolean;
  testStarted: boolean;

  // Actions
  setQuestions: (questions: MBTIQuestion[]) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  setCurrentQuestion: (index: number) => void;
  setAutoNext: (autoNext: boolean) => void;
  setTestCompleted: (completed: boolean) => void;
  setTestStarted: (started: boolean) => void;

  // Computed
  getProgress: () => number;
  getUnansweredQuestions: () => number[];
  calculateResult: () => MBTIResult | null;

  // Reset
  resetTest: () => void;

  // Navigation helpers
  nextQuestion: () => void;
  previousQuestion: () => void;
  
}

export const useMBTIStore = create<MBTIState>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: [],
      answers: [],
      currentQuestion: 0,
      autoNext: true,
      testCompleted: false,
      testStarted: false,

      // Actions
      setQuestions: (questions) =>
        set({
          questions,
          answers: new Array(questions.length).fill(""),
        }),

      setAnswer: (questionIndex, answer) =>
        set((state) => {
          const newAnswers = [...state.answers];
          newAnswers[questionIndex] = answer;
          return { answers: newAnswers };
        }),

      setCurrentQuestion: (index) => set({ currentQuestion: index }),

      setAutoNext: (autoNext) => set({ autoNext }),

      setTestCompleted: (completed) => set({ testCompleted: completed }),

      setTestStarted: (started) => set({ testStarted: started }),

      // Computed functions
      getProgress: () => {
        const state = get();
        if (state.questions.length === 0) return 0;
        const answeredQuestions = state.answers.filter(
          (answer) => answer !== "",
        ).length;
        return (answeredQuestions / state.questions.length) * 100;
      },

      getUnansweredQuestions: () => {
        const state = get();
        const unanswered: number[] = [];
        state.answers.forEach((answer, index) => {
          if (!answer || answer === "") {
            unanswered.push(index);
          }
        });
        return unanswered;
      },

      calculateResult: () => {
        const state = get();
        if (state.questions.length === 0 || state.answers.length === 0)
          return null;

        const scores: MBTIScores = {
          E: 0,
          I: 0,
          S: 0,
          N: 0,
          T: 0,
          F: 0,
          J: 0,
          P: 0,
        };

        state.answers.forEach((answer: string, index: number) => {
          if (answer && state.questions[index]) {
            const question = state.questions[index];
            if (answer === "A" && question.valueA) {
              scores[question.valueA as keyof MBTIScores]++;
            } else if (answer === "B" && question.valueB) {
              scores[question.valueB as keyof MBTIScores]++;
            }
          }
        });

        const mbtiType =
          (scores.E > scores.I ? "E" : "I") +
          (scores.S > scores.N ? "S" : "N") +
          (scores.T > scores.F ? "T" : "F") +
          (scores.J > scores.P ? "J" : "P");

        return { type: mbtiType, scores };
      },

      // Navigation helpers
      nextQuestion: () =>
        set((state) => ({
          currentQuestion: Math.min(
            state.currentQuestion + 1,
            state.questions.length - 1,
          ),
        })),

      previousQuestion: () =>
        set((state) => ({
          currentQuestion: Math.max(state.currentQuestion - 1, 0),
        })),

      // Reset function
      resetTest: () =>
        set((state) => ({
          answers: new Array(state.questions.length).fill(""),
          currentQuestion: 0,
          testCompleted: false,
          testStarted: false,
        })),
    }),
    {
      name: "mbti-test-storage", // localStorage key
      storage: createJSONStorage(() => createSafeStorage()),
      // Hanya persist data penting, tidak persist UI state yang sementara
      partialize: (state) => ({
        questions: state.questions,
        answers: state.answers,
        currentQuestion: state.currentQuestion,
        autoNext: state.autoNext,
        testStarted: state.testStarted,
        testCompleted: state.testCompleted,
      }),
      // Add error handling for localStorage operations
      onRehydrateStorage: () => (state, error) => {
        const storageInfo = getStorageInfo();
        
        if (error) {
          console.error(
            "MBTI Store: Error rehydrating from localStorage:",
            error,
            "\nStorage Info:", storageInfo
          );
        } else if (state) {
          console.log(
            "MBTI Store: Successfully rehydrated from localStorage",
            "\nStorage Info:", storageInfo
          );
        } else {
          console.log(
            "MBTI Store: No stored state found, using defaults",
            "\nStorage Info:", storageInfo
          );
        }
      },
      // Skip persistence during SSR to avoid hydration mismatches
      skipHydration: typeof window === "undefined",
    },
  ),
);
