"use client"

import React from "react"
import { type JSX } from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { LayoutList, CheckCircle, AlertCircle } from "lucide-react"
import { Header } from "../Header"
import { useTestContext } from "@/context/TestContext"
import UseRedirectToNextTest from "@/hooks/useRedirect"

// Import Zustand store dan hooks
import { useDISCStore } from "@/stores/discStores"
import {
    useAutoSave,
    useStateValidation,
    useDataRecovery,
    useKeyboardNavigation,
    useBeforeUnload
} from "@/hooks/useDISCHooks"

import discJson from '@/data/questions/disc.json'
import Loading from "@/components/Loading"

// TypeScript interfaces
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

type TestType = "MBTI" | "DISC" | "TKD" | "KETELITIAN";


export default function DISC(): JSX.Element {
    const router = useRouter()
    const [error, setError] = useState<string>("")
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
    const [showNavigator, setShowNavigator] = useState(false)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)

    // Zustand store
    const {
        questions,
        answers,
        currentQuestion,
        autoNext,
        setQuestions,
        setAnswer,
        setCurrentQuestion,
        setAutoNext,
        setTestCompleted,
        setTestStarted,
        getProgress,
        getUnansweredQuestions,
        getInvalidQuestions,
        nextQuestion,
        previousQuestion,
        resetTest
    } = useDISCStore()

    // Custom hooks
    useAutoSave()
    useStateValidation()
    useKeyboardNavigation()
    useBeforeUnload()

    const { recoverData } = useDataRecovery()
    const { checkTest } = useTestContext()

    const listTest: TestType[] = checkTest?.JenisTes
        ? checkTest.JenisTes.split(",").map(t => t.trim() as TestType)
        : [];

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!checkTest?.time) return;

        const now = Math.floor(Date.now() / 1000);
        const start = Number(checkTest.time);
        const duration = 30 * 60; // 30 menit
        const remaining = Math.max(duration - (now - start), 0);

        // hanya set kalau > 0
        if (remaining > 0) {
            setTimeLeft(remaining);
        }
    }, [checkTest?.time]);

    const redirectToNextTest = UseRedirectToNextTest();

    // Function to format answers according to the desired structure
    // const formatJawaban = (rawAnswers: DISCAnswer[], questions: DISCQuestion[]): FormattedJawaban => {
    //     const npResults: string[] = [];
    //     const nkResults: string[] = [];

    //     rawAnswers.forEach((answer, index) => {
    //         const question = questions[index];
    //         if (!answer?.np || !answer?.nk || !question) return;

    //         // Get the actual DISC values based on the selected options
    //         const npKeys = ["np1", "np2", "np3", "np4"] as const;
    //         const nkKeys = ["nk1", "nk2", "nk3", "nk4"] as const;

    //         const npValue = npKeys.includes(answer.np as typeof npKeys[number])
    //             ? question[answer.np as keyof DISCQuestion]
    //             : undefined;
    //         const nkValue = nkKeys.includes(answer.nk as typeof nkKeys[number])
    //             ? question[answer.nk as keyof DISCQuestion]
    //             : undefined;

    //         if (npValue && nkValue) {
    //             npResults.push(npValue);
    //             nkResults.push(nkValue);
    //         }
    //     });

    //     return {
    //         NP: npResults,
    //         NK: nkResults
    //     };
    // };

    const formatAnswersForSubmission = (): Record<string, string> => {
        const formattedAnswers: Record<string, string> = {};

        answers.forEach((answer, index) => {
            if (answer.np && answer.nk) {
                formattedAnswers[index.toString()] = `${answer.np},${answer.nk}`;
            }
        });

        console.log({ formattedAnswers })

        return formattedAnswers;
    };

    // Load data from project files
    const loadDataFromFiles = async () => {
        try {
            setError("")

            // Cek apakah data sudah ada di store (dari localStorage)
            if (questions.length === 0) {
                console.log("Loading fresh DISC data...")
                setQuestions(discJson)
                setTestStarted(true)
            } else {
                console.log("DISC data loaded from store:", {
                    questionsCount: questions.length,
                    answeredCount: answers.filter(a => a?.np && a?.nk).length,
                    currentQuestion,
                    progress: getProgress()
                })

                // Recovery jika ada masalah data
                const recovered = recoverData(discJson)
                if (recovered) {
                    console.log("Data recovered successfully")
                    setTestStarted(true)
                }
            }

            // Set initialized setelah data berhasil dimuat
            setIsInitialized(true)
        } catch (err) {
            console.error('Error loading data:', err)
            setError(`Error loading data: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
    }

    useEffect(() => {
        void loadDataFromFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateTimeMutation = api.test.updateTime.useMutation({
        retry: false,
        onSuccess: (data) => {
            console.log("updateTime success:", data);
        },
        onError: (error) => {
            console.error("updateTime error:", error);
            router.refresh()
        },
    });

    // Add submitTest mutation
    const submitTestMutation = api.test.submitTest.useMutation({
        retry: false,
        onSuccess: (data) => {
            console.log("submitTest success:", data);
            setTestCompleted(true);
        },
        onError: (error) => {
            console.error("submitTest error:", error);
            router.refresh()
        },
    });

    useEffect(() => {
        const updateTime = async () => {
            try {
                const data = await updateTimeMutation.mutateAsync({ typeTest: "DISC" });
                console.log("updateTime result:", data);
            } catch (error) {
                console.error(error);
            }
        };

        const checkTime = async () => {
            try {
                if (checkTest?.time === 0) {
                    void updateTime();
                }

                if (checkTest?.time < 0) {
                    handleTimeUp()
                }
            } catch (error) {
                console.error(error);
            }
        };

        void checkTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAnswerSelect = (type: 'np' | 'nk', value: string): void => {
        const currentAnswer = answers[currentQuestion] || { np: '', nk: '' }
        const newAnswer = { ...currentAnswer, [type]: value }

        // Validation: P dan K tidak boleh sama
        if (type === 'np' && newAnswer.nk && value.slice(-1) === newAnswer.nk.slice(-1)) {
            return // Tidak mengizinkan pilihan yang sama
        }
        if (type === 'nk' && newAnswer.np && value.slice(-1) === newAnswer.np.slice(-1)) {
            return // Tidak mengizinkan pilihan yang sama
        }

        setAnswer(currentQuestion, newAnswer)
    }

    const handleNext = (): void => {
        nextQuestion()
    }

    const handlePrevious = (): void => {
        previousQuestion()
    }

    const handleSubmitTest = (): void => {
        setShowConfirmDialog(true)
    }

    // Auto Submit when timer completes
    const handleTimeUp = useCallback((): void => {
        const currentTime = Math.floor(Date.now() / 1000);
        const testStart = Number(checkTest?.time);
        const testDuration = 30 * 60;
        const actualTimeLeft = Math.max(testDuration - (currentTime - testStart), 0);

        if (actualTimeLeft > 0) {
            console.log("Time check failed, not submitting. Time left:", actualTimeLeft);
            return;
        }

        const formattedAnswers = formatAnswersForSubmission();
        console.log("Time's up! Auto-submitting test...")

        submitTestMutation.mutate({
            typeTest: "DISC",
            answers: formattedAnswers,
        });

        resetTest()

        void redirectToNextTest({
            activeTes: 'DISC',
            jenisTes: listTest,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitTestMutation, checkTest?.time, answers])

    const handleConfirmSubmit = async () => {
        const unanswered = getUnansweredQuestions()
        const invalid = getInvalidQuestions()
        setShowConfirmDialog(false)

        if (unanswered.length > 0) {
            setCurrentQuestion(unanswered[0])
        } else if (invalid.length > 0) {
            setCurrentQuestion(invalid[0])
        } else {
            // Get formatted jawaban before submitting
            // const formattedJawaban = getFormattedJawaban();

            const formattedAnswers = formatAnswersForSubmission();
            console.log("Formatted Jawaban:", formattedAnswers);
            // Submit the test to backend with formatted data
            submitTestMutation.mutate({
                typeTest: "DISC",
                answers: formattedAnswers,
            });

            resetTest()

            await redirectToNextTest({
                activeTes: 'DISC',
                jenisTes: listTest,
            })
        }
    }

    // Show error state
    if (error && !checkTest) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load test data</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Confirmation Dialog Component
    const ConfirmDialog = () => {
        const unanswered = getUnansweredQuestions()
        const invalid = getInvalidQuestions()
        const hasIssues = unanswered.length > 0 || invalid.length > 0

        return (
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            {hasIssues ? (
                                <>
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                    Ada Masalah dengan Jawaban
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Konfirmasi Tes DISC
                                </>
                            )}
                        </AlertDialogTitle>

                        <AlertDialogDescription asChild>
                            <div className="text-start">
                                {hasIssues ? (
                                    <div className="space-y-2">
                                        {unanswered.length > 0 && (
                                            <div>
                                                <div className="font-semibold">
                                                    {unanswered.length} soal belum dijawab lengkap:
                                                </div>
                                                <div className="text-sm">
                                                    Nomor: {unanswered.map(i => i + 1).join(", ")}
                                                </div>
                                            </div>
                                        )}
                                        {invalid.length > 0 && (
                                            <div>
                                                <div className="font-semibold text-red-600">
                                                    {invalid.length} pertanyaan memiliki jawaban P dan K yang sama:
                                                </div>
                                                <div className="text-sm">
                                                    Nomor: {invalid.map(i => i + 1).join(", ")}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span>
                                        Semua pertanyaan telah dijawab dengan benar. Apakah Anda yakin ingin menyelesaikan tes ini?
                                    </span>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        {hasIssues ? (
                            <>
                                <AlertDialogCancel>Lanjutkan Mengerjakan</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmSubmit}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    Pergi ke Soal yang Belum Dijawab
                                </AlertDialogAction>
                            </>
                        ) : (
                            <>
                                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmSubmit}
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                    disabled={submitTestMutation.isPending}
                                >
                                    {submitTestMutation.isPending ? "Submitting..." : "Submit"}
                                </AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    // Show loading if not initialized atau no questions loaded
    // if (!isInitialized || questions.length === 0) {
    //     return (
    //         <div className="min-h-screen bg-background flex items-center justify-center">
    //             <Card>
    //                 <CardContent className="p-8 text-center">
    //                     <p>Loading test questions...</p>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     )
    // }

    // Main exam interface
    const currentQuestionData = questions[currentQuestion]
    const currentAnswer = answers[currentQuestion] || { np: '', nk: '' }

    if (!currentQuestionData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    const isAnswerComplete = currentAnswer.np && currentAnswer.nk
    const hasInvalidAnswer = isAnswerComplete && currentAnswer.np.slice(-1) === currentAnswer.nk.slice(-1)

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl p-6">
                {/* Header with progress */}
                {isInitialized && (
                    <Header
                        timeLeft={timeLeft ?? 1800}
                        onTimeUp={handleTimeUp}
                        progress={getProgress()}
                        currentQuestion={currentQuestion}
                        totalQuestions={questions.length}
                        autoNext={autoNext}
                        onAutoNextChange={setAutoNext}
                        currentTest="DISC"
                    />
                )}

                {/* Instructions */}
                <Card className="mb-6">
                    <CardContent>
                        <h3 className="font-semibold mb-2 text-lg">Petunjuk:</h3>
                        <ol className="list-decimal ml-6 text-sm space-y-1">
                            <li>
                                Pilih salah satu opsi di kolom <strong className="text-blue-600">[P]</strong> yang{' '}
                                <strong className="text-blue-600">PALING</strong> menggambarkan diri Anda
                            </li>
                            <li>
                                Pilih salah satu opsi di kolom <strong className="text-red-600">[K]</strong> yang{' '}
                                <strong className="text-red-600">PALING TIDAK</strong> menggambarkan diri Anda
                            </li>
                        </ol>
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <strong className="text-amber-800">⚠️ CATATAN: JAWABAN P & K TIDAK BOLEH SAMA</strong>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex justify-between items-center">
                            <div>Soal {currentQuestion + 1}</div>
                            <div className="flex gap-2 items-center">
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                                    DISC
                                </div>
                                {hasInvalidAnswer && (
                                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        P & K Sama!
                                    </div>
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-lg font-medium text-center">
                            Gambaran Diri Saya
                        </div>

                        {/* Column Headers */}
                        <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg font-semibold">
                            <div className="col-span-8 flex items-center">
                                <span>Pernyataan</span>
                            </div>
                            <div className="col-span-2 text-center flex flex-col items-center">
                                <span>P</span>
                                {/* <span className="text-sm">👍</span> */}
                            </div>
                            <div className="col-span-2 text-center flex flex-col items-center">
                                <span>K</span>
                                {/* <span className="text-sm">👎</span> */}
                            </div>
                        </div>

                        {/* Question Lines */}
                        <div className="space-y-3">
                            {['line1', 'line2', 'line3', 'line4'].map((line, index) => (
                                <div key={index} className={`grid grid-cols-12 gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${(currentAnswer.np === `np${index + 1}` || currentAnswer.nk === `nk${index + 1}`)
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}>
                                    <div className="col-span-8 text-md font-medium flex items-center">
                                        <span className="mr-2 text-primary font-bold">{String.fromCharCode(65 + index)}.</span>
                                        {currentQuestionData[line as keyof DISCQuestion]}
                                    </div>

                                    {/* P Column */}
                                    <div className="col-span-2 flex justify-center items-center">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`np-${currentQuestion}`}
                                                value={`np${index + 1}`}
                                                checked={currentAnswer.np === `np${index + 1}`}
                                                onChange={() => handleAnswerSelect('np', `np${index + 1}`)}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </label>
                                    </div>

                                    {/* K Column */}
                                    <div className="col-span-2 flex justify-center items-center">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`nk-${currentQuestion}`}
                                                value={`nk${index + 1}`}
                                                checked={currentAnswer.nk === `nk${index + 1}`}
                                                onChange={() => handleAnswerSelect('nk', `nk${index + 1}`)}
                                                className="w-5 h-5 text-red-600 focus:ring-red-500 cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Validation Message */}
                        {hasInvalidAnswer && (
                            <div className="text-center font-medium p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-red-700">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>⚠️ Jawaban P dan K tidak boleh sama!</span>
                                </div>
                                <p className="text-sm text-red-600 mt-1">
                                    Silakan pilih opsi yang berbeda untuk P dan K
                                </p>
                            </div>
                        )}
                        {/* {!isAnswerComplete && (
                            <div className="text-center font-medium p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-blue-700">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Silakan pilih jawaban P dan K</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-1">
                                    Anda harus memilih satu opsi untuk P (Paling) dan satu opsi untuk K (Paling Tidak)
                                </p>
                            </div>
                        )}
                        {isAnswerComplete && !hasInvalidAnswer && (
                            <div className="text-center font-medium p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-green-700">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Jawaban valid!</span>
                                </div>
                            </div>
                        )} */}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        className="cursor-pointer"
                        disabled={currentQuestion === 0}
                        size="lg"
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {currentQuestion === questions.length - 1 ? (
                            <Button
                                onClick={handleSubmitTest}
                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                size="lg"
                                disabled={submitTestMutation.isPending}
                            >
                                {submitTestMutation.isPending ? "Submitting..." : "Submit"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="cursor-pointer"
                                disabled={currentQuestion === questions.length - 1}
                                size="lg"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="w-full space-y-6">
                    {/* Toggle untuk mobile */}
                    <div className="flex justify-center md:hidden">
                        <button
                            onClick={() => setShowNavigator(!showNavigator)}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-md"
                        >
                            <LayoutList className="w-5 h-5" />
                            {showNavigator ? "Tutup Soal" : "Lihat Soal"}
                        </button>
                    </div>

                    {/* Navigator Soal */}
                    <div className={`${showNavigator ? "flex" : "hidden"} justify-center gap-2 flex-wrap md:flex`}>
                        {questions.map((_, index: number) => {
                            const answer = answers[index]
                            const isComplete = answer?.np && answer?.nk
                            const isInvalid = isComplete && answer.np.slice(-1) === answer.nk.slice(-1)

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentQuestion(index)
                                        // if (window.innerWidth < 768) {
                                        //     setShowNavigator(false)
                                        // }
                                    }}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${index === currentQuestion
                                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                        : isInvalid
                                            ? "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                                            : isComplete
                                                ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Confirmation Dialog */}
                {showConfirmDialog && <ConfirmDialog />}

                {/* Debug: Show formatted jawaban in development */}
                {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-bold mb-2">Debug - Formatted Jawaban:</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(getFormattedJawaban(), null, 2)}
                        </pre>
                        <h3 className="font-bold mb-2 mt-4">Debug - Current Answer:</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(currentAnswer, null, 2)}
                        </pre>
                    </div>
                )} */}
            </div>
        </div>
    )
}