"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Image from 'next/image';

export default function ExpiredLink() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
      {/* Logo di paling atas */}
      <div className="mb-0">
        <Image
          src="/images/logo-go-red.png"
          alt="Ganesha Operation Logo"
          width={160}
          height={45}
          className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[160px]"
        // sizes='(max-width: 160px)'
        />
      </div>

      {/* Konten utama */}
      <div className="w-full max-w-md p-8 text-center space-y-6">
        {/* Illustration */}
        <div className="flex justify-center">
          <div>
            <DotLottieReact
              className="w-[40dvw] sm:w-[44dvw] md:w-[46dvw] lg:w-[48dvw] max-w-[48dvw] min-w-[360px] h-auto"
              src="/animations/expired.lottie"
              autoplay
            />
          </div>
        </div>




        {/* Content */}
        <div className="max-w-md space-y-3 animate-fade-in-delayed relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Link Kadaluarsa
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Silakan hubungi pengawas ujian atau orang yang membagikan link.
          </p>
        </div>

        {/* Actions */}
        {/* <div className="space-y-3 pt-2">
          <Button className="w-full" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Contact Support
          </Button>
        </div> */}
      </div>
    </div>
  )
}
