"use client"

import React from 'react';
import { type ReactNode } from "react";
import UserInfo from '../pages/Start/UserInfo';

interface DecodedToken {
    participantId: string
    listTest: string
    fullName: string
    nik: string
    startTest: string
    iat: number
}

export default function Layout({ children, decodedToken }: { children: ReactNode, decodedToken: DecodedToken }) {
    return (
        <div className="flex">
            <div>
                <UserInfo decodedToken={decodedToken} />
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

