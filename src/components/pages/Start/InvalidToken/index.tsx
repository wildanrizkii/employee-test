"use client"

import { Button } from '@/components/ui/button'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Link from 'next/link'
import React from 'react'

export default function InvalidToken() {
    return (
        <div className="min-h-dvh bg-background flex flex-col items-center justify-center text-center p-4 px-6">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 animate-fade-in relative z-10 mb-4">
                <DotLottieReact
                    src="/animations/invalid.lottie"
                    autoplay
                    loop
                    style={{ width: "100%", height: "100%" }}
                />
            </div>

            <div className="animate-fade-in-delayed max-w-sm sm:max-w-md">
                <h1 className="text-xl sm:text-2xl font-bold mb-3">Token Tidak Valid</h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 animate-fade-in-opacity leading-relaxed">
                    Token yang Anda gunakan tidak valid atau sudah kadaluarsa.
                    Silakan periksa kembali link yang Anda gunakan atau hubungi pengawas ujian/orang yang membagikan link.
                </p>

                <Button asChild className="h-11 sm:h-12 px-4 sm:px-6 w-full sm:w-auto animate-fade-in-opacity text-sm sm:text-base">
                    <Link href="https://ganeshaoperation.com/">Kembali ke Halaman Utama</Link>
                </Button>
            </div>
        </div>
    )
}
