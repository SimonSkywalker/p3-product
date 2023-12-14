// pages/api/submitResponses.ts
import Form from '@/app/(admin)/classes/form/Form';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

// Extend the String interface to include a custom method for HTML encoding
declare global {
  interface String {
    encodeHTML(): string;
    decodeHTML(): string;
  }
}

type Response = {
  [tokenId: string]: {
    roles: {
      [index: string]: string[];
    };
    questions: {
      [index: string]: (string | number | string[]);
    };
  };
};

// Define a method on the String prototype to encode characters outside the basic ASCII range (a-zA-Z0-9) into HTML entities
// Reference: https://stackoverflow.com/a/1354489
String.prototype.encodeHTML = function (this: string) {
  return this.replace(/[^a-zA-Z0-9 ]/g, function (v) {
    return '&#' + v.charCodeAt(0) + ';';
  });
};

// Function for decoding the above encode-function
String.prototype.decodeHTML = function (this: string) {
  return this.replace(/&#(\d+);/g, function (match, code) {
    return String.fromCharCode(Number(code));
  });
};

const agreeDisagreeRanges = {
  9: [
    "Strongly Disagree",
    "Disagree",
    "Moderately Disagree",
    "Slightly Disagree",
    "Neutral",
    "Slightly Agree",
    "Moderately Agree",
    "Agree",
    "Strongly Agree"
  ],
  7: [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Disagree",
    "Neutral",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree"
  ],
  5: [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree"
  ],
  3: [
    "Disagree",
    "Neutral",
    "Agree"
  ]
};

// Define the default export for the API endpoint
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Extract userResponses and params from the request body
    const {userResponses, params} = await req.json();
    
    // Construct file paths for forms and responses
    const formsFilePath = `./src/app/(admin)/database/${params.user}/${(params.project).replace(/-/g," ")}/forms.json`;
    const responsesFilePath = `./src/app/(admin)/database/${params.user}/${(params.project).replace(/-/g," ")}/${params.form}/responses.json`;

    // Read and parse forms and responses files
    let formsFile = JSON.parse(fs.readFileSync(formsFilePath, "utf8"));

    let responsesFile = []
    try {
      responsesFile = JSON.parse(fs.readFileSync(responsesFilePath, "utf8"));
    } catch (error) {
      fs.writeFileSync(responsesFilePath, JSON.stringify([]));
    }
    
    // Find the form object based on the form name
    let formObject = formsFile.find((form: any) => form._name === params.form);

    // Update the token status to 'isUsed'
    if (formObject) {
      let tokensObject = formObject._tokens.find((token: any) => token._tokenID === params.tokenId);

      if (tokensObject) {
        tokensObject._isUsed = true;
      } else {
        // Errors should, in theory, not be displayed to the user
        console.error("Tokens object with not found with name:", params.tokenId);
      }
    } else {
      // Errors should, in theory, not be displayed to the user
      console.error("Form object not found.");
    }

    // Check if the object with the specified tokenId already exists
    const responseObject = responsesFile.find((obj: any) => obj[params.tokenId]);

    // Check if the object with the specified tokenId already exists
    if (!responseObject) {
      // If it doesn't exist, create the object and push it to responsesFile
      const newResponseObject: Response = {
        [params.tokenId]: {
          roles: {},
          questions: {},
        },
      };

      for (let index = 0; index < userResponses.length; index++) {
        // Clean and encode user responses
        if (typeof userResponses[index] === "string") {
          userResponses[index] = userResponses[index].trim();
          // userResponses[index] = userResponses[index].encodeHTML();
        } else if (Array.isArray(userResponses[index])) {
          userResponses[index] = userResponses[index].sort();
        }

        // Update roles and questions based on the form structure
        if (formObject._questions[index]._questionType === 0 && 
            formObject._questions[index]._saveRole === true &&
            userResponses[index][0] !== -1 &&
            userResponses[index].length !== 0) {
              newResponseObject[params.tokenId].roles[index] = userResponses[index].map((i: number) =>
              formObject._questions[index]._options[i]
            );
        }
        // Update questions based on the user response
        if (userResponses[index].length === 0 || (userResponses[index].length === 1 && userResponses[index][0] === -1)) { // If empty or skipped response
          newResponseObject[params.tokenId].questions[index] = -1;
        } else if (formObject._questions[index]._questionType === 0) { // Multiple Choice
          newResponseObject[params.tokenId].questions[index] = userResponses[index].map((i: number) =>
            formObject._questions[index]._options[i]
          )
        } else if (formObject._questions[index]._questionType === 1 && formObject._questions[index]._type === 0) { // Slider (AgreeDisagree)
          let rangeKey: keyof typeof agreeDisagreeRanges = formObject._questions[index]._range;
          newResponseObject[params.tokenId].questions[index] = [agreeDisagreeRanges[rangeKey][userResponses[index] - 1]]
        } else if (formObject._questions[index]._questionType === 1 && formObject._questions[index]._type === 1) { // Slider (values)
          newResponseObject[params.tokenId].questions[index] = [userResponses[index]]
        } else if (formObject._questions[index]._questionType === 2) { // Text Input
          newResponseObject[params.tokenId].questions[index] = userResponses[index]
        }
      }

      responsesFile.push(newResponseObject);

      // Save the updated responsesFile back to the file
      fs.writeFileSync(responsesFilePath, JSON.stringify(responsesFile, null, "\t"));
    } else {
      console.error(`Object with tokenId '${params.tokenId}' already exists in responsesFile.`);
    }

    // Save the updated forms and responses files
    fs.writeFileSync(formsFilePath, JSON.stringify(formsFile, null, "\t"));

    // Respond with a success message
    return NextResponse.json({ message: 'Responses submitted and saved successfully', status: 200});
  } catch (error) {
    // Errors should, in theory, not be displayed to the user
    // Handle and log errors, responding with a 500 status code
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error', status: 500});
  }
}