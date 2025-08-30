import { useEffect, useCallback } from "react";
import { useTKDStore } from "@/stores/tkdStores";

// Type definitions
interface Question {
  id: string | number;
  jenis: string;
  pertanyaan: string;
  jawaban: string[];
  gambar?: string;
  petunjuk?: string;
}

type Answers = Record<string, string>;

/**
 * Hook untuk auto-save jawaban ke localStorage
 * Menggunakan debounce untuk menghindari terlalu banyak write operations
 */
export const useTKDAutoSave = () => {
  const { answers, statusSoal, currentQuestion, testStarted, questions } =
    useTKDStore();

  useEffect(() => {
    if (!testStarted || questions.length === 0) return;

    const timeoutId = setTimeout(() => {
      try {
        // Create safe data object without circular references
        // const saveData = {
        //   answers: { ...answers }, // Now contains labels like {1: "A", 2: "B", etc.}
        //   statusSoal: { ...statusSoal },
        //   currentQuestion,
        //   timestamp: Date.now(),
        //   version: 1, // for future migrations
        // };

        console.log("TKD progress tracked:", {
          answeredCount: Object.keys(answers).filter(
            (key) => answers[key] && answers[key] !== "",
          ).length,
          totalQuestions: questions.length,
          currentQuestion,
          progress: `${Math.round((Object.keys(answers).filter((key) => answers[key] && answers[key] !== "").length / questions.length) * 100)}%`,
          answerLabels: answers, // Log the actual stored labels
        });
      } catch (error) {
        console.error("Failed to track TKD progress:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [answers, statusSoal, currentQuestion, testStarted, questions.length]);
};

/**
 * Hook untuk validasi state
 */
export const useTKDStateValidation = () => {
  const { questions, answers, statusSoal, currentQuestion } = useTKDStore();

  useEffect(() => {
    // Validasi current question index
    if (questions.length > 0 && currentQuestion >= questions.length) {
      console.warn("TKD Store: Current question index out of bounds", {
        currentQuestion,
        maxIndex: questions.length - 1,
      });
    }

    const invalidAnswers = Object.values(answers).filter(
      (answer) => answer && !["A", "B", "C", "D", "E"].includes(answer),
    );
    if (invalidAnswers.length > 0) {
      console.warn("TKD Store: Invalid answer labels detected", {
        invalidAnswers,
        validLabels: ["A", "B", "C", "D", "E"],
      });
    }

    // Validasi status soal
    const invalidStatuses = Object.values(statusSoal).filter(
      (status) =>
        !["belum dikerjakan", "sudah dikerjakan", "ragu-ragu"].includes(status),
    );
    if (invalidStatuses.length > 0) {
      console.warn("TKD Store: Invalid status values detected", {
        invalidStatuses,
        validValues: ["belum dikerjakan", "sudah dikerjakan", "ragu-ragu"],
      });
    }
  }, [questions.length, answers, statusSoal, currentQuestion]);
};

/**
 * Hook untuk recovery jika terjadi data corruption
 */
export const useTKDDataRecovery = () => {
  const { questions, setQuestions, resetTest } = useTKDStore();

  const recoverData = useCallback(
    (questionsData: Question[]) => {
      try {
        // Jika tidak ada data sama sekali, set questions
        if (questions.length === 0 && questionsData.length > 0) {
          // Sanitize data before setting
          const sanitizedQuestions = questionsData.map((question) => ({
            id: question.id,
            jenis: question.jenis,
            pertanyaan: question.pertanyaan,
            jawaban: Array.isArray(question.jawaban)
              ? [...question.jawaban]
              : [],
            gambar: question.gambar,
            petunjuk: question.petunjuk,
          }));

          setQuestions(sanitizedQuestions);
          return true;
        }

        // Jika ada mismatch dalam length, reset and set new data
        if (
          questions.length > 0 &&
          questionsData.length > 0 &&
          questions.length !== questionsData.length
        ) {
          console.warn(
            "TKD Store: Question length mismatch detected, resetting...",
          );
          resetTest();

          const sanitizedQuestions = questionsData.map((question) => ({
            id: question.id,
            jenis: question.jenis,
            pertanyaan: question.pertanyaan,
            jawaban: Array.isArray(question.jawaban)
              ? [...question.jawaban]
              : [],
            gambar: question.gambar,
            petunjuk: question.petunjuk,
          }));

          setQuestions(sanitizedQuestions);
          return true;
        }

        return false;
      } catch (error) {
        console.error("TKD Store: Error during data recovery", error);
        try {
          resetTest();
          const sanitizedQuestions = questionsData.map((question) => ({
            id: question.id,
            jenis: question.jenis,
            pertanyaan: question.pertanyaan,
            jawaban: Array.isArray(question.jawaban)
              ? [...question.jawaban]
              : [],
            gambar: question.gambar,
            petunjuk: question.petunjuk,
          }));
          setQuestions(sanitizedQuestions);
        } catch (resetError) {
          console.error("Failed to reset TKD store:", resetError);
        }
        return true;
      }
    },
    [questions.length, setQuestions, resetTest],
  );

  return { recoverData };
};

/**
 * Hook untuk mendapatkan statistik progress
 */
export const useTKDProgressStats = () => {
  const { answers, statusSoal, questions, getProgress, getAnsweredCount } =
    useTKDStore();

  const stats = {
    totalQuestions: questions.length,
    answeredQuestions: getAnsweredCount(),
    unansweredQuestions: questions.length - getAnsweredCount(),
    progressPercentage: getProgress(),
    isComplete: getAnsweredCount() === questions.length && questions.length > 0,
    statusBreakdown: {
      "belum dikerjakan": Object.values(statusSoal).filter(
        (s) => s === "belum dikerjakan",
      ).length,
      "sudah dikerjakan": Object.values(statusSoal).filter(
        (s) => s === "sudah dikerjakan",
      ).length,
      "ragu-ragu": Object.values(statusSoal).filter((s) => s === "ragu-ragu")
        .length,
    },
    // Breakdown by jenis
    jenisBreakdown:
      questions.length > 0 ? getJenisBreakdown(answers, questions) : null,
    // Answer labels summary
    answerLabelsBreakdown: getAnswerLabelsBreakdown(answers),
  };

  return stats;
};

/**
 * Helper function to get breakdown by jenis
 */
const getJenisBreakdown = (answers: Answers, questions: Question[]) => {
  const breakdown: Record<
    string,
    { answered: number; total: number; percentage: number }
  > = {};

  questions.forEach((question) => {
    const jenis = question.jenis;
    const questionId = question.id.toString();
    const isAnswered = !!(answers[questionId] && answers[questionId] !== "");

    // if (!breakdown[jenis]) {
    //   breakdown[jenis] = { answered: 0, total: 0, percentage: 0 };
    // }

    breakdown[jenis] ??= { answered: 0, total: 0, percentage: 0 };

    breakdown[jenis].total++;
    if (isAnswered) {
      breakdown[jenis].answered++;
    }
  });

  // Calculate percentages
  Object.keys(breakdown).forEach((jenis) => {
    breakdown[jenis]!.percentage =
      breakdown[jenis]!.total > 0
        ? Math.round(
            (breakdown[jenis]!.answered / breakdown[jenis]!.total) * 100,
          )
        : 0;
  });

  return breakdown;
};

/**
 * Helper function to get breakdown by answer labels (A, B, C, D, E)
 */
const getAnswerLabelsBreakdown = (answers: Answers) => {
  const breakdown = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  Object.values(answers).forEach((label) => {
    if (label && ["A", "B", "C", "D", "E"].includes(label)) {
      breakdown[label as keyof typeof breakdown]++;
    }
  });

  return breakdown;
};

/**
 * Hook untuk keyboard navigation
 */
export const useTKDKeyboardNavigation = () => {
  const {
    currentQuestion,
    questions,
    setCurrentQuestion,
    setAnswerByIndex, // Use the new method
    nextQuestion,
    previousQuestion,
    autoNext,
  } = useTKDStore();

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

      const currentQuestionData = questions[currentQuestion];
      if (!currentQuestionData) return;

      const questionId = currentQuestionData.id.toString();

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
          if (currentQuestionData.jawaban[0]) {
            setAnswerByIndex(questionId, 0); // Will store as "A"
            if (autoNext && currentQuestion < questions.length - 1) {
              setTimeout(() => nextQuestion(), 300);
            }
          }
          break;
        case "2":
        case "b":
        case "B":
          event.preventDefault();
          if (currentQuestionData.jawaban[1]) {
            setAnswerByIndex(questionId, 1); // Will store as "B"
            if (autoNext && currentQuestion < questions.length - 1) {
              setTimeout(() => nextQuestion(), 300);
            }
          }
          break;
        case "3":
        case "c":
        case "C":
          event.preventDefault();
          if (currentQuestionData.jawaban[2]) {
            setAnswerByIndex(questionId, 2); // Will store as "C"
            if (autoNext && currentQuestion < questions.length - 1) {
              setTimeout(() => nextQuestion(), 300);
            }
          }
          break;
        case "4":
        case "d":
        case "D":
          event.preventDefault();
          if (currentQuestionData.jawaban[3]) {
            setAnswerByIndex(questionId, 3); // Will store as "D"
            if (autoNext && currentQuestion < questions.length - 1) {
              setTimeout(() => nextQuestion(), 300);
            }
          }
          break;
        case "5":
        case "e":
        case "E":
          event.preventDefault();
          if (currentQuestionData.jawaban[4]) {
            setAnswerByIndex(questionId, 4); // Will store as "E"
            if (autoNext && currentQuestion < questions.length - 1) {
              setTimeout(() => nextQuestion(), 300);
            }
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
    questions,
    setAnswerByIndex,
    nextQuestion,
    previousQuestion,
    setCurrentQuestion,
    autoNext,
  ]);
};

/**
 * Hook untuk warning sebelum user keluar dari halaman
 */
export const useTKDBeforeUnload = () => {
  const { answers, testCompleted, testStarted, questions } = useTKDStore();

  useEffect(() => {
    const hasUnsavedAnswers =
      testStarted &&
      !testCompleted &&
      questions.length > 0 &&
      Object.keys(answers).some((key) => answers[key] && answers[key] !== "");

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
export const useTKDStoreMonitor = (enabled = false) => {
  const store = useTKDStore();

  useEffect(() => {
    if (!enabled) return;

    console.log("TKD Store State Changed:", {
      currentQuestion: store.currentQuestion,
      answeredCount: store.getAnsweredCount(),
      totalQuestions: store.questions.length,
      progress: store.getProgress(),
      testStarted: store.testStarted,
      testCompleted: store.testCompleted,
      activeJenis: store.activeJenis,
      answerLabels: store.answers, // Show stored labels
      timestamp: new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.currentQuestion,
    store.answers,
    store.questions.length,
    store.testStarted,
    store.testCompleted,
    store.activeJenis,
    enabled,
  ]);
};

/**
 * Hook untuk auto-submit ketika waktu habis
 */
export const useTKDAutoSubmit = (timeLeft: number, onSubmit: () => void) => {
  const { testStarted, testCompleted } = useTKDStore();

  useEffect(() => {
    // Only auto-submit if test is started, not completed, and time is up
    if (testStarted && !testCompleted && timeLeft <= 0) {
      console.log("Time's up! Auto-submitting TKD test...");
      onSubmit();
    }
  }, [timeLeft, testStarted, testCompleted, onSubmit]);
};

/**
 * Hook untuk load data dari server atau cache
 */
export const useTKDDataLoader = (questionsData: Question[]) => {
  const { questions, setQuestions, testStarted, setTestStarted } =
    useTKDStore();
  const { recoverData } = useTKDDataRecovery();

  useEffect(() => {
    if (!questionsData || questionsData.length === 0) {
      console.warn("TKD DataLoader: No questions data provided");
      return;
    }

    try {
      // Jika belum ada questions di store, set dari props
      if (questions.length === 0) {
        console.log("TKD DataLoader: Initializing questions from props");
        recoverData(questionsData);

        if (!testStarted) {
          setTestStarted(true);
        }
      } else {
        // Jika ada perbedaan, coba recovery
        if (questions.length !== questionsData.length) {
          console.log(
            "TKD DataLoader: Question length mismatch, attempting recovery",
          );
          recoverData(questionsData);
        }
      }
    } catch (error) {
      console.error("TKD DataLoader: Error loading data", error);
      // Fallback: force reset and reload
      try {
        setQuestions([]);
        setTimeout(() => {
          recoverData(questionsData);
          setTestStarted(true);
        }, 100);
      } catch (fallbackError) {
        console.error("TKD DataLoader: Fallback failed", fallbackError);
      }
    }
  }, [
    questionsData,
    questions.length,
    setQuestions,
    testStarted,
    setTestStarted,
    recoverData,
  ]);
};

/**
 * Hook untuk mendapatkan jawaban dalam format yang berbeda
 */
export const useTKDAnswerHelpers = () => {
  const { getAnswerValue, getAnswerLabel } = useTKDStore();

  return {
    // Get the stored label (A, B, C, D, E)
    getStoredLabel: getAnswerLabel,

    // Get the actual answer text
    getAnswerText: getAnswerValue,

    // Check if specific label is selected for a question
    isLabelSelected: (questionId: string, label: string) => {
      return getAnswerLabel(questionId) === label;
    },

    // Get all answers in both formats
    getFormattedAnswers: (questionIds: string[]) => {
      return questionIds.reduce(
        (acc, questionId) => {
          const label = getAnswerLabel(questionId);
          const text = getAnswerValue(questionId);
          acc[questionId] = { label, text };
          return acc;
        },
        {} as Record<string, { label: string | null; text: string | null }>,
      );
    },
  };
};
