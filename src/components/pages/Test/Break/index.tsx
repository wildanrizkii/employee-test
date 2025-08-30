"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { api } from "@/trpc/react"

interface BreakPageProps {
    onSkip?: () => void
    onComplete?: () => void
}

export default function BreakPage({ onSkip, onComplete }: BreakPageProps) {
    const { data: participant, isLoading, error, refetch } = api.test.getCurrentParticipant.useQuery()
    const resetBreak = api.test.resetBreakTime.useMutation()

    const [timeLeft, setTimeLeft] = useState(0)
    const [shouldComplete, setShouldComplete] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Calculate time left based on participant data
    useEffect(() => {
        if (participant?.jeda_waktu) {
            const currentTime = Math.floor(Date.now() / 1000)
            const remaining = Math.max(participant.jeda_waktu - currentTime, 0)
            setTimeLeft(remaining)

            // If time is already up, complete immediately
            if (remaining <= 0) {
                setShouldComplete(true)
            }
        }
    }, [participant])

    // Function to handle break completion
    const handleCompleteBreak = async () => {
        try {
            // Reset break time di database
            await resetBreak.mutateAsync()
            console.log("Break time reset successfully")

            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            // Refresh participant data to get updated state
            await refetch()

            // Call onComplete callback or navigate
            if (onComplete) {
                onComplete()
            } else {
                // Default behavior: refresh the page to let middleware handle redirection
                window.location.reload()
            }
        } catch (error) {
            console.error("Error completing break:", error)
            // Fallback: refresh page to let middleware handle
            window.location.reload()
        }
    }

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // Handle completion when shouldComplete is true
    useEffect(() => {
        const run = async () => {
            if (shouldComplete) {
                await handleCompleteBreak()
            }
        }
        void run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldComplete])

    // Timer effect
    useEffect(() => {
        if (!participant?.jeda_waktu || timeLeft <= 0 || shouldComplete) return

        intervalRef.current = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000)
            const remaining = Math.max(participant.jeda_waktu - currentTime, 0)

            setTimeLeft(remaining)

            // Trigger completion when time is up
            if (remaining <= 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
                setShouldComplete(true)
            }
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [participant, timeLeft, shouldComplete])

    const handleSkip = async () => {
        try {
            // Reset break time di database
            await resetBreak.mutateAsync()
            console.log("Break skipped successfully")

            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            // Refresh participant data
            await refetch()

            // Call onSkip callback or navigate
            if (onSkip) {
                onSkip()
            } else {
                // Default behavior: refresh the page to let middleware handle redirection
                window.location.reload()
            }
        } catch (error) {
            console.error("Error skipping break:", error)
            // Fallback: refresh page to let middleware handle
            window.location.reload()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !participant) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <p className="text-destructive">Terjadi kesalahan saat memuat data</p>
                    <Button onClick={() => refetch()}>Coba Lagi</Button>
                </div>
            </div>
        )
    }

    // If not in break time, redirect
    const currentTime = Math.floor(Date.now() / 1000)
    if (participant.jeda_waktu <= currentTime) {
        // Let middleware handle the redirection
        window.location.reload()
        return null
    }

    const breakDuration = 3 * 60 // 3 minutes in seconds (you can make this configurable)
    const progressPercentage = ((breakDuration - timeLeft) / breakDuration) * 100

    return (
        <div className="min-h-dvh flex items-center justify-center bg-background p-6">
            <div className="text-center space-y-8 max-w-md w-full">
                {/* Animasi istirahat */}
                <div>
                    <DotLottieReact
                        src="/animations/break.lottie"
                        loop
                        autoplay
                    />
                </div>

                {/* Pesan istirahat */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-foreground">Waktu Istirahat</h1>
                    <p className="text-muted-foreground">
                        Silakan beristirahat sejenak sebelum melanjutkan ke tes berikutnya
                    </p>
                </div>

                {/* Tampilan timer */}
                <div className="space-y-4">
                    <div className="text-6xl font-bold text-foreground tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className="bg-primary h-3 rounded-full transition-all duration-1000 ease-linear"
                            style={{
                                width: `${Math.min(progressPercentage, 100)}%`,
                                transition: 'width 1s linear'
                            }}
                        />
                    </div>
                </div>

                {/* Tombol lewati */}
                <Button
                    onClick={handleSkip}
                    variant="link"
                    className="cursor-pointer"
                    disabled={timeLeft <= 0 || resetBreak.isPending}
                >
                    {resetBreak.isPending ? "Memproses..." : "Lewati Istirahat & Lanjutkan"}
                </Button>
            </div>
        </div>
    )
}