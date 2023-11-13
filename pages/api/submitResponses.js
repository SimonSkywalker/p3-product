// pages/api/submitResponses.js

import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const userResponses = req.body.userResponses;
      const params = req.body.params;
      
      const formsFilePath = './src/app/database/' + params.user + '/' + params.project + '/forms.json';
      const responsesFilePath = './src/app/database/' + params.user + '/' + params.project + '/' + params.form + '/responses.json';

      let formsFile = JSON.parse(fs.readFileSync(formsFilePath, "utf8"));
      let responsesFile = JSON.parse(fs.readFileSync(responsesFilePath, "utf8"));

      //console.log(formsFile.forms);

      let formObject = formsFile.forms.find((form) => form.name === params.form);

      if (formObject) {
        // You've found the form object with the desired name
        console.log("Found form object:", formObject);

        // Now, let's find the tokens object with name "tokenId1"
        let tokensObject = formObject.tokens.find((tokens) => tokens.hasOwnProperty(params.tokenId));

        if (tokensObject) {
          // You've found the tokens object with name "tokenId1"
          console.log("Found tokens object:", tokensObject);

          // Set the isUsed property to 1
          tokensObject.tokenId1.isUsed = 1;

          console.log("Updated tokens object:", tokensObject);
        } else {
          console.log("Tokens object with not found with name:", params.tokenId);
        }
      } else {
        console.log("Form object not found.");
      }


      responsesFile.forEach((userResponseObject) => {
        if (userResponseObject.hasOwnProperty(params.tokenId)) {
          let userResponse = userResponseObject[params.tokenId];
          // Tilføj noget til roles her: 
          //userResponse["roles"] = [];
          userResponse["questions"] = {};
          for (let index = 0; index < userResponses.length; index++) {
            if (typeof userResponses[index] === "string") {
              userResponses[index] = userResponses[index].trim();
            }

            if (userResponses[index].length === 0) {
              userResponse["questions"][index] = -1;
            } else if (userResponses[index].length === 1) {
              userResponse["questions"][index] = userResponses[index][0];
            } else {
              userResponse["questions"][index] = userResponses[index];
            }
          }
          //console.log(userResponse);
        }
      });

      //console.log(responsesFile[1]["tokenId1"]);

      // Process and save the user responses on the server
      // You can use any backend logic to save the responses to a file, database, or perform other actions
      fs.writeFileSync(formsFilePath, JSON.stringify(formsFile, null, "\t"));
      fs.writeFileSync(responsesFilePath, JSON.stringify(responsesFile, null, "\t"));

      res.status(200).json({ message: 'Responses submitted and saved successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
