import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest, response: NextResponse){
    
    const chartsPageURL = new URL('/chartsPage', request.url)

    //chartsPageURL.searchParams.set('from', request.nextUrl.pathname)
    console.log(chartsPageURL);
    
    return  NextResponse.redirect(chartsPageURL)
    
} 