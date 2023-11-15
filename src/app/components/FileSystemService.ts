import FileTypes from "./FileTypes";

export default class FileSystemService {
    public static async listFiles(directoryPath: string): Promise<string[]> {
        try {
            let data : string[] = [];
            await fetch('/api/files', {
                method: 'POST',
                body: JSON.stringify({path: directoryPath})
              })
                .then(async response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  data = await response.json();
                })
                .then(data => {
                  // console.log(data); // Handle the response data here
                })
                .catch(error => {
                  console.error('There has been a problem with your fetch operation:', error);
                });
            return data;
        } catch (error : any) {
            throw new Error('Failed to fetch files: ' + error.message);
        }
    }

    public static async getType(currentPath : string) : Promise<FileTypes> {
        let fileType :FileTypes = FileTypes.other;
         await fetch('/api/fileType', {
            method: 'POST',
            body: JSON.stringify({path: currentPath})
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              // console.log("data " + data.fileType); // Handle the response data here
              fileType = data.fileType;
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
        return fileType;
    }

    public static async writeToJSONFile(data : Array<Object>, filePath : string) {
            await fetch('/api/writeToFile', {
                method: 'POST',
                body: JSON.stringify({data: data, path : filePath})
              })
                .then(async response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  
                  return response.json();
                })
                .then((data) => {
                   //console.log("data " + data); // Handle the response data here
                })
                .catch(error => {
                  console.error('There has been a problem with your fetch operation:', error);
                });
    }

    public static async getJSONFile(filePath : string) : Promise<Array<Object>> {
        let jsonArray : Array<Object> = [];
        if(await this.getType(filePath) == FileTypes.JSON){
            await fetch('/api/readFile', {
                method: 'POST',
                body: JSON.stringify({path : filePath})
              })
                .then(async response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((data) => {
                  //console.log("data " + data); // Handle the response data here
                  if (data.data == "") {
                    jsonArray = [];
                  }
                  else {
                    jsonArray = data.data;
                  }
                })
                .catch(error => {
                  console.error('There has been a problem with your fetch operation:', error);
                });
        }
        // console.dir(jsonArray);
        return jsonArray;
    }
}
