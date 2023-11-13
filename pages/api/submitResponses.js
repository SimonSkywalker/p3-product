// pages/api/submitResponses.js

import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const userResponses = req.body.userResponses;
      const params = req.body.params;
      
      const responsesFilePath = './src/app/database/' + params.user + '/' + params.project + '/' + params.form + '/responses.json';

      let responsesFile = JSON.parse(fs.readFileSync(responsesFilePath, "utf8"));

      responsesFile.forEach((userResponseObject) => {
        if (userResponseObject.hasOwnProperty(params.tokenId)) {
          let userResponse = userResponseObject[params.tokenId];
          // Tilføj noget til roles her: 
          //userResponse["roles"] = [];
          userResponse["questions"] = {};
          for (let index = 0; index < userResponses.length; index++) {
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

      console.log(responsesFile[1]["tokenId1"]);

      // Process and save the user responses on the server
      // You can use any backend logic to save the responses to a file, database, or perform other actions
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
