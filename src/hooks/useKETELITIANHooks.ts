import { useEffect } from "react";
import { useKetelitianStore } from "@/stores/ketelitianStores";

// Add interface for ketelitian questions
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

/**
 * Hook untuk auto-save jawaban ke localStorage
 * Menggunakan debounce untuk menghindari terlalu banyak write operations
 */
export const useAutoSave = () => {
  const { answers, currentQuestion, testStarted, questions } =
    useKetelitianStore();

  useEffect(() => {
    if (!testStarted || questions.length === 0) return;

    const timeoutId = setTimeout(() => {
      try {
        // Save to localStorage with error handling
        // const saveData = {
        //   answers,
        //   currentQuestion,
        //   timestamp: Date.now(),
        //   version: 1, // for future migrations
        // };

        console.log("Auto-saving Ketelitian progress...", {
          answeredCount: answers.filter((a) => a !== "").length,
          totalQuestions: answers.length,
          currentQuestion,
          progress: `${Math.round((answers.filter((a) => a !== "").length / answers.length) * 100)}%`,
        });
      } catch (error) {
        console.error("Failed to save Ketelitian progress:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [answers, currentQuestion, testStarted, questions.length]);
};

export const useStateValidation = () => {
  const { questions, answers, currentQuestion } = useKetelitianStore();

  useEffect(() => {
    // Validasi panjang array
    if (questions.length > 0 && answers.length !== questions.length) {
      console.warn(
        "Ketelitian Store: Mismatch between questions and answers length",
        {
          questionsLength: questions.length,
          answersLength: answers.length,
        },
      );
    }

    // Validasi current question index
    if (questions.length > 0 && currentQuestion >= questions.length) {
      console.warn("Ketelitian Store: Current question index out of bounds", {
        currentQuestion,
        maxIndex: questions.length - 1,
      });
    }

    // Validasi struktur jawaban untuk Ketelitian (S/T)
    const invalidAnswers = answers.filter(
      (answer) => answer !== "" && answer !== "S" && answer !== "T",
    );
    if (invalidAnswers.length > 0) {
      console.warn("Ketelitian Store: Invalid answer values detected", {
        invalidAnswers,
        validValues: ["", "S", "T"],
      });
    }
  }, [questions.length, answers.length, currentQuestion, answers]);
};

/**
 * Hook untuk recovery jika terjadi data corruption
 */
export const useDataRecovery = () => {
  const {
    questions,
    answers,
    setQuestions,
    setAnswers,
    setCurrentQuestion,
    resetTest,
  } = useKetelitianStore();

  const recoverData = (questionsData: KetelitianQuestion[]) => {
    try {
      // Jika tidak ada data sama sekali
      if (questions.length === 0) {
        setQuestions(questionsData);
        return true;
      }

      // Jika panjang tidak sama, coba recover dari localStorage dulu
      if (answers.length !== questions.length) {
        console.warn(
          "Ketelitian Store: Data length mismatch detected, attempting recovery...",
        );

        try {
          const savedData = localStorage.getItem("ketelitian-test-storage");
          if (savedData) {
            const parsed = JSON.parse(savedData) as {
              state: {
                answers: string[];
                currentQuestion?: number;
              };
            };
            if (
              parsed.state?.answers &&
              Array.isArray(parsed.state.answers) &&
              parsed.state.answers.length === questionsData.length
            ) {
              setAnswers(parsed.state.answers);
              setCurrentQuestion(parsed.state.currentQuestion ?? 0);
              console.log(
                "Ketelitian Store: Successfully recovered from localStorage",
              );
              return true;
            }
          }
        } catch (localStorageError) {
          console.error(
            "Failed to recover from localStorage:",
            localStorageError,
          );
        }

        // Jika recovery gagal, reset dengan data baru
        setQuestions(questionsData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Ketelitian Store: Error during data recovery", error);
      resetTest();
      setQuestions(questionsData);
      return true;
    }
  };

  return { recoverData };
};

/**
 * Hook untuk mendapatkan statistik progress
 */
export const useProgressStats = () => {
  const { answers, questions, getProgress } = useKetelitianStore();

  const stats = {
    totalQuestions: questions.length,
    answeredQuestions: answers.filter((a) => a !== "").length,
    unansweredQuestions: answers.filter((a) => a === "").length,
    progressPercentage: getProgress(),
    isComplete: answers.every((a) => a !== "") && questions.length > 0,
    answersBreakdown: {
      S: answers.filter((a) => a === "S").length,
      T: answers.filter((a) => a === "T").length,
      empty: answers.filter((a) => a === "").length,
    },
    // Accuracy statistics
    accuracyStats:
      questions.length > 0 ? getAccuracyStats(answers, questions) : null,
  };

  return stats;
};

/**
 * Helper function to get accuracy statistics
 */
const getAccuracyStats = (
  answers: string[],
  questions: KetelitianQuestion[],
) => {
  let correct = 0;
  let incorrect = 0;
  let answered = 0;

  questions.forEach((question, index) => {
    const answer = answers[index];
    if (answer && answer !== "") {
      answered++;
      const isCorrect = question.pernyataan1 === question.pernyataan2;
      if ((answer === "S" && isCorrect) || (answer === "T" && !isCorrect)) {
        correct++;
      } else {
        incorrect++;
      }
    }
  });

  return {
    correct,
    incorrect,
    answered,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    completionRate: Math.round((answered / questions.length) * 100),
  };
};

/**
 * Hook untuk keyboard navigation dengan improved UX
 */
export const useKeyboardNavigation = () => {
  const {
    currentQuestion,
    questions,
    setCurrentQuestion,
    setAnswer,
    nextQuestion,
    previousQuestion,
    autoNext,
  } = useKetelitianStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Hanya aktif jika tidak ada input yang fokus
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("role") === "dialog"
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          if (currentQuestion > 0) {
            previousQuestion();
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          if (currentQuestion < questions.length - 1) {
            nextQuestion();
          }
          break;
        case "1":
        case "s":
        case "S":
          event.preventDefault();
          setAnswer(currentQuestion, "S");
          // Auto advance if enabled and not last question
          if (autoNext && currentQuestion < questions.length - 1) {
            setTimeout(() => nextQuestion(), 300);
          }
          break;
        case "2":
        case "d":
        case "D":
          event.preventDefault();
          setAnswer(currentQuestion, "T");
          // Auto advance if enabled and not last question
          if (autoNext && currentQuestion < questions.length - 1) {
            setTimeout(() => nextQuestion(), 300);
          }
          break;
        case "Home":
          event.preventDefault();
          setCurrentQuestion(0);
          break;
        case "End":
          event.preventDefault();
          setCurrentQuestion(questions.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentQuestion,
    questions.length,
    setAnswer,
    nextQuestion,
    previousQuestion,
    setCurrentQuestion,
    autoNext,
  ]);
};

/**
 * Hook untuk warning sebelum user keluar dari halaman
 */
export const useBeforeUnload = () => {
  const { answers, testCompleted, testStarted, questions } =
    useKetelitianStore();

  useEffect(() => {
    const hasUnsavedAnswers =
      testStarted &&
      !testCompleted &&
      questions.length > 0 &&
      answers.some((a) => a !== "");

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedAnswers) {
        event.preventDefault();
        event.returnValue =
          "Anda memiliki jawaban yang belum selesai. Apakah yakin ingin keluar?";
        return "Anda memiliki jawaban yang belum selesai. Apakah yakin ingin keluar?";
      }
    };

    if (hasUnsavedAnswers) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [answers, testCompleted, testStarted, questions.length]);
};

/**
 * Hook untuk monitoring perubahan dan logging
 */
export const useStoreMonitor = (enabled = false) => {
  const store = useKetelitianStore();

  useEffect(() => {
    if (!enabled) return;

    console.log("Ketelitian Store State Changed:", {
      currentQuestion: store.currentQuestion,
      answeredCount: store.answers.filter((a) => a !== "").length,
      totalQuestions: store.questions.length,
      progress: store.getProgress(),
      testStarted: store.testStarted,
      testCompleted: store.testCompleted,
      timestamp: new Date().toISOString(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.currentQuestion,
    store.answers,
    store.questions.length,
    store.testStarted,
    store.testCompleted,
    enabled,
  ]);
};

/**
 * Hook untuk mendapatkan hasil kalkulasi ketelitian
 */
export const useKetelitianResults = () => {
  const { answers, questions, calculateResult } = useKetelitianStore();

  const getResults = (): KetelitianResult | null => {
    return calculateResult();
  };

  const getDetailedResults = () => {
    if (questions.length === 0 || answers.length === 0) return null;

    const results: {
      questionIndex: number;
      question: KetelitianQuestion;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }[] = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index] ?? "";
      const isStatementsSame = question.pernyataan1 === question.pernyataan2;
      const correctAnswer = isStatementsSame ? "S" : "T";
      const isCorrect = userAnswer === correctAnswer;

      results.push({
        questionIndex: index,
        question,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
    });

    return results;
  };

  return {
    getResults,
    getDetailedResults,
  };
};

/**
 * Hook untuk auto-submit ketika waktu habis
 */
export const useAutoSubmit = (timeLeft: number, onSubmit: () => void) => {
  const { testStarted, testCompleted } = useKetelitianStore();

  useEffect(() => {
    // Only auto-submit if test is started, not completed, and time is up
    if (testStarted && !testCompleted && timeLeft <= 0) {
      console.log("Time's up! Auto-submitting Ketelitian test...");
      onSubmit();
    }
  }, [timeLeft, testStarted, testCompleted, onSubmit]);
};

/**
 * Hook untuk validasi sebelum submit
 */
export const useSubmitValidation = () => {
  const { answers, questions, getUnansweredQuestions } = useKetelitianStore();

  const validateBeforeSubmit = () => {
    const unanswered = getUnansweredQuestions();
    const totalAnswered = answers.filter((a) => a !== "").length;
    const completionPercentage = Math.round(
      (totalAnswered / questions.length) * 100,
    );

    return {
      canSubmit: unanswered.length === 0,
      unansweredCount: unanswered.length,
      unansweredQuestions: unanswered,
      totalAnswered,
      completionPercentage,
      warnings: {
        hasUnanswered: unanswered.length > 0,
        lowCompletion: completionPercentage < 80,
      },
    };
  };

  return { validateBeforeSubmit };
};
