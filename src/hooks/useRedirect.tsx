'use client';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

interface RedirectProps {
    activeTes: string;
    jenisTes: string[];
    submit?: () => void;
}

const UseRedirectToNextTest = () => {
    const router = useRouter();
    const submitTest = api.test.submitTest.useMutation();

    const redirectToNextTest = async ({
        activeTes,
        jenisTes,
        submit
    }: RedirectProps) => {
        try {
            // Clean up jenisTes array to remove spaces
            const cleanedJenisTes = jenisTes.map((tes) => tes.trim().toUpperCase());
            console.log('Cleaned jenis tes:', cleanedJenisTes);
            console.log('Active tes:', activeTes);

            // Execute submit callback if provided
            if (submit) {
                submit();
            }

            // Submit test through tRPC - this will handle break time logic
            const result = await submitTest.mutateAsync({
                typeTest: activeTes.toUpperCase() as "MBTI" | "DISC" | "TKD" | "KETELITIAN"
            });

            console.log('Submit result:', result);

            // Handle redirection based on tRPC response
            switch (result.nextAction) {
                case "FINISH":
                    console.log('Test completed - redirecting to finish');
                    router.push('/finishtest');
                    break;

                case "BREAK":
                    console.log('Break time started - redirecting to break page');
                    router.push('/test/break');
                    break;

                case "NEXT_TEST":
                    // This shouldn't happen normally, but handle as fallback
                    console.log('Direct next test - finding next available test');
                    const currentIndex = cleanedJenisTes.indexOf(activeTes.toUpperCase());

                    if (currentIndex !== -1 && currentIndex < cleanedJenisTes.length - 1) {
                        const nextTes = cleanedJenisTes[currentIndex + 1]!.toLowerCase();
                        console.log('Redirecting to next test:', nextTes);
                        router.push(`/test/${nextTes}`);
                    } else {
                        console.log('No next test available - redirecting to finish');
                        router.push('/finishtest');
                    }
                    break;

                default:
                    console.log('Unknown next action - redirecting to finish');
                    router.push('/finishtest');
                    break;
            }

        } catch (error) {
            console.error('Error in redirectToNextTest:', error);

            // Fallback logic if tRPC fails
            const cleanedJenisTes = jenisTes.map((tes) => tes.trim().toUpperCase());
            const currentIndex = cleanedJenisTes.indexOf(activeTes.toUpperCase());

            // Check if this is the last test or only one test
            if (cleanedJenisTes.length === 1 || currentIndex === cleanedJenisTes.length - 1) {
                console.log('Fallback: Last test or single test - redirecting to finish');
                router.push('/finishtest');
            } else if (currentIndex !== -1 && currentIndex < cleanedJenisTes.length - 1) {
                // Go to next test
                const nextTes = cleanedJenisTes[currentIndex + 1]!.toLowerCase();
                console.log('Fallback: Redirecting to next test:', nextTes);
                router.push(`/test/${nextTes}`);
            } else {
                console.log('Fallback: Unknown state - redirecting to finish');
                router.push('/finishtest');
            }
        }
    };

    return redirectToNextTest;
};

export default UseRedirectToNextTest;