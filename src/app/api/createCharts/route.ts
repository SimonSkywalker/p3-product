import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { useSearchParams } from 'next/navigation';

export async function GET(request: NextRequest, response: NextResponse){
    
    const chartsPageURL = new URL('/chartsPage', request.url)
    
    const { searchParams } = new URL(request.url)

    for (const [key, value] of searchParams.entries() as any) {
        chartsPageURL.searchParams.append(key, value)
    }
   

    return  NextResponse.redirect(chartsPageURL);
    
} 