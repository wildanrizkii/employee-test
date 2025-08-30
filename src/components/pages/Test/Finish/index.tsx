"use client"

import React from 'react'
import Image from 'next/image'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import './styles.css'

export default function FinishTest() {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-dvh w-full text-center p-6 overflow-hidden">
            <div className="mb-0 animate-fade-in-opacity">
                <Image
                    src="/images/logo-go-red.png"
                    alt="Ganesha Operation Logo"
                    width={160}
                    height={45}
                    className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[160px]"
                />
            </div>

            <div className="w-64 h-64 md:w-80 md:h-80 animate-fade-in relative z-10">
                <DotLottieReact
                    src="/animations/finish.lottie"
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                />
            </div>

            <div className="max-w-md space-y-3 animate-fade-in-delayed relative z-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    Selamat!
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed">
                    Anda berhasil menyelesaikan tes ini.
                    <br />
                    Terima kasih sudah berpartisipasi, semoga hasilnya memuaskan ya!
                </p>
            </div>
        </div>
    )
}
