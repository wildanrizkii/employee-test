import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Timer } from "../Timer"
import { UserAvatar } from "./UserAvatar"

interface HeaderProps {
    timeLeft: number
    onTimeUp: () => void
    progress: number
    currentQuestion: number
    totalQuestions: number
    autoNext: boolean
    onAutoNextChange: (checked: boolean) => void
    currentTest: string
}

interface UserData {
    fullName?: string
    nik?: string
    [key: string]: string | number | null | undefined
}

// Memoize Timer wrapper to prevent unnecessary re-renders
const MemoizedTimerWrapper = memo(({ timeLeft, onTimeUp }: { timeLeft: number, onTimeUp: () => void }) => (
    <Timer timeLeft={timeLeft} onComplete={onTimeUp} />
))

MemoizedTimerWrapper.displayName = 'MemoizedTimerWrapper'

export const Header: React.FC<HeaderProps> = memo(({
    timeLeft,
    onTimeUp,
    progress,
    currentQuestion,
    totalQuestions,
    autoNext,
    onAutoNextChange,
    currentTest
}) => {
    const [userData, setUserData] = useState<UserData>({})
    const [isScrolled, setIsScrolled] = useState(false)

    // Memoize scroll handler to prevent re-creation
    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY > 0
        setIsScrolled(prev => prev !== scrolled ? scrolled : prev)
    }, [])

    useEffect(() => {
        // Get userData from localStorage
        const storedUserData = localStorage.getItem('userData')

        if (storedUserData) {
            try {
                const parsed = JSON.parse(storedUserData) as UserData
                setUserData(parsed)
            } catch (error) {
                console.error('Error parsing userData from localStorage:', error)
                // Fallback data if parsing fails
                setUserData({ fullName: "User", nik: "N/A" })
            }
        } else {
            // Default fallback if no userData in localStorage
            setUserData({ fullName: "User", nik: "N/A" })
        }
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    // Memoize progress text to prevent unnecessary calculations
    const progressText = useMemo(() => Math.round(progress), [progress])

    // Memoize user name and nik
    const { displayName, displayNik } = useMemo(() => ({
        displayName: userData.fullName ?? "User",
        displayNik: userData.nik ?? "N/A"
    }), [userData.fullName, userData.nik])

    return (
        <>
            {/* Sticky Header */}
            <div
                className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md pb-4 transition-all ${isScrolled ? "pt-4" : "pt-0"
                    }`}
            >
                <div className="space-y-4">
                    <div className="flex flex-col md:grid md:grid-cols-3 md:items-center">
                        {/* Left: Timer on mobile, Logo on desktop */}
                        <div className="flex justify-between md:justify-start items-center">
                            {/* Timer tampil di mobile (menggantikan logo) */}
                            <div className="md:hidden">
                                <MemoizedTimerWrapper timeLeft={timeLeft} onTimeUp={onTimeUp} />
                            </div>

                            {/* Logo tampil di desktop */}
                            <div className="hidden md:flex flex-shrink-0">
                                <Image
                                    src={'/images/logo-go-red.png'}
                                    alt={'Logo Ganesha Operation'}
                                    width={140}
                                    height={40}
                                    priority
                                    className="w-[140px] h-auto"
                                />
                            </div>

                            {/* Avatar di kanan kalau mobile */}
                            <div className="md:hidden">
                                <UserAvatar
                                    name={displayName}
                                    nik={displayNik}
                                />
                            </div>
                        </div>

                        {/* Middle: Timer (hanya tampil di desktop) */}
                        <div className="hidden md:flex justify-center">
                            <MemoizedTimerWrapper timeLeft={timeLeft} onTimeUp={onTimeUp} />
                        </div>

                        {/* Right: Avatar (hanya tampil di desktop) */}
                        <div className="hidden md:flex justify-end">
                            <UserAvatar
                                name={displayName}
                                nik={displayNik}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progres: {progressText}% selesai</span>
                            <span>Soal {currentQuestion + 1} dari {totalQuestions}</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>
                </div>
            </div>

            {currentTest === "MBTI" || currentTest === "KETELITIAN" && (
                <div className="flex justify-between items-center gap-2 mb-6">
                    <span className="text-sm text-muted-foreground">
                        Secara otomatis melanjutkan ke pertanyaan berikutnya setelah memilih jawaban
                    </span>
                    <Switch
                        className="w-14 h-8 [&>span]:w-6 [&>span]:h-6 
            [&>span]:data-[state=checked]:translate-x-6.5
            [&>span]:data-[state=unchecked]:translate-x-1"
                        checked={autoNext}
                        onCheckedChange={onAutoNextChange}
                    />
                </div>
            )}
        </>
    )
})

Header.displayName = 'Header'