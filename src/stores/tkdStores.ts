import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createSafeStorage,
  sanitizeQuestions,
  getStorageInfo,
} from "@/utils/safeStorage";

interface Question {
  id: string | number;
  jenis: string;
  pertanyaan: string;
  jawaban: string[];
  gambar?: string;
  petunjuk?: string;
}

type Answers = Record<string, string>;

type StatusSoal = Record<
  string,
  "belum dikerjakan" | "sudah dikerjakan" | "ragu-ragu"
>;

interface TKDState {
  // Data
  questions: Question[];
  answers: Answers;
  statusSoal: StatusSoal;
  currentQuestion: number;

  // UI State
  autoNext: boolean;
  testCompleted: boolean;
  testStarted: boolean;
  activeJenis: string;

  // Actions
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setAnswerByIndex: (questionId: string, answerIndex: number) => void; // New method
  setStatusSoal: (
    questionId: string,
    status: "belum dikerjakan" | "sudah dikerjakan" | "ragu-ragu",
  ) => void;
  setCurrentQuestion: (index: number) => void;
  setAutoNext: (autoNext: boolean) => void;
  setTestCompleted: (completed: boolean) => void;
  setTestStarted: (started: boolean) => void;
  setActiveJenis: (jenis: string) => void;
  setAnswers: (answers: Answers) => void;

  // Computed
  getProgress: () => number;
  getUnansweredQuestions: () => number[];
  getAnsweredCount: () => number;
  isQuestionAnswered: (questionId: string) => boolean;
  getAnswerValue: (questionId: string) => string | null; // Get actual answer text
  getAnswerLabel: (questionId: string) => string | null; // Get answer label (A-E)

  // Reset
  resetTest: () => void;

  // Navigation helpers
  nextQuestion: () => void;
  previousQuestion: () => void;

  // Status helpers
  toggleRaguRagu: (questionId: string) => void;

  // Initialize status
  initializeStatus: () => void;
}

// Helper function to convert answer index to letter
const getAnswerLabel = (index: number): string => {
  const labels = ["A", "B", "C", "D", "E"];
  return labels[index] || "";
};

// Helper function to convert letter to index
const getLabelIndex = (label: string): number => {
  const labels = ["A", "B", "C", "D", "E"];
  return labels.indexOf(label.toUpperCase());
};

export const useTKDStore = create<TKDState>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: [],
      answers: {},
      statusSoal: {},
      currentQuestion: 0,
      autoNext: false,
      testCompleted: false,
      testStarted: false,
      activeJenis: "",

      // Actions
      setQuestions: (questions) => {
        try {
          // Sanitize questions to prevent circular references
          const sanitizedQuestions = sanitizeQuestions(questions);

          const initialStatus: StatusSoal = {};
          sanitizedQuestions.forEach((question) => {
            const questionId = String(question.id);
            initialStatus[questionId] = "belum dikerjakan";
          });

          set({
            questions: sanitizedQuestions,
            statusSoal: initialStatus,
            activeJenis:
              sanitizedQuestions.length > 0
                ? (sanitizedQuestions[0]?.jenis ?? "")
                : "",
          });
        } catch (error) {
          console.error("Error setting questions:", error);
          // Fallback: set empty state
          set({
            questions: [],
            statusSoal: {},
            activeJenis: "",
          });
        }
      },

      // Modified: Now accepts the actual answer value and converts to label
      setAnswer: (questionId, answer) => {
        const state = get();
        const question = state.questions.find(
          (q) => q.id.toString() === questionId,
        );

        if (question) {
          const answerIndex = question.jawaban.indexOf(answer);
          if (answerIndex !== -1) {
            const answerLabel = getAnswerLabel(answerIndex);
            set((state) => ({
              answers: {
                ...state.answers,
                [questionId]: answerLabel, // Store as "A", "B", "C", etc.
              },
              statusSoal: {
                ...state.statusSoal,
                [questionId]: "sudah dikerjakan",
              },
            }));
          }
        }
      },

      // New method: Set answer by index directly
      setAnswerByIndex: (questionId, answerIndex) => {
        const answerLabel = getAnswerLabel(answerIndex);
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answerLabel, // Store as "A", "B", "C", etc.
          },
          statusSoal: {
            ...state.statusSoal,
            [questionId]: "sudah dikerjakan",
          },
        }));
      },

      setStatusSoal: (questionId, status) =>
        set((state) => ({
          statusSoal: {
            ...state.statusSoal,
            [questionId]: status,
          },
        })),

      setCurrentQuestion: (index) => set({ currentQuestion: index }),

      setAutoNext: (autoNext) => set({ autoNext }),

      setTestCompleted: (completed) => set({ testCompleted: completed }),

      setTestStarted: (started) => set({ testStarted: started }),

      setActiveJenis: (jenis) => set({ activeJenis: jenis }),

      setAnswers: (answers) => set({ answers }),

      // Computed functions
      getProgress: () => {
        const state = get();
        if (state.questions.length === 0) return 0;
        const answeredCount = Object.keys(state.answers).filter(
          (key) => state.answers[key] && state.answers[key] !== "",
        ).length;
        return Math.round((answeredCount / state.questions.length) * 100);
      },

      getUnansweredQuestions: () => {
        const state = get();
        return state.questions
          .map((_, index) => index)
          .filter((index) => {
            const question = state.questions[index];
            if (!question) return true;
            const questionId = question.id.toString();
            return (
              !state.answers[questionId] || state.answers[questionId] === ""
            );
          });
      },

      getAnsweredCount: () => {
        const state = get();
        return Object.keys(state.answers).filter(
          (key) => state.answers[key] && state.answers[key] !== "",
        ).length;
      },

      isQuestionAnswered: (questionId) => {
        const state = get();
        return !!(
          state.answers[questionId] && state.answers[questionId] !== ""
        );
      },

      // New method: Get the actual answer text from stored label
      getAnswerValue: (questionId) => {
        const state = get();
        const answerLabel = state.answers[questionId];
        if (!answerLabel) return null;

        const question = state.questions.find(
          (q) => q.id.toString() === questionId,
        );
        if (!question) return null;

        const answerIndex = getLabelIndex(answerLabel);
        return answerIndex !== -1 ? question.jawaban[answerIndex] : null;
      },

      // New method: Get the stored answer label
      getAnswerLabel: (questionId) => {
        const state = get();
        return state.answers[questionId] || null;
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

      // Status helpers
      toggleRaguRagu: (questionId) =>
        set((state) => {
          const currentStatus = state.statusSoal[questionId];
          const newStatus =
            currentStatus === "ragu-ragu"
              ? state.answers[questionId]
                ? "sudah dikerjakan"
                : "belum dikerjakan"
              : "ragu-ragu";

          return {
            statusSoal: {
              ...state.statusSoal,
              [questionId]: newStatus,
            },
          };
        }),

      initializeStatus: () => {
        const state = get();
        const initialStatus: StatusSoal = {};
        state.questions.forEach((question) => {
          initialStatus[question.id.toString()] = "belum dikerjakan";
        });
        set({ statusSoal: initialStatus });
      },

      // Reset function
      resetTest: () =>
        set((state) => {
          const initialStatus: StatusSoal = {};
          state.questions.forEach((question) => {
            initialStatus[question.id.toString()] = "belum dikerjakan";
          });

          return {
            answers: {},
            statusSoal: initialStatus,
            currentQuestion: 0,
            testCompleted: false,
            testStarted: false,
          };
        }),
    }),
    {
      name: "tkd-test-storage", // localStorage key
      storage: createJSONStorage(() => createSafeStorage()),
      // Persist data penting dan sanitize untuk avoid circular references
      partialize: (state) => {
        try {
          return {
            questions: sanitizeQuestions(state.questions),
            answers: { ...state.answers },
            statusSoal: { ...state.statusSoal },
            currentQuestion: state.currentQuestion,
            autoNext: state.autoNext,
            testStarted: state.testStarted,
            testCompleted: state.testCompleted,
            activeJenis: state.activeJenis,
          };
        } catch (error) {
          console.error("Error in partialize:", error);
          return {
            questions: [],
            answers: {},
            statusSoal: {},
            currentQuestion: 0,
            autoNext: false,
            testStarted: false,
            testCompleted: false,
            activeJenis: "",
          };
        }
      },
      // Add error handling for localStorage operations with environment info
      onRehydrateStorage: () => (state, error) => {
        const storageInfo = getStorageInfo();

        if (error) {
          console.error(
            "TKD Store: Error rehydrating from localStorage:",
            error,
            "\nStorage Info:",
            storageInfo,
          );
          // Continue with default state on error
        } else if (state) {
          console.log(
            "TKD Store: Successfully rehydrated from localStorage",
            "\nStorage Info:",
            storageInfo,
            "\nRehydrated state keys:",
            Object.keys(state),
          );
        } else {
          console.log(
            "TKD Store: No stored state found, using defaults",
            "\nStorage Info:",
            storageInfo,
          );
        }
      },
      // Skip persistence during SSR to avoid hydration mismatches
      skipHydration: typeof window === "undefined",
    },
  ),
);
