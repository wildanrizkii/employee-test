"use client"

import React from "react"
import { type JSX } from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { LayoutList, CheckCircle } from "lucide-react"
import { Header } from "../Header"
import { useTestContext } from "@/context/TestContext"
import UseRedirectToNextTest from "@/hooks/useRedirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

import soalTkd from "@/data/questions/tkd"
import Image from "next/image"
import { api } from "@/trpc/react"

import { useTKDStore } from "@/stores/tkdStores"
import {
    useTKDAutoSave,
    useTKDStateValidation,

    useTKDKeyboardNavigation,
    useTKDBeforeUnload,
    useTKDStoreMonitor,
    useTKDAutoSubmit,
    useTKDDataLoader,
    useTKDAnswerHelpers
} from "@/hooks/useTKDHooks"

interface Question {
    id: string | number
    jenis: string
    pertanyaan: string
    jawaban: string[]
    gambar?: string
    petunjuk?: string
}

type ImageErrors = Record<string, boolean>
type GroupedData = Record<string, Array<Question & { overallIndex: number }>>
type TestType = "MBTI" | "DISC" | "TKD" | "KETELITIAN";

export default function TKDTestRefactored(): JSX.Element {
    // Zustand store
    const {
        questions,
        answers,
        statusSoal,
        currentQuestion,
        autoNext,
        activeJenis,
        setAnswer,
        setCurrentQuestion,
        setAutoNext,
        setTestCompleted,
        setActiveJenis,
        toggleRaguRagu,
        nextQuestion,
        previousQuestion,
        getProgress,
        getUnansweredQuestions,
        resetTest
    } = useTKDStore();

    const { getAnswerText } = useTKDAnswerHelpers();

    // Local state for UI
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
    const [showNavigator, setShowNavigator] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [imageErrors, setImageErrors] = useState<ImageErrors>({})
    const router = useRouter()

    // Data dari props - dalam implementasi asli ini akan dari soalTkd import
    const questionsData = soalTkd as Question[];

    // Custom hooks
    useTKDDataLoader(questionsData);
    useTKDAutoSave();
    useTKDStateValidation();
    useTKDKeyboardNavigation();
    useTKDBeforeUnload();
    useTKDStoreMonitor(false); // Set to true for debugging

    const { checkTest } = useTestContext()
    const listTest: TestType[] = checkTest?.JenisTes
        ? checkTest.JenisTes.split(",").map(t => t.trim() as TestType)
        : [];

    const redirectToNextTest = UseRedirectToNextTest();

    // Group questions by jenis
    const groupedData: GroupedData = questions.reduce<GroupedData>((acc, question, index) => {
        const { jenis } = question
        if (!acc[jenis]) {
            acc[jenis] = []
        }
        acc[jenis].push({ ...question, overallIndex: index })
        return acc
    }, {})

    const jenisTes = Object.keys(groupedData)

    // Initialize active jenis when questions are loaded
    useEffect(() => {
        if (questions.length > 0 && !activeJenis && jenisTes.length > 0) {
            setActiveJenis(jenisTes[0] ?? '');
        }
    }, [questions.length, activeJenis, jenisTes, setActiveJenis]);

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

    const handleTimeUp = useCallback((): void => {
        const currentTime = Math.floor(Date.now() / 1000);
        const testStart = Number(checkTest?.time);
        const testDuration = 60 * 60;
        const actualTimeLeft = Math.max(testDuration - (currentTime - testStart), 0);

        if (actualTimeLeft > 0) {
            console.log("Time check failed, not submitting. Time left:", actualTimeLeft);
            return;
        }

        console.log("Time's up! Auto-submitting test...")

        // Auto-submit with current answers for TKD scoring
        submitTestMutation.mutate({
            typeTest: "TKD",
            answers: answers, // Send current answers for scoring
        });

        resetTest()

        void redirectToNextTest({
            activeTes: 'TKD',
            jenisTes: listTest,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitTestMutation, checkTest?.time, answers]); // Add answers to dependencies

    // Auto-submit hook
    useTKDAutoSubmit(timeLeft ?? 3600, handleTimeUp);

    useEffect(() => {
        const updateTime = async () => {
            try {
                const data = await updateTimeMutation.mutateAsync({ typeTest: "TKD" });
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

    // Get current question data safely
    const currentQuestionData = questions[currentQuestion]

    // Update active jenis based on current question
    useEffect(() => {
        if (currentQuestionData && currentQuestionData.jenis !== activeJenis) {
            setActiveJenis(currentQuestionData.jenis)
        }
    }, [currentQuestion, currentQuestionData, activeJenis, setActiveJenis])

    useEffect(() => {
        if (checkTest?.time === -1) {
            console.log(checkTest?.time)
            void redirectToNextTest({
                activeTes: 'TKD',
                jenisTes: listTest,
            })
        }

        const now = Math.floor(Date.now() / 1000);
        const start = Number(checkTest.time);
        const duration = 60 * 60; // 60 menit
        const remaining = Math.max(duration - (now - start), 0);

        // hanya set kalau > 0
        if (remaining > 0) {
            setTimeLeft(remaining);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Early return for missing question data
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

    // Handle answer selection - using Zustand store
    const handleAnswerSelect = (answer: string): void => {
        const questionId = questions[currentQuestion]?.id?.toString()
        if (!questionId) return

        // Use Zustand store method - this will automatically convert to label
        setAnswer(questionId, answer);

        // Auto next if enabled
        if (autoNext && currentQuestion < questions.length - 1) {
            setTimeout(() => {
                nextQuestion();
            }, 300)
        }
    }

    const handleNext = (): void => {
        if (currentQuestion < questions.length - 1) {
            nextQuestion();
        }
    }

    const handlePrevious = (): void => {
        if (currentQuestion > 0) {
            previousQuestion();
        }
    }

    // Handle ragu-ragu toggle - using Zustand store
    const handleRaguRaguToggle = (): void => {
        const questionId = questions[currentQuestion]?.id?.toString()
        if (!questionId) return

        toggleRaguRagu(questionId);
    }

    const handleSubmitTest = (): void => {
        setShowConfirmDialog(true)
    }

    const handleConfirmSubmit = (): void => {
        setShowConfirmDialog(false)

        // CHANGED: Always allow submission regardless of unanswered questions
        // Submit test with current answers (answered questions will be scored, unanswered will be marked as incorrect)
        submitTestMutation.mutate({
            typeTest: "TKD",
            answers: answers,
        });

        resetTest()

        setTestCompleted(true)
        void redirectToNextTest({
            activeTes: 'TKD',
            jenisTes: listTest,
        })
    }

    // Handle image loading error
    const handleImageError = (imageKey: string): void => {
        setImageErrors(prev => ({
            ...prev,
            [imageKey]: true
        }))
    }

    // Get image path for question
    const getImagePath = (gambar: string | undefined): string | null => {
        if (!gambar) return null
        return `/gambarsoal/${gambar}`
    }

    // Check if question is image-based (for Tes Gambar)
    const isImageQuestion = (questionData: Question | undefined): boolean => {
        if (!questionData) return false
        const pertanyaan = questionData.pertanyaan
        return questionData.jenis === 'Tes Gambar' ||
            (typeof pertanyaan === 'string' && (
                pertanyaan.endsWith('.svg') ||
                pertanyaan.endsWith('.png') ||
                pertanyaan.endsWith('.jpg') ||
                pertanyaan.endsWith('.jpeg')
            ))
    }

    // Check if answers are images
    const hasImageAnswers = (questionData: Question | undefined): boolean => {
        if (!questionData?.jawaban || questionData.jawaban.length === 0) return false

        return questionData.jawaban.some(
            (ans: string) => typeof ans === 'string' && (
                ans.endsWith('.svg') ||
                ans.endsWith('.png') ||
                ans.endsWith('.jpg') ||
                ans.endsWith('.jpeg')
            )
        )
    }

    // Render question image if exists
    const renderQuestionImage = (questionData: Question): JSX.Element | null => {
        // Jangan render gambar untuk id 51 - 55 karena tidak memiliki gambar pertanyaannya
        const questionId = Number(questionData.id)
        if (questionId >= 51 && questionId <= 55) {
            return null
        }

        if (questionData.gambar) {
            const imagePath = getImagePath(questionData.gambar)
            const hasError = imageErrors[`${questionData.id}_question_${questionData.gambar}`]

            if (hasError) {
                return (
                    <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <p className="text-red-600 text-sm">
                            Gambar tidak dapat dimuat{questionData.gambar}
                        </p>
                    </div>
                )
            }

            return (
                <div className="mb-4">
                    <Image
                        src={imagePath ?? '/fallback.png'}
                        alt={`Gambar soal ${currentQuestion + 1}`}
                        width={400}
                        height={200}
                        className="mx-auto h-auto mb-4 max-w-[90%] md:max-w-[300px]"
                        onError={() =>
                            handleImageError(`${questionData.id}_question_${questionData.gambar}`)
                        }
                        priority
                    />
                </div>
            )
        }

        // For image-based questions where pertanyaan is the image filename
        if (isImageQuestion(questionData)) {
            const imagePath = getImagePath(questionData.pertanyaan)
            const hasError = imageErrors[`${questionData.id}_question_${questionData.pertanyaan}`]

            if (hasError) {
                return (
                    <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <p className="text-red-600 text-sm">
                            Gambar tidak dapat dimuat: {questionData.pertanyaan}
                        </p>
                    </div>
                )
            }

            return (
                <div className="mb-4">
                    <Image
                        src={imagePath ?? '/fallback.png'}
                        alt={`Gambar soal ${currentQuestion + 1}`}
                        width={400}
                        height={200}
                        className="mx-auto h-auto mb-4 max-w-[90%] md:max-w-[400px] max-h-64 md:max-h-80"
                        onError={() =>
                            handleImageError(`${questionData.id}_question_${questionData.pertanyaan}`)
                        }
                        priority
                    />
                </div>
            )
        }

        return null
    }

    // UPDATED: Render answer option (text or image) 
    const renderAnswerOption = (jawaban: string, idx: number, questionId: string | number): JSX.Element => {
        const optionLabel = String.fromCharCode(65 + idx) // A, B, C, D, E

        // CHANGED: Use helper function to get the selected answer text
        const selectedAnswerText = getAnswerText(questionId.toString())
        const isSelected = selectedAnswerText === jawaban

        // If answer is an image file
        if (currentQuestionData && hasImageAnswers(currentQuestionData)) {
            const imagePath = getImagePath(jawaban)
            const hasError = imageErrors[`${questionId}_answer_${jawaban}`]

            return (
                <button
                    key={idx}
                    onClick={() => handleAnswerSelect(jawaban)}
                    className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50 hover:shadow-sm"
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 self-start">
                            {!autoNext && (
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground"
                                        }`}
                                />
                            )}
                            <span className="font-medium">{optionLabel}.</span>
                        </div>

                        {hasError ? (
                            <div className="p-2 border border-red-200 rounded bg-red-50 w-full">
                                <p className="text-red-600 text-xs text-center">
                                    Gambar tidak dapat dimuat: {jawaban}
                                </p>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center">
                                <Image
                                    src={imagePath ?? '/fallback.png'}
                                    alt={`Pilihan ${optionLabel}`}
                                    width={400}
                                    height={200}
                                    className="max-w-24 md:max-w-32 max-h-24 md:max-h-32"
                                    onError={() => handleImageError(`${questionId}_answer_${jawaban}`)}
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </button>
            )
        }

        // Regular text answer
        return (
            <button
                key={idx}
                onClick={() => handleAnswerSelect(jawaban)}
                className={`w-full p-6 text-left rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:shadow-sm"
                    }`}
            >
                <div className="flex items-start gap-4">
                    {!autoNext && (
                        <div
                            className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                                }`}
                        />
                    )}
                    <span className="text-lg">{optionLabel}. {jawaban}</span>
                </div>
            </button>
        )
    }

    const ConfirmDialog = (): JSX.Element => {
        const unanswered = getUnansweredQuestions()

        return (
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Konfirmasi Tes TKD
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

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl p-6">
                <Header
                    timeLeft={timeLeft ?? 3600}
                    onTimeUp={handleTimeUp}
                    progress={getProgress()}
                    currentQuestion={currentQuestion}
                    totalQuestions={questions.length}
                    autoNext={autoNext}
                    onAutoNextChange={setAutoNext}
                    currentTest="TKD"
                />

                {/* Jenis Test Tabs */}
                <Card className="mb-6">
                    <CardContent>
                        <div className="w-full">
                            <div className="font-bold pb-2">Jenis Tes</div>
                            <div className="flex flex-wrap gap-2">
                                {jenisTes.map((jenis) => (
                                    <Button
                                        key={jenis}
                                        variant={activeJenis === jenis ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            setActiveJenis(jenis)
                                            // Find first question of this type
                                            const firstQuestionOfType = questions.find((q) => q.jenis === jenis)
                                            if (firstQuestionOfType) {
                                                const index = questions.findIndex(
                                                    (q) => q.id === firstQuestionOfType.id
                                                )
                                                if (index !== -1) {
                                                    setCurrentQuestion(index)
                                                }
                                            }
                                        }}
                                        className="whitespace-nowrap shadow-sm cursor-pointer"
                                    >
                                        {jenis}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Card - with image support */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex justify-between">
                            <div className="text-nowrap">Soal {currentQuestion + 1}</div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                                    TKD
                                </div>
                                <div className="self-center-safe text-sm">
                                    {currentQuestionData?.jenis}
                                </div>
                            </div>
                        </CardTitle>
                        {currentQuestionData?.petunjuk && (
                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                <p className="text-md">
                                    <strong>Petunjuk:</strong>
                                    <br />
                                    {currentQuestionData.petunjuk}
                                </p>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {/* Render question image if exists */}
                            {renderQuestionImage(currentQuestionData)}

                            {/* Render question text only if it's not an image filename */}
                            {!isImageQuestion(currentQuestionData) && (
                                <p className="text-lg font-medium">{currentQuestionData?.pertanyaan}</p>
                            )}

                            <div className={`space-y-2 ${currentQuestionData && hasImageAnswers(currentQuestionData) ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : ''}`}>
                                {currentQuestionData?.jawaban.map((jawaban, idx) =>
                                    renderAnswerOption(jawaban, idx, currentQuestionData.id)
                                )}
                            </div>

                            {currentQuestionData && (
                                <div className="flex items-center space-x-2 pt-4 border-t">
                                    <Checkbox
                                        checked={statusSoal[currentQuestionData.id.toString()] === 'ragu-ragu'}
                                        onCheckedChange={handleRaguRaguToggle}
                                        id={`ragu-ragu-${currentQuestionData.id}`}
                                        className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                                    />
                                    <label
                                        htmlFor={`ragu-ragu-${currentQuestionData.id}`}
                                        className="text-sm font-medium"
                                    >
                                        {statusSoal[currentQuestionData.id.toString()] === 'ragu-ragu'
                                            ? 'Batalkan ragu-ragu?'
                                            : 'Tandai ragu-ragu?'
                                        }
                                    </label>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

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
                            >
                                Submit
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
                    <div className={`${showNavigator ? "flex" : "hidden"} justify-center gap-2 flex-wrap md:flex`}>
                        {questions.map((question, index) => {
                            const status = statusSoal[question.id.toString()] ?? 'belum dikerjakan'

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${index === currentQuestion
                                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                        : status === 'sudah dikerjakan'
                                            ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                                            : status === 'ragu-ragu'
                                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
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
            </div>
        </div>
    )
}