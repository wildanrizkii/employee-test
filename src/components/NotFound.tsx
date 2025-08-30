"use client"
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function NotFound() {
    return (
        <div className="flex min-h-dvh items-center justify-center">
            <DotLottieReact
                className="w-[40dvw] sm:w-[45dvw] md:w-[50dvw] lg:w-[50dvw] max-w-[50dvw] min-w-[360px] h-auto"
                src="/animations/404.lottie"
                loop
                autoplay
            />
        </div>


    )
}
