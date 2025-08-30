import { useEffect } from "react";
import { useMBTIStore } from "@/stores/mbtiStores";

// Add interface for formatted answers
interface MBTIQuestion {
  _id: { $oid: string };
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

type Kolom = "kolom1" | "kolom2" | "kolom3" | "kolom4";
type Bagian = {
  kolom1: string[];
  kolom2: string[];
  kolom3: string[];
  kolom4: string[];
};

interface FormattedJawaban {
  bagian1: Bagian;
  bagian2: Bagian;
  bagian3: Bagian;
}

/**
 * Hook untuk auto-save jawaban ke localStorage
 * Menggunakan debounce untuk menghindari terlalu banyak write operations
 */
export const useAutoSave = () => {
  const { answers, currentQuestion, testStarted, questions } = useMBTIStore();

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
        // localStorage.setItem("mbti_progress", JSON.stringify(saveData));
        console.log("Auto-saving MBTI progress...", {
          answeredCount: answers.filter((a) => a !== "").length,
          totalQuestions: answers.length,
          currentQuestion,
          progress: `${Math.round((answers.filter((a) => a !== "").length / answers.length) * 100)}%`,
        });
      } catch (error) {
        console.error("Failed to save MBTI progress:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [answers, currentQuestion, testStarted, questions.length]);
};

export const useStateValidation = () => {
  const { questions, answers, currentQuestion } = useMBTIStore();

  useEffect(() => {
    // Validasi panjang array
    if (questions.length > 0 && answers.length !== questions.length) {
      console.warn(
        "MBTI Store: Mismatch between questions and answers length",
        {
          questionsLength: questions.length,
          answersLength: answers.length,
        },
      );
    }

    // Validasi current question index
    if (questions.length > 0 && currentQuestion >= questions.length) {
      console.warn("MBTI Store: Current question index out of bounds", {
        currentQuestion,
        maxIndex: questions.length - 1,
      });
    }

    // Validasi struktur jawaban
    const invalidAnswers = answers.filter(
      (answer) => answer !== "" && answer !== "A" && answer !== "B",
    );
    if (invalidAnswers.length > 0) {
      console.warn("MBTI Store: Invalid answer values detected", {
        invalidAnswers,
        validValues: ["", "A", "B"],
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

    setCurrentQuestion,
    resetTest,
  } = useMBTIStore();

  const recoverData = (questionsData: MBTIQuestion[]) => {
    try {
      // Jika tidak ada data sama sekali
      if (questions.length === 0) {
        setQuestions(questionsData);
        return true;
      }

      // Jika panjang tidak sama, coba recover dari localStorage dulu
      if (answers.length !== questions.length) {
        console.warn(
          "MBTI Store: Data length mismatch detected, attempting recovery...",
        );

        try {
          const savedData = localStorage.getItem("mbti_progress");
          if (savedData) {
            const parsed = JSON.parse(savedData) as {
              answers: string[];
              currentQuestion?: number;
            };
            if (
              parsed.answers &&
              Array.isArray(parsed.answers) &&
              parsed.answers.length === questionsData.length
            ) {
              setCurrentQuestion(parsed.currentQuestion ?? 0);
              console.log(
                "MBTI Store: Successfully recovered from localStorage",
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
      console.error("MBTI Store: Error during data recovery", error);
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
  const { answers, questions, getProgress } = useMBTIStore();

  const stats = {
    totalQuestions: questions.length,
    answeredQuestions: answers.filter((a) => a !== "").length,
    unansweredQuestions: answers.filter((a) => a === "").length,
    progressPercentage: getProgress(),
    isComplete: answers.every((a) => a !== "") && questions.length > 0,
    answersBreakdown: {
      A: answers.filter((a) => a === "A").length,
      B: answers.filter((a) => a === "B").length,
      empty: answers.filter((a) => a === "").length,
    },
    // Add breakdown by bagian and tipe
    bagianBreakdown:
      questions.length > 0 ? getBagianBreakdown(answers, questions) : null,
  };

  return stats;
};

/**
 * Helper function to get breakdown by bagian and tipe
 */
const getBagianBreakdown = (answers: string[], questions: MBTIQuestion[]) => {
  const breakdown: Record<
    string,
    Record<string, { A: number; B: number; empty: number }>
  > = {};

  questions.forEach((question, index) => {
    const answer = answers[index] || "";
    const bagian = question.bagian || "unknown";
    const tipe = question.tipe || "unknown";

    if (!breakdown[bagian]) {
      breakdown[bagian] = {};
    }

    if (!breakdown[bagian][tipe]) {
      breakdown[bagian][tipe] = { A: 0, B: 0, empty: 0 };
    }

    if (answer === "A") {
      breakdown[bagian][tipe].A++;
    } else if (answer === "B") {
      breakdown[bagian][tipe].B++;
    } else {
      breakdown[bagian][tipe].empty++;
    }
  });

  return breakdown;
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
  } = useMBTIStore();

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
        case "a":
        case "A":
          event.preventDefault();
          setAnswer(currentQuestion, "A");
          // Auto advance if enabled and not last question
          if (autoNext && currentQuestion < questions.length - 1) {
            setTimeout(() => nextQuestion(), 300);
          }
          break;
        case "2":
        case "b":
        case "B":
          event.preventDefault();
          setAnswer(currentQuestion, "B");
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
  const { answers, testCompleted, testStarted, questions } = useMBTIStore();

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
  const store = useMBTIStore();

  useEffect(() => {
    if (!enabled) return;

    console.log("MBTI Store State Changed:", {
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
 * New hook untuk format jawaban sesuai struktur yang diinginkan
 */
export const useFormattedAnswers = () => {
  const { answers, questions } = useMBTIStore();

  const formatJawaban = (): FormattedJawaban => {
    const result: FormattedJawaban = {
      bagian1: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
      bagian2: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
      bagian3: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
    };

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (!answer || answer === "") return; // Skip unanswered questions

      // Extract bagian number (1, 2, or 3)
      const bagianMatch = /bagian(\d)/i.exec(question.bagian);
      if (!bagianMatch) return;

      const bagianNumber = bagianMatch[1];
      const bagianKey = `bagian${bagianNumber}` as keyof FormattedJawaban;

      // Extract tipe number (1, 2, 3, or 4) and map to kolom
      const tipeNumber = question.tipe;
      const kolomKey = `kolom${tipeNumber}` as Kolom;

      // Get the actual value based on the answer (A or B)
      const value = answer === "A" ? question.valueA : question.valueB;

      result[bagianKey]?.[kolomKey]?.push(value);
    });

    return result;
  };

  const getFormattedAnswers = () => formatJawaban();

  const validateFormattedAnswers = () => {
    const formatted: FormattedJawaban = formatJawaban();

    const totalAnswers = (Object.values(formatted) as Bagian[]).reduce(
      (acc, bagian) => {
        return (
          acc +
          Object.values(bagian).reduce((bagianAcc, kolom) => {
            return bagianAcc + kolom.length;
          }, 0)
        );
      },
      0,
    );

    const answeredCount = answers.filter((a) => a !== "").length;

    return {
      isValid: totalAnswers === answeredCount,
      totalFormatted: totalAnswers,
      totalAnswered: answeredCount,
      formatted,
    };
  };

  return {
    getFormattedAnswers,
    validateFormattedAnswers,
    formatJawaban,
  };
};

/**
 * Hook untuk auto-submit ketika waktu habis
 */
export const useAutoSubmit = (timeLeft: number, onSubmit: () => void) => {
  const { testStarted, testCompleted } = useMBTIStore();

  useEffect(() => {
    // Only auto-submit if test is started, not completed, and time is up
    if (testStarted && !testCompleted && timeLeft <= 0) {
      console.log("Time's up! Auto-submitting test...");
      onSubmit();
    }
  }, [timeLeft, testStarted, testCompleted, onSubmit]);
};
