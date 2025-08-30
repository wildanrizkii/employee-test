
'use client'

import { api } from "@/trpc/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TestContextProvider } from "@/context/TestContext"

export default function TestLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    const router = useRouter()
    const [isInitialized, setIsInitialized] = useState(false)

    // Extract test type from pathname
    const getTestTypeFromPath = (path?: string): "MBTI" | "DISC" | "TKD" | "KETELITIAN" | null => {
        if (!path) return null
        const segments = path.split('/')
        const testSegment = segments[segments.length - 1]?.toUpperCase()

        switch (testSegment) {
            case 'MBTI':
                return 'MBTI'
            case 'DISC':
                return 'DISC'
            case 'TKD':
                return 'TKD'
            case 'KETELITIAN':
                return 'KETELITIAN'
            case 'EXPIRED':
            case 'COMPLETED':
                return null
            default:
                return null
        }
    }


    const currentTestType = pathname ? getTestTypeFromPath(pathname) : null
    const isSpecialPage = pathname.includes('/test/expired') || pathname.includes('/finishtest') || pathname.includes('/test/break')

    // Get current test data - only if currentTestType is valid and not on special pages
    const { data: checkTest } = api.test.check.useQuery(
        { typeTest: currentTestType! },
        {
            enabled: currentTestType !== null && !isSpecialPage,
            staleTime: 1000 * 60 * 30,
            retry: false,
        }
    )

    const updateTimeMutation = api.test.updateTime.useMutation()


    useEffect(() => {
        if (isSpecialPage) return


        setIsInitialized(true)

    }, [checkTest, currentTestType, router, updateTimeMutation, isInitialized, isSpecialPage])

    if (isSpecialPage) {
        return <div>{children}</div>
    }

    if (!checkTest) return null;

    return (
        <TestContextProvider checkTest={{ ...checkTest, mbtiId: null, discId: null }}>
            {children}
        </TestContextProvider>
    )
}