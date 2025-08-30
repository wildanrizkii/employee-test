import { useEffect, useRef } from "react";
import { useDISCStore } from "@/stores/discStores";

interface DISCQuestion {
  _id: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  np1: string;
  np2: string;
  np3: string;
  np4: string;
  nk1: string;
  nk2: string;
  nk3: string;
  nk4: string;
}

// Auto-save hook
export const useAutoSave = () => {
  const { answers, testStarted } = useDISCStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!testStarted) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      console.log("Auto-saving DISC test progress...");
      // The store already persists to localStorage automatically
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [answers, testStarted]);
};

// State validation hook
export const useStateValidation = () => {
  const { questions, answers } = useDISCStore();

  useEffect(() => {
    if (questions.length === 0) return;

    // Validate that answers array matches questions length
    if (answers.length !== questions.length) {
      console.warn("DISC: Answers array length mismatch with questions");
    }

    // Validate answer format
    answers.forEach((answer, index) => {
      if (answer && typeof answer === "object") {
        if (answer.np && answer.nk) {
          const npNum = answer.np.slice(-1);
          const nkNum = answer.nk.slice(-1);

          if (
            !["1", "2", "3", "4"].includes(npNum) ||
            !["1", "2", "3", "4"].includes(nkNum)
          ) {
            console.warn(
              `DISC: Invalid answer format at question ${index}:`,
              answer,
            );
          }

          if (npNum === nkNum) {
            console.warn(
              `DISC: Same P and K answer at question ${index}:`,
              answer,
            );
          }
        }
      }
    });
  }, [questions, answers]);
};

// Data recovery hook
export const useDataRecovery = () => {
  const { questions, setQuestions } = useDISCStore();

  const recoverData = (backupQuestions: DISCQuestion[]) => {
    try {
      // If questions are missing or corrupted, restore from backup
      if (
        questions.length === 0 ||
        questions.length !== backupQuestions.length
      ) {
        console.log("DISC: Recovering questions data from backup");
        setQuestions(backupQuestions);
        return true;
      }

      // Validate questions structure
      const isValid = questions.every(
        (q) =>
          q?._id &&
          q?.line1 &&
          q?.line2 &&
          q?.line3 &&
          q?.line4 &&
          q?.np1 &&
          q?.np2 &&
          q?.np3 &&
          q?.np4 &&
          q?.nk1 &&
          q?.nk2 &&
          q?.nk3 &&
          q?.nk4,
      );

      if (!isValid) {
        console.log(
          "DISC: Invalid questions structure, recovering from backup",
        );
        setQuestions(backupQuestions);
        return true;
      }

      return false;
    } catch (error) {
      console.error("DISC: Error during data recovery:", error);
      setQuestions(backupQuestions);
      return true;
    }
  };

  return { recoverData };
};

// Progress statistics hook
export const useProgressStats = () => {
  const { getProgress, getUnansweredQuestions, getInvalidQuestions } =
    useDISCStore();

  const getStats = () => ({
    progress: getProgress(),
    unanswered: getUnansweredQuestions().length,
    invalid: getInvalidQuestions().length,
    isComplete:
      getUnansweredQuestions().length === 0 &&
      getInvalidQuestions().length === 0,
  });

  return getStats;
};

// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  const {
    currentQuestion,
    questions,
    nextQuestion,
    previousQuestion,
    setAnswer,
    answers,
  } = useDISCStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          previousQuestion();
          break;

        case "ArrowRight":
          event.preventDefault();
          nextQuestion();
          break;

        case "1":
        case "2":
        case "3":
        case "4":
          event.preventDefault();
          // Set P answer with number key
          if (event.shiftKey) {
            // Shift + number for K answer
            const currentAnswer = answers[currentQuestion] || {
              np: "",
              nk: "",
            };
            const newValue = `nk${event.key}`;
            if (currentAnswer.np.slice(-1) !== event.key) {
              setAnswer(currentQuestion, { ...currentAnswer, nk: newValue });
            }
          } else {
            // Just number for P answer
            const currentAnswer = answers[currentQuestion] || {
              np: "",
              nk: "",
            };
            const newValue = `np${event.key}`;
            if (currentAnswer.nk.slice(-1) !== event.key) {
              setAnswer(currentQuestion, { ...currentAnswer, np: newValue });
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentQuestion,
    questions.length,
    nextQuestion,
    previousQuestion,
    setAnswer,
    answers,
  ]);
};

// Before unload warning hook
export const useBeforeUnload = () => {
  const { testStarted, testCompleted } = useDISCStore();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (testStarted && !testCompleted) {
        const message =
          "You have an ongoing DISC test. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    if (testStarted && !testCompleted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [testStarted, testCompleted]);
};

// Test timer hook
export const useTestTimer = (duration: number = 30 * 60) => {
  const { testStarted } = useDISCStore();

  useEffect(() => {
    if (!testStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const checkTime = () => {
      const remaining = Math.max(0, endTime - Date.now());
      return Math.floor(remaining / 1000);
    };

    const interval = setInterval(() => {
      const remaining = checkTime();
      if (remaining <= 0) {
        console.log("DISC test time expired");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testStarted, duration]);
};

// Question validation hook
export const useQuestionValidation = () => {
  const { answers, currentQuestion } = useDISCStore();

  const validateCurrentQuestion = () => {
    const answer = answers[currentQuestion];
    if (!answer?.np || !answer?.nk) {
      return { isValid: false, message: "Both P and K answers are required" };
    }

    if (answer.np.slice(-1) === answer.nk.slice(-1)) {
      return { isValid: false, message: "P and K answers cannot be the same" };
    }

    return { isValid: true, message: "" };
  };

  const validateAllQuestions = () => {
    const unanswered: number[] = [];
    const invalid: number[] = [];

    answers.forEach((answer, index) => {
      if (!answer?.np || !answer?.nk) {
        unanswered.push(index);
      } else if (answer.np.slice(-1) === answer.nk.slice(-1)) {
        invalid.push(index);
      }
    });

    return {
      isAllValid: unanswered.length === 0 && invalid.length === 0,
      unanswered,
      invalid,
    };
  };

  return { validateCurrentQuestion, validateAllQuestions };
};
