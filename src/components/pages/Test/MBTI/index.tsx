
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
import { useMBTIStore } from "@/stores/mbtiStores"
import {
    useAutoSave,
    useStateValidation,
    useDataRecovery,
    useKeyboardNavigation,
    useBeforeUnload
} from "@/hooks/useMBTIHooks"

import mbtiJson from '@/data/questions/mbti1.json'

type TestType = "MBTI" | "DISC" | "TKD" | "KETELITIAN";

export default function MBTI(): JSX.Element {
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
        nextQuestion,
        previousQuestion,
        resetTest
    } = useMBTIStore()

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

    const redirectToNextTest = UseRedirectToNextTest();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (checkTest?.time === -1) {
            console.log(checkTest?.time)
            void redirectToNextTest({
                activeTes: 'MBTI',
                jenisTes: listTest,
            })
        }

        const now = Math.floor(Date.now() / 1000);
        const start = Number(checkTest.time);
        const duration = 30 * 60; // 30 menit
        const remaining = Math.max(duration - (now - start), 0);

        // hanya set kalau > 0
        if (remaining > 0) {
            setTimeLeft(remaining);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load data from project files
    const loadDataFromFiles = async () => {
        try {
            setError("")

            // Cek apakah data sudah ada di store (dari localStorage)
            if (questions.length === 0) {
                console.log("Loading fresh MBTI data...")
                setQuestions(mbtiJson)
                setTestStarted(true)
            } else {
                console.log("MBTI data loaded from store:", {
                    questionsCount: questions.length,
                    answeredCount: answers.filter(a => a !== '').length,
                    currentQuestion,
                    progress: getProgress()
                })

                // Recovery jika ada masalah data
                const recovered = recoverData(mbtiJson)
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
            console.error("UpdateTime error:", error);
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
            setTestCompleted(true);
            router.refresh()
        },
    });

    useEffect(() => {
        const updateTime = async () => {
            try {
                const data = await updateTimeMutation.mutateAsync({ typeTest: "MBTI" });
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
                    void handleTimeUp()
                }
            } catch (error) {
                console.error(error);
            }
        };

        void checkTime();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAnswerSelect = (answer: string): void => {
        setAnswer(currentQuestion, answer)

        // Auto next jika diaktifkan dan bukan soal terakhir
        if (autoNext && currentQuestion < questions.length - 1) {
            setTimeout(() => {
                nextQuestion()
            }, 300)
        }
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

    const handleTimeUp = useCallback(async (): Promise<void> => {
        const currentTime = Math.floor(Date.now() / 1000);
        const testStart = Number(checkTest?.time);
        const testDuration = 30 * 60;
        const actualTimeLeft = Math.max(testDuration - (currentTime - testStart), 0);

        if (actualTimeLeft > 0) {
            console.log("Time check failed, not submitting. Time left:", actualTimeLeft);
            return;
        }

        console.log("Time's up! Auto-submitting test...")

        // Convert answers array to object format for backend (sama seperti handleConfirmSubmit)
        const answersObject: Record<string, string> = {};
        answers.forEach((answer, index) => {
            if (answer !== '') {
                answersObject[index.toString()] = answer;
            }
        });

        console.log("Sending MBTI answers to backend (time up):", answersObject);

        try {
            // Submit the test to backend with answers
            await submitTestMutation.mutateAsync({
                typeTest: "MBTI",
                answers: answersObject,
            });

            console.log("Test submitted successfully due to time up");

            resetTest()

            // Redirect to next test
            await redirectToNextTest({
                activeTes: 'MBTI',
                jenisTes: listTest,
            });
        } catch (error) {
            console.error("Error submitting test on time up:", error);

            // Tetap redirect meskipun submit gagal
            await redirectToNextTest({
                activeTes: 'MBTI',
                jenisTes: listTest,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitTestMutation, checkTest?.time, answers])

    const handleConfirmSubmit = async () => {
        const unanswered = getUnansweredQuestions()
        setShowConfirmDialog(false)

        if (unanswered.length > 0) {
            setCurrentQuestion(unanswered[0]!)
        } else {
            // Convert answers array to object format for backend
            const answersObject: Record<string, string> = {};
            answers.forEach((answer, index) => {
                if (answer !== '') {
                    answersObject[index.toString()] = answer;
                }
            });

            console.log("Sending MBTI answers to backend:", answersObject);

            // Submit the test to backend with answers
            submitTestMutation.mutate({
                typeTest: "MBTI",
                answers: answersObject,
            });

            resetTest()

            await redirectToNextTest({
                activeTes: 'MBTI',
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

        return (
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            {unanswered.length > 0 ? (
                                <>
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                    Ada Masalah dengan Jawaban
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Konfirmasi Tes MBTI
                                </>
                            )}
                        </AlertDialogTitle>

                        <AlertDialogDescription asChild>
                            <div className="text-start">
                                {unanswered.length > 0 ? (
                                    <div className="space-y-2">
                                        <div>
                                            Anda memiliki {unanswered.length} pertanyaan yang belum dijawab.
                                            Semua pertanyaan harus dijawab sebelum submit.
                                        </div>
                                        <div className="text-sm">
                                            Nomor pertanyaan: {unanswered.map(i => i + 1).join(", ")}
                                        </div>
                                    </div>
                                ) : (
                                    <span>
                                        Semua pertanyaan telah dijawab. Apakah Anda yakin ingin menyelesaikan tes ini?
                                    </span>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        {unanswered.length > 0 ? (
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
    if (!currentQuestionData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p>Question not found. Please refresh the page.</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Refresh
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl p-6">
                {/* Header with progress from Zustand - hanya render jika sudah initialized */}
                {isInitialized && (
                    <Header
                        timeLeft={timeLeft ?? 1800}
                        onTimeUp={handleTimeUp}
                        progress={getProgress()}
                        currentQuestion={currentQuestion}
                        totalQuestions={questions.length}
                        autoNext={autoNext}
                        onAutoNextChange={setAutoNext}
                        currentTest="MBTI"
                    />
                )}

                {/* Instructions */}
                <Card className="mb-6">
                    <CardContent>
                        <h3 className="font-semibold mb-2 text-lg">Petunjuk:</h3>
                        Pilihlah satu pernyataan dari setiap pertanyaan yang terbaik menggambarkan apa yang biasanya Anda rasakan atau lakukan. Tentukan pilihan Anda secara spontan!

                    </CardContent>
                </Card>

                {/* Question Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex justify-between">
                            <div className="text-nowrap">Soal {currentQuestion + 1}</div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                                    MBTI
                                </div>
                                <div className="self-center-safe text-sm">
                                    {currentQuestionData.bagian
                                        ? currentQuestionData.bagian.replace(/bagian(\d+)/i, "Bagian $1")
                                        : ""}
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {currentQuestionData.soal && (
                                <p className="text-lg font-medium">{currentQuestionData.soal}</p>
                            )}
                            {/* {currentQuestionData.bagian === "bagian2" && (<p className="text-lg font-medium">Soal bagian 2</p>)} */}
                            {currentQuestionData.soalA && currentQuestionData.soalB && currentQuestionData.bagian !== "bagian3" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-600">{currentQuestionData.soalA}</h4>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-600">{currentQuestionData.soalB}</h4>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleAnswerSelect('A')}
                                    className={`w-full p-6 text-left rounded-lg border-2 cursor-pointer transition-all duration-200 ${answers[currentQuestion] === 'A'
                                        ? "border-primary bg-primary/10 shadow-md"
                                        : "border-border hover:border-primary/50 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={
                                                !autoNext
                                                    ? `w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${answers[currentQuestion] === 'A'
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground"
                                                    }`
                                                    : ""
                                            }
                                        />
                                        <span className="text-lg">A. {currentQuestionData.jawabanA}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleAnswerSelect('B')}
                                    className={`w-full p-6 text-left rounded-lg border-2 cursor-pointer transition-all duration-200 ${answers[currentQuestion] === 'B'
                                        ? "border-primary bg-primary/10 shadow-md"
                                        : "border-border hover:border-primary/50 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={
                                                !autoNext
                                                    ? `w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${answers[currentQuestion] === 'B'
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground"
                                                    }`
                                                    : ""
                                            }
                                        />
                                        <span className="text-lg">B. {currentQuestionData.jawabanB}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
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
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-md cursor-pointer"
                        >
                            <LayoutList className="w-5 h-5" />
                            {showNavigator ? "Tutup Soal" : "Lihat Soal"}
                        </button>
                    </div>

                    {/* Navigator Soal */}
                    <div
                        className={`${showNavigator ? "flex" : "hidden"} justify-center gap-2 flex-wrap md:flex`}
                    >
                        {questions.map((_, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentQuestion(index)
                                }}
                                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${index === currentQuestion
                                    ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                    : answers[index] !== ""
                                        ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
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
                    </div>
                )} */}
            </div>
        </div>
    )
}