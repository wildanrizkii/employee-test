"use client"

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function Loading() {
    return (
        <div className="min-h-dvh flex items-center justify-center">
            <div className="text-center space-y-8 max-w-md w-full">
                <DotLottieReact
                    src="/animations/loading.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>

    )
}
