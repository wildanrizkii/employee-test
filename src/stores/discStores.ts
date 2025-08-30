import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createSafeStorage, getStorageInfo } from '@/utils/safeStorage'

interface DISCQuestion {
    _id: string
    line1: string
    line2: string
    line3: string
    line4: string
    np1: string
    np2: string
    np3: string
    np4: string
    nk1: string
    nk2: string
    nk3: string
    nk4: string
}

interface DISCAnswer {
    np: string
    nk: string
}

interface DISCState {
    // Data
    questions: DISCQuestion[]
    answers: DISCAnswer[]
    
    // UI State
    currentQuestion: number
    autoNext: boolean
    testCompleted: boolean
    testStarted: boolean
    
    // Actions - Data Management
    setQuestions: (questions: DISCQuestion[]) => void
    setAnswer: (index: number, answer: DISCAnswer) => void
    
    // Actions - Navigation
    setCurrentQuestion: (index: number) => void
    nextQuestion: () => void
    previousQuestion: () => void
    
    // Actions - Test State
    setAutoNext: (autoNext: boolean) => void
    setTestCompleted: (completed: boolean) => void
    setTestStarted: (started: boolean) => void
    
    // Actions - Reset
    resetTest: () => void
    
    // Computed Values
    getProgress: () => number
    getUnansweredQuestions: () => number[]
    getInvalidQuestions: () => number[]
    isQuestionAnswered: (index: number) => boolean
    isQuestionValid: (index: number) => boolean
}

const initialState = {
    questions: [],
    answers: [],
    currentQuestion: 0,
    autoNext: false,
    testCompleted: false,
    testStarted: false,
}

export const useDISCStore = create<DISCState>()(
    persist(
        (set, get) => ({
            // Initial state
            ...initialState,
            
            // Data Management Actions
            setQuestions: (questions) => 
                set((state) => {
                    // Initialize empty answers array when questions are set
                    const newAnswers = questions.map((_, index) => 
                        state.answers[index] ?? { np: '', nk: '' }
                    )
                    return {
                        questions,
                        answers: newAnswers
                    }
                }),
            
            setAnswer: (index, answer) =>
                set((state) => {
                    const newAnswers = [...state.answers]
                    newAnswers[index] = answer
                    return { answers: newAnswers }
                }),
            
            // Navigation Actions
            setCurrentQuestion: (index) =>
                set((state) => ({
                    currentQuestion: Math.max(0, Math.min(index, state.questions.length - 1))
                })),
            
            nextQuestion: () =>
                set((state) => ({
                    currentQuestion: Math.min(state.currentQuestion + 1, state.questions.length - 1)
                })),
            
            previousQuestion: () =>
                set((state) => ({
                    currentQuestion: Math.max(state.currentQuestion - 1, 0)
                })),
            
            // Test State Actions
            setAutoNext: (autoNext) => set({ autoNext }),
            setTestCompleted: (completed) => set({ testCompleted: completed }),
            setTestStarted: (started) => set({ testStarted: started }),
            
            // Reset Action
            resetTest: () => set(initialState),
            
            // Computed Values
            getProgress: () => {
                const state = get()
                if (state.questions.length === 0) return 0
                
                const validAnswers = state.answers.filter(answer => 
                    answer?.np && answer?.nk && 
                    answer.np.slice(-1) !== answer.nk.slice(-1) // P and K must be different
                ).length
                
                return Math.round((validAnswers / state.questions.length) * 100)
            },
            
            getUnansweredQuestions: () => {
                const state = get()
                return state.answers
                    .map((answer, index) => ({ answer, index }))
                    .filter(({ answer }) => !answer?.np || !answer?.nk)
                    .map(({ index }) => index)
            },
            
            getInvalidQuestions: () => {
                const state = get()
                return state.answers
                    .map((answer, index) => ({ answer, index }))
                    .filter(({ answer }) => 
                        answer?.np && answer?.nk && 
                        answer.np.slice(-1) === answer.nk.slice(-1) // P and K are the same
                    )
                    .map(({ index }) => index)
            },
            
            isQuestionAnswered: (index) => {
                const state = get()
                const answer = state.answers[index]
                return !!(answer?.np && answer?.nk)
            },
            
            isQuestionValid: (index) => {
                const state = get()
                const answer = state.answers[index]
                if (!answer?.np || !answer?.nk) return false
                return answer.np.slice(-1) !== answer.nk.slice(-1)
            },
        }),
        {
            name: 'disc-test-storage',
            storage: createJSONStorage(() => createSafeStorage()),
            partialize: (state) => ({
                questions: state.questions,
                answers: state.answers,
                currentQuestion: state.currentQuestion,
                testStarted: state.testStarted,
                // Don't persist UI states like autoNext, testCompleted
            }),
            // Add error handling for localStorage operations
            onRehydrateStorage: () => (state, error) => {
                const storageInfo = getStorageInfo();
                
                if (error) {
                    console.error(
                        "DISC Store: Error rehydrating from localStorage:",
                        error,
                        "\nStorage Info:", storageInfo
                    );
                } else if (state) {
                    console.log(
                        "DISC Store: Successfully rehydrated from localStorage",
                        "\nStorage Info:", storageInfo
                    );
                } else {
                    console.log(
                        "DISC Store: No stored state found, using defaults",
                        "\nStorage Info:", storageInfo
                    );
                }
            },
            // Skip persistence during SSR to avoid hydration mismatches
            skipHydration: typeof window === "undefined",
        }
    )
)