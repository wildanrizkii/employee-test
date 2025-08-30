import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage, getStorageInfo } from "@/utils/safeStorage";

interface KetelitianQuestion {
  id: number;
  pernyataan1: string | number;
  pernyataan2: string | number;
}

interface KetelitianResult {
  score: number;
  percentage: number;
  totalQuestions: number;
}

interface KetelitianState {
  // Data
  questions: KetelitianQuestion[];
  answers: string[];
  currentQuestion: number;

  // UI State
  autoNext: boolean;
  testCompleted: boolean;
  testStarted: boolean;

  // Actions
  setQuestions: (questions: KetelitianQuestion[]) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  setCurrentQuestion: (index: number) => void;
  setAutoNext: (autoNext: boolean) => void;
  setTestCompleted: (completed: boolean) => void;
  setTestStarted: (started: boolean) => void;
  setAnswers: (answers: string[]) => void;

  // Computed
  getProgress: () => number;
  getUnansweredQuestions: () => number[];
  calculateResult: () => KetelitianResult | null;

  // Reset
  resetTest: () => void;

  // Navigation helpers
  nextQuestion: () => void;
  previousQuestion: () => void;
}

export const useKetelitianStore = create<KetelitianState>()(
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

      setAnswers: (answers) => set({ answers }),

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

        let correct = 0;
        state.answers.forEach((answer: string, index: number) => {
          if (answer && state.questions[index]) {
            const question = state.questions[index];
            const isCorrect = question.pernyataan1 === question.pernyataan2;
            if (
              (answer === "S" && isCorrect) ||
              (answer === "T" && !isCorrect)
            ) {
              correct++;
            }
          }
        });

        const percentage = Math.round((correct / state.questions.length) * 100);
        return {
          score: correct,
          percentage,
          totalQuestions: state.questions.length,
        };
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
      name: "ketelitian-test-storage", // localStorage key
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
            "Ketelitian Store: Error rehydrating from localStorage:",
            error,
            "\nStorage Info:", storageInfo
          );
        } else if (state) {
          console.log(
            "Ketelitian Store: Successfully rehydrated from localStorage",
            "\nStorage Info:", storageInfo
          );
        } else {
          console.log(
            "Ketelitian Store: No stored state found, using defaults",
            "\nStorage Info:", storageInfo
          );
        }
      },
      // Skip persistence during SSR to avoid hydration mismatches
      skipHydration: typeof window === "undefined",
    },
  ),
);
