"use client";

import React, { useCallback } from "react";
import { type JSX } from "react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LayoutList, CheckCircle } from "lucide-react"
import ketelitianJson from "@/data/questions/ketelitian.json"
import { Header } from "../Header";
import { useTestContext } from "@/context/TestContext"
import UseRedirectToNextTest from "@/hooks/useRedirect"

// Import Zustand store dan hooks (asumsi ada stores untuk Ketelitian)
import { useKetelitianStore } from "@/stores/ketelitianStores"
import {
    useAutoSave,
    useStateValidation,
    useDataRecovery,
    useKeyboardNavigation,
    useBeforeUnload
} from "@/hooks/useKETELITIANHooks"

type TestType = "MBTI" | "DISC" | "TKD" | "KETELITIAN";

export default function KetelitianTest(): JSX.Element {
    const router = useRouter()
    const [error, setError] = useState<string>("")
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
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
    } = useKetelitianStore()

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
                activeTes: 'KETELITIAN',
                jenisTes: listTest,
            })
        }

        const now = Math.floor(Date.now() / 1000);
        const start = Number(checkTest.time);
        const duration = 8 * 60; // 8 menit
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
                console.log("Loading Ketelitian data...")
                setQuestions(ketelitianJson)
                setTestStarted(true)
            } else {
                console.log("Ketelitian data loaded from store:", {
                    questionsCount: questions.length,
                    answeredCount: answers.filter(a => a !== '').length,
                    currentQuestion,
                    progress: getProgress()
                })

                // Recovery jika ada masalah data
                const recovered = recoverData(ketelitianJson)
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
                const data = await updateTimeMutation.mutateAsync({ typeTest: "KETELITIAN" });
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

    // Convert answers array to object format for backend
    const convertAnswersToObject = () => {
        const answersObject: Record<string, string> = {};
        answers.forEach((answer, index) => {
            answersObject[index.toString()] = answer || "";
        });
        return answersObject;
    };

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

    // Auto Submit when timer completes - HANYA jika sudah initialized dan waktu benar-benar habis
    const handleTimeUp = useCallback((): void => {
        // Tambahkan pengecekan ulang waktu untuk memastikan
        const currentTime = Math.floor(Date.now() / 1000);
        const testStart = Number(checkTest?.time);
        const testDuration = 8 * 60;
        const actualTimeLeft = Math.max(testDuration - (currentTime - testStart), 0);

        if (actualTimeLeft > 0) {
            console.log("Time check failed, not submitting. Time left:", actualTimeLeft);
            return;
        }

        console.log("Time's up! Auto-submitting test...")
        // Convert answers for submission
        const answersForSubmit = convertAnswersToObject();

        submitTestMutation.mutate({
            typeTest: "KETELITIAN",
            answers: answersForSubmit,
        });

        resetTest()

        void redirectToNextTest({
            activeTes: 'KETELITIAN',
            jenisTes: listTest,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitTestMutation, checkTest?.time, answers])

    const handleConfirmSubmit = async () => {
        setShowConfirmDialog(false)

        // Convert answers for backend submission
        const answersForSubmit = convertAnswersToObject();

        // Submit the test to backend with answers
        submitTestMutation.mutate({
            typeTest: "KETELITIAN",
            answers: answersForSubmit,
        });

        resetTest()

        await redirectToNextTest({
            activeTes: 'KETELITIAN',
            jenisTes: listTest,
        })

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
    const ConfirmDialog = (): JSX.Element => {
        const unanswered = getUnansweredQuestions()

        return (
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Konfirmasi Tes Ketelitian
                        </AlertDialogTitle>

                        <AlertDialogDescription asChild>
                            <div className="text-start">
                                <div className="space-y-2">
                                    <div>
                                        Apakah Anda yakin ingin menyelesaikan tes ini?
                                    </div>
                                    {unanswered.length > 0 && (
                                        <div className="text-sm text-amber-600">
                                            <strong>Perhatian:</strong> Anda memiliki {unanswered.length} pertanyaan yang belum dijawab.
                                            Soal yang tidak dijawab akan dianggap salah dalam penilaian.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSubmit}
                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        >
                            Submit Tes
                        </AlertDialogAction>
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
                        timeLeft={timeLeft ?? 480}
                        onTimeUp={handleTimeUp}
                        progress={getProgress()}
                        currentQuestion={currentQuestion}
                        totalQuestions={questions.length}
                        autoNext={autoNext}
                        onAutoNextChange={setAutoNext}
                        currentTest="KETELITIAN"
                    />
                )}

                {/* Question Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex justify-between">
                            <div className="text-nowrap">Soal {currentQuestion + 1}</div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                                    KETELITIAN
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <p className="text-lg font-medium mb-4">
                                Apakah kedua pernyataan ini sama atau berbeda?
                            </p>

                            <div className="bg-muted/50 p-6 rounded-lg">
                                <div className="flex flex-wrap items-center justify-center gap-4 text-2xl font-mono text-center">
                                    <span className="bg-white px-4 py-2 rounded border break-words max-w-full sm:max-w-xs">
                                        {currentQuestionData.pernyataan1}
                                    </span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="bg-white px-4 py-2 rounded border break-words max-w-full sm:max-w-xs">
                                        {currentQuestionData.pernyataan2}
                                    </span>
                                </div>
                            </div>


                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAnswerSelect('S')}
                                    className={`flex-1 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-center items-center gap-3 
      ${answers[currentQuestion] === 'S'
                                            ? "border-primary bg-primary/10 shadow-md"
                                            : "border-border hover:border-primary/50 hover:shadow-sm"
                                        }`}
                                >
                                    {!autoNext && (
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 
          ${answers[currentQuestion] === 'S'
                                                    ? "border-primary bg-primary"
                                                    : "border-muted-foreground"
                                                }`}
                                        />
                                    )}
                                    <span className="text-lg font-medium">SAMA</span>
                                </button>

                                <button
                                    onClick={() => handleAnswerSelect('T')}
                                    className={`flex-1 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-center items-center gap-3 
      ${answers[currentQuestion] === 'T'
                                            ? "border-primary bg-primary/10 shadow-md"
                                            : "border-border hover:border-primary/50 hover:shadow-sm"
                                        }`}
                                >
                                    {!autoNext && (
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 
          ${answers[currentQuestion] === 'T'
                                                    ? "border-primary bg-primary"
                                                    : "border-muted-foreground"
                                                }`}
                                        />
                                    )}
                                    <span className="text-lg font-medium">TIDAK SAMA</span>
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
            </div>
        </div>
    );
}