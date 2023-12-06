import { NextRequest, NextResponse } from "next/server";
import { redirect, usePathname } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { cookies } from "next/headers";
interface ChartParams {
    params: {
      user: string;
      project: string;
    }
  }

export async function GET(request: NextRequest, response: NextResponse){

    const user = cookies().get('userID')?.value;
    const project = cookies().get('projectName')?.value;

    const chartsPageURL = new URL(`/${user}/${project}/chartsPage`, request.url)
    
    const { searchParams } = new URL(request.url)

    for (const [key, value] of searchParams.entries() as any) {
        chartsPageURL.searchParams.append(key, value)
    }
    console.log(chartsPageURL);

    return  NextResponse.redirect(chartsPageURL);
    
} 