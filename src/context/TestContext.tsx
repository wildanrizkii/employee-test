"use client"

import { createContext, useContext } from "react"
import { type JsonValue } from "@prisma/client/runtime/library"

// Type ini perlu disimpan di types agar rapi, kalau ada yang liat ini belum di fix tolong difix ya soalnya kalau belum berarti LUPA HUEHEHEE, punteunnn :)

type MBTIResult = {
    id: string
    bagian1: string | null
    bagian2: string | null
    bagian3: string | null
    tipe: string | null
    deskripsi: JsonValue
    createdAt: Date
    updatedAt: Date
} | null

type DISCResult = {
    id: string
    NP: JsonValue
    NK: JsonValue
    Delta: JsonValue
    Score: JsonValue
    JawabanNP: string
    JawabanNK: string
    createdAt: Date
    updatedAt: Date
} | null


type ParticipantTestData = {
    time: number
    timeJeda: number
    diffJeda: number
    diffmin: number
    status: string

    NamaLengkap: string
    TanggalLahir: Date | null
    JenisTes: string | null
    ProyeksiPenempatan: string | null
    Penempatan: string
    PelaksanaanTes: Date | null
    IsActive: boolean

    tkd: number
    ketelitian: number
    mbti: MBTIResult | null
    disc: DISCResult | null

    mbtiId: string | null
    discId: string | null
}

type TestContextType = {
    checkTest: ParticipantTestData
}

const TestContext = createContext<TestContextType | undefined>(undefined)

export function TestContextProvider({
    checkTest,
    children,
}: {
    checkTest: ParticipantTestData
    children: React.ReactNode
}) {
    return (
        <TestContext.Provider value={{ checkTest }}>
            {children}
        </TestContext.Provider>
    )
}

export function useTestContext() {
    const context = useContext(TestContext)
    if (!context) throw new Error("useTestContext must be used inside TestContextProvider")
    return context
}
