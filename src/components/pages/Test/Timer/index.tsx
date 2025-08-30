import React, { useMemo, useEffect, useRef, useCallback } from 'react'
import { Clock } from 'lucide-react'
import Countdown from 'react-countdown'
import './styles.css'

interface TimerProps {
    timeLeft: number
    onComplete: () => void
}

interface CountdownRendererProps {
    minutes: number
    seconds: number
    completed: boolean
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, onComplete }) => {
    const hasCompletedRef = useRef(false)
    const onCompleteRef = useRef(onComplete)

    // Update ref when callback changes to avoid stale closures
    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    // Memoize onComplete to prevent re-creation on every render
    const memoizedOnComplete = useCallback(() => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true
            onCompleteRef.current()
        }
    }, [])

    // Calculate targetTime only once when component mounts or when timeLeft changes significantly
    const targetTime = useMemo(() => {
        // Reset completion flag when timer is reset
        hasCompletedRef.current = false
        return Date.now() + (timeLeft * 1000)
    }, [timeLeft])

    // Handle completion in useEffect to avoid calling during render
    useEffect(() => {
        if (timeLeft <= 0 && !hasCompletedRef.current) {
            hasCompletedRef.current = true
            onCompleteRef.current()
        }
    }, [timeLeft])

    const renderer = ({ minutes, seconds, completed }: CountdownRendererProps) => {
        if (completed) {
            // Don't call onComplete here - it's handled in useEffect and onComplete callback
            return (
                <div className="flex items-center gap-1.5 bg-red-500 p-2 px-4 rounded-full">
                    <Clock className="h-8 w-8 text-white" />
                    <span
                        className="text-white inline-block text-center text-2xl font-bold"
                        style={{ width: "4ch" }}
                    >
                        00:00
                    </span>
                </div>
            )
        }

        const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        const isLowTime = (minutes * 60 + seconds) < 180 // Less than 3 minutes

        return (
            <div
                className={`flex items-center gap-1.5 ${isLowTime ? "bg-red-500 pulse-timer" : "bg-yellow-500"} p-2 px-4 rounded-full`}
            >
                <Clock className="h-8 w-8 text-white" />
                <span
                    className="text-white inline-block text-center text-2xl font-bold"
                    style={{ width: "4ch" }}
                >
                    {formattedTime}
                </span>
            </div>
        )

    }

    return (
        <Countdown
            key={targetTime} // Force new countdown when targetTime changes
            date={targetTime}
            renderer={renderer}
            onComplete={memoizedOnComplete}
        />
    )
}