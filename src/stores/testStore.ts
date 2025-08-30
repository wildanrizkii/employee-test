// stores/testStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSafeSessionStorage, getStorageInfo } from "@/utils/safeStorage";

type TestType = "MBTI" | "DISC" | "TKD" | "KETELITIAN";

interface TestState {
  // Test data
  participantId: string | null;
  activeTest: TestType | null;
  completedTests: TestType[];
  availableTests: TestType[];

  // Security & Session
  sessionHash: string | null;
  lastValidation: number | null;
  tokenExpiry: number | null; // Untuk track token expiration

  // Actions
  setTestData: (data: {
    participantId: string;
    activeTest: TestType | null;
    completedTests: TestType[];
    availableTests: TestType[];
    tokenExpiry?: number;
  }) => void;

  updateActiveTest: (testType: TestType | null) => void;
  addCompletedTest: (testType: TestType) => void;
  clearTestData: () => void;

  // Validation helpers
  canAccessTest: (testType: TestType) => boolean;
  isSessionValid: () => boolean;
  isTokenExpired: () => boolean;
}

// Enhanced session hash dengan lebih banyak faktor
const createSessionHash = (participantId: string, timestamp: number) => {
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "server";
  const data = `${participantId}-${timestamp}-${userAgent.slice(0, 10)}`;
  return btoa(data).slice(0, 20);
};

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      // Initial state
      participantId: null,
      activeTest: null,
      completedTests: [],
      availableTests: [],
      sessionHash: null,
      lastValidation: null,
      tokenExpiry: null,

      // Actions
      setTestData: (data) => {
        const timestamp = Date.now();
        const sessionHash = createSessionHash(data.participantId, timestamp);

        set({
          participantId: data.participantId,
          activeTest: data.activeTest,
          completedTests: data.completedTests,
          availableTests: data.availableTests,
          sessionHash,
          lastValidation: timestamp,
          tokenExpiry: data.tokenExpiry ?? null,
        });
      },

      updateActiveTest: (testType) => set({ activeTest: testType }),

      addCompletedTest: (testType) => {
        const state = get();
        const newCompleted = [...state.completedTests, testType];
        set({ completedTests: newCompleted });
      },

      clearTestData: () =>
        set({
          participantId: null,
          activeTest: null,
          completedTests: [],
          availableTests: [],
          sessionHash: null,
          lastValidation: null,
          tokenExpiry: null,
        }),

      // Enhanced validation
      isTokenExpired: () => {
        const state = get();
        if (!state.tokenExpiry) return false;
        return Date.now() > state.tokenExpiry;
      },

      // Validation helpers
      canAccessTest: (testType) => {
        const state = get();

        // Check basic validations
        if (!state.isSessionValid()) return false;
        if (state.isTokenExpired()) return false;

        // Check if test is the active test
        if (state.activeTest === testType) return true;

        // Don't allow access to completed tests
        if (state.completedTests.includes(testType)) return false;

        // Check if test is in available tests
        return state.availableTests.includes(testType);
      },

      isSessionValid: () => {
        const state = get();

        if (
          !state.sessionHash ||
          !state.lastValidation ||
          !state.participantId
        ) {
          return false;
        }

        // Check if token is expired
        if (state.isTokenExpired()) {
          get().clearTestData();
          return false;
        }

        // Session expires after 4 hours of inactivity
        const SESSION_DURATION = 4 * 60 * 60 * 1000;
        const isExpired = Date.now() - state.lastValidation > SESSION_DURATION;

        if (isExpired) {
          get().clearTestData();
          return false;
        }

        // Validate session hash
        const expectedHash = createSessionHash(
          state.participantId,
          state.lastValidation,
        );
        return state.sessionHash === expectedHash;
      },
    }),
    {
      name: "test-session",
      storage: createJSONStorage(() => createSafeSessionStorage()),
      // Add error handling for sessionStorage operations
      onRehydrateStorage: () => (state, error) => {
        const storageInfo = getStorageInfo();
        
        if (error) {
          console.error(
            "Test Store: Error rehydrating from sessionStorage:",
            error,
            "\nStorage Info:", storageInfo
          );
        } else if (state) {
          console.log(
            "Test Store: Successfully rehydrated from sessionStorage",
            "\nStorage Info:", storageInfo
          );
        } else {
          console.log(
            "Test Store: No stored session found, using defaults",
            "\nStorage Info:", storageInfo
          );
        }
      },
      // Skip persistence during SSR to avoid hydration mismatches
      skipHydration: typeof window === "undefined",
    },
  ),
);
