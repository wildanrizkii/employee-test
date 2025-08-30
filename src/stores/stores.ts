import { create } from "zustand";

// Countdown Store
interface CountdownState {
  minutes: number;
  setMinutes: (minutes: number) => void;
  onComplete: () => void;
  setOnComplete: (callback: () => void) => void;
  resetCountdown: () => void;
}

export const useCountdownStore = create<CountdownState>((set) => ({
  minutes: 3, // default 3 menit untuk break
  setMinutes: (minutes) => set({ minutes }),
  onComplete: () => {
    console.log("Countdown Completed!");
  },
  setOnComplete: (callback) => set({ onComplete: callback }),
  resetCountdown: () => set({ minutes: 3 }), // reset ke default 3 menit
}));

// Test Progress Store (optional - untuk tracking progress test)
interface TestProgressState {
  currentTest: string | null;
  completedTests: string[];
  setCurrentTest: (test: string) => void;
  markTestCompleted: (test: string) => void;
  isTestCompleted: (test: string) => boolean;
}

export const useTestProgressStore = create<TestProgressState>((set, get) => ({
  currentTest: null,
  completedTests: [],
  setCurrentTest: (test) => set({ currentTest: test }),
  markTestCompleted: (test) => {
    const { completedTests } = get();
    if (!completedTests.includes(test)) {
      set({ completedTests: [...completedTests, test] });
    }
  },
  isTestCompleted: (test) => {
    const { completedTests } = get();
    return completedTests.includes(test);
  },
}));
