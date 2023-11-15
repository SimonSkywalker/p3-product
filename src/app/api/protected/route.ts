'use server'
const jwt = require("jsonwebtoken");
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Route used to check if the user has a valid token
 * to access the site where the route is called
 */
export async function GET() {
    try {
        //Constants used to collect header information
        const headersInstance = headers();
        const authHeader = headersInstance.get("authorization");

        //if authHeader is empty, return response with error message and status
        if (!authHeader) {
          return NextResponse.json(
            { message: "Authorization header missing" },
            {
              status: 401, // 401 indicates unauthorized
            }
          );
        }

    //Selects token from header and decodes it
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //if token is invalid, it returns an error
    if (!decoded) {
      return NextResponse.json(
        { message: "Expired" },
        {
          status: 400,
        }
      );
    } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: "Expired" },
        {
          status: 400,
        }
      );
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json(
        { data: "Protected data" },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Token verification failed", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 400,
      }
    );
  }
}