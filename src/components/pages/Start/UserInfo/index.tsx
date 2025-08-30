/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import React, { useEffect, useState } from "react"
import { User, Calendar, FileText, Hash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DecodedToken {
    participantId: string
    listTest: string
    fullName: string
    nik: string
    startTest: string
    iat: number
}

interface UserInfoProps {
    decodedToken: DecodedToken
}

export default function UserInfo({ decodedToken }: UserInfoProps) {
    const [formattedDate, setFormattedDate] = useState("")

    useEffect(() => {
        if (decodedToken?.startTest) {
            const date = new Date(decodedToken.startTest)

            const hari = date.toLocaleDateString("id-ID", { weekday: "long" })
            const tanggalBulanTahun = date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            const jam = date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta"
            })

            setFormattedDate(`${hari}, ${tanggalBulanTahun} Pukul ${jam} WIB`)
        }
    }, [decodedToken?.startTest])

    if (!decodedToken) return null

    return (
        <div className="">
            <div className="flex flex-col items-center text-center justify-center gap-3 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Selamat datang di Tes Kepegawaian Ganesha Operation
                </h1>

                <div className="text-lg">
                    Halo <span className="font-bold text-primary">{decodedToken.fullName}</span>, berikut adalah informasi pribadi Anda beserta tes yang akan dilaksanakan.
                </div>

            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Lengkap */}
                <InfoItem
                    icon={<User className="h-4 w-4 text-gray-500" />}
                    label="Nama Lengkap"
                    value={decodedToken.fullName}
                />

                {/* NIK */}
                <InfoItem
                    icon={<Hash className="h-4 w-4 text-gray-500" />}
                    label="NIK"
                    value={decodedToken.nik}
                />

                {/* Jenis Tes */}
                <InfoItem
                    icon={<FileText className="h-4 w-4 text-gray-500" />}
                    label="Jenis Tes"
                    value={
                        <div className="flex flex-wrap gap-1 mt-2">
                            {decodedToken.listTest.split(",").map((test, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full"
                                >
                                    {test.trim()}
                                </span>
                            ))}
                        </div>
                    }
                />

                {/* Waktu Mulai */}
                <InfoItem
                    icon={<Calendar className="h-4 w-4 text-gray-500" />}
                    label="Waktu Mulai"
                    value={formattedDate}
                />
            </div>

            {/* Card Footer */}
            <div className="px-2 py-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID Peserta: {decodedToken.participantId}</span>
                    <span>Sesi terverifikasi ✓</span>
                </div>
            </div>
        </div>
    )
}

interface InfoItemProps {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
}

function InfoItem({ icon, label, value }: InfoItemProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-1">
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            </div>
            <div className="text-base text-start font-semibold text-gray-900 dark:text-gray-100 break-words">
                {value ? value : (<Skeleton className="h-[24px] w-3/4 rounded-2xl" />)}
            </div>
        </div>
    )
}
