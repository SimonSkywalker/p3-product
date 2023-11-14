// pages/api/submitResponses.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const userResponses = req.body.userResponses;
      const params = req.body.params;
      
      const formsFilePath = `./src/app/database/${params.user}/${params.project}/forms.json`;
      const responsesFilePath = `./src/app/database/${params.user}/${params.project}/${params.form}/responses.json`;

      let formsFile = JSON.parse(fs.readFileSync(formsFilePath, "utf8"));
      let responsesFile = JSON.parse(fs.readFileSync(responsesFilePath, "utf8"));

      let formObject = formsFile.forms.find((form: { name: string }) => form.name === params.form);

      if (formObject) {
        let tokensObject = formObject.tokens.find((tokens: Record<string, { isUsed: boolean }>) =>
          tokens.hasOwnProperty(params.tokenId)
        );

        if (tokensObject) {
          // Set the isUsed property to true
          tokensObject.tokenId1.isUsed = true;
        } else {
          console.log("Tokens object with not found with name:", params.tokenId);
        }
      } else {
        console.log("Form object not found.");
      }


      responsesFile.forEach((userResponseObject: Record<string, any>) => {
        if (userResponseObject.hasOwnProperty(params.tokenId)) {
          let userResponse = userResponseObject[params.tokenId];
          // Tilføj noget til roles her: 
          userResponse["roles"] = {};
          userResponse["questions"] = {};
          for (let index = 0; index < userResponses.length; index++) {
            if (typeof userResponses[index] === "string") {
              userResponses[index] = userResponses[index].trim();
            } else if (Array.isArray(userResponses[index])) {
              userResponses[index] = userResponses[index].sort();
            }

            if (formObject["questions"][index]["questionType"] === 0 && 
                formObject["questions"][index]["saveRole"] === true &&
                userResponses[index][0] !== -1) {
              userResponse["roles"][index] = userResponses[index].map((i: number) => formObject["questions"][index]["options"][i]);
              console.log(userResponse["roles"]);
            }

            if (userResponses[index].length === 0) {
              userResponse["questions"][index] = -1;
            } else if (userResponses[index].length === 1) {
              userResponse["questions"][index] = userResponses[index][0];
            } else {
              userResponse["questions"][index] = userResponses[index];
            }
          }
        }
      });

      // Process and save the user responses on the server
      fs.writeFileSync(formsFilePath, JSON.stringify(formsFile, null, "\t"));
      fs.writeFileSync(responsesFilePath, JSON.stringify(responsesFile, null, "\t"));

      res.status(200).json({ message: 'Responses submitted and saved successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // 405: Method Not Allowed
  }
}
