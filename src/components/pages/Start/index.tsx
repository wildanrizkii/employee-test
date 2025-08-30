"use client"

import React, { startTransition, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Target, BrainCircuit, Puzzle, Clock } from "lucide-react"
import { decode } from "jsonwebtoken"
import UserInfo from "./UserInfo"
import Image from "next/image"
import { setToken } from "@/server/actions"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import './styles.css'

interface DecodedToken {
  participantId: string
  listTest: string
  fullName: string
  nik: string
  startTest: string
  iat: number
}

interface StartPageProps {
  token: string
}

const testConfig = {
  MBTI: {
    icon: Brain,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    name: "MBTI",
    duration: "30 menit",
    description: "Tipe kepribadian",
    questions: "100 soal",
  },
  DISC: {
    icon: BrainCircuit,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    name: "DISC",
    duration: "30 menit",
    description: "Perilaku menghadapi situasi tertentu",
    questions: "24 soal",
  },
  TKD: {
    icon: Puzzle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    name: "TKD",
    duration: "60 menit",
    description: "Pengetahuan dasar",
    questions: "60 soal",
  },
  KETELITIAN: {
    icon: Target,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    name: "Ketelitian",
    duration: "8 menit",
    description: "Ketelitian dan konsentrasi",
    questions: "100 soal",
  },
}

export default function StartPage({ token }: StartPageProps) {
  const dataUser = decode(token) as DecodedToken ?? null

  const availableTests = dataUser?.listTest
    ? dataUser.listTest.split(",").map((test) => test.trim().toUpperCase())
    : []

  const allTests = availableTests
    .map((key) => testConfig[key as keyof typeof testConfig])
    .filter(Boolean)

  const totalDuration = allTests.reduce((total, test) => {
    const minutes = parseInt(test.duration.split(" ")[0])
    return total + minutes
  }, 0)

  useEffect(() => {
    function handleTokenSetting() {
      startTransition(async () => {
        await setToken(token)
      })
    }
    handleTokenSetting()
  }, [token])

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(dataUser))
  }, [dataUser])

  const displayTests = allTests

  if (!dataUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4 px-6">
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

  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="text-center">
          <div className="mb-8">
            <Image
              className="mx-auto"
              src={'/images/logo-go-red.png'}
              alt={'Logo Ganesha Operation'}
              width={120}
              height={40}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <div className="mb-4">
            <UserInfo decodedToken={dataUser} />
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              Ringkasan Tes
            </h2>
            <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              Total: {totalDuration} menit
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Anda akan mengikuti {displayTests.length} jenis tes dengan estimasi waktu total {totalDuration} menit.
            Pastikan koneksi internet stabil dan siapkan waktu yang cukup.
          </p>
        </div>

        <div className="space-y-2 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jenis Tes yang Akan Anda Ikuti:</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayTests.map((test, index) => {
              const IconComponent = test.icon
              return (
                <div
                  key={index}
                  className={`${test.bgColor} ${test.borderColor} border-2 border-dashed rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${test.color} ${test.bgColor} p-3 rounded-xl shadow-sm`}>
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{test.name}</h4>
                        <span className={`${test.color} text-xs font-medium px-2 py-1 rounded-full bg-white/80`}>
                          {test.duration}
                        </span>
                      </div>

                      <p className="text-gray-700 text-md leading-relaxed">{test.description}</p>

                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <span className="flex items-center gap-1">
                          <Puzzle className="w-3 h-3" />
                          {test.questions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 mb-8">
          <h3 className="font-semibold text-amber-900 mb-3 text-base sm:text-lg">Petunjuk Penting:</h3>
          <ul className="space-y-2 text-sm sm:text-base text-amber-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              Pastikan koneksi internet Anda stabil selama tes berlangsung
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              Jawab semua pertanyaan dengan jujur dan sesuai kondisi Anda
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              Hindari menutup atau refresh halaman saat tes berlangsung
            </li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Klik tombol di bawah ini ketika Anda sudah siap untuk memulai tes
          </p>

          <Button asChild className="w-full sm:w-auto sm:min-w-64 h-12 sm:h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <Link href={`/test/mbti`}>
              Mulai Tes Sekarang
            </Link>
          </Button>

          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            Dengan menekan tombol di atas, Anda menyatakan bersedia mengikuti seluruh rangkaian tes
          </p>
        </div>
      </div>
    </div>
  )
}