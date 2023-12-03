import FileTypes from "./FileTypes";

export default class FileSystemService {

    /**
     * 
     * @param originPath The path of the project's source folder
     * @param directoryPath The path of the directory, including the directory name itself
     * @returns A promise that, when fulfilled, gives an array of strings containing every file in the directory
     */
    public static async listFiles(originPath: string, directoryPath: string): Promise<string[]> {
        console.log("hello");
        try {
            let data : string[] = [];
            console.log("Imma fetch bitch");
            await fetch(originPath + '/api/files', {
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
                  console.log(data); // Handle the response data here
                })
                .catch(error => {
                  console.error('There has been a problem with your fetch operation:', error);
                });
            console.log("I fetched bitch");
            return data;
        } catch (error : any) {
            throw new Error('Failed to fetch files: ' + error.message);
        }
    }

    /**
     * Creates an empty directory at the destination path. If none exists
     * @param originPath The path of the project's source folder
     * @param directoryPath The path of the directory, including the directory name itself
     */
    public static async makeDirectory(originPath : string, directoryPath : string) : Promise<void> {
      try {
        await fetch(originPath + '/api/createDirectory', {
            method: 'POST',
            body: JSON.stringify({path: directoryPath})
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
      } catch (error : any) {
          throw new Error('Failed to make directory: ' + error.message);
      }
    }

    /**
     * 
     * @param originPath 
     * @param directoryPath 
     */
    public static async delete(originPath : string, path : string) : Promise<void> {
      try {
        await fetch(originPath + '/api/delete', {
            method: 'POST',
            body: JSON.stringify({path: path})
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
      } catch (error : any) {
          throw new Error('Failed to make directory: ' + error.message);
      }
    }



    /**
     * 
     * @param originPath The path to the project's source folder
     * @param path The path of the file or directory to be renamed
     * @param newName The new name of the file or directory
     */
    public static async rename(originPath : string, path : string, newName: string) : Promise<void> {

      let splitPath : Array<string> = path.split("/");
      splitPath[splitPath.length-1] = newName;
      let newPath = splitPath.join("/");
      try {
        await fetch(originPath + '/api/rename', {
            method: 'POST',
            body: JSON.stringify({path: path, newPath: newPath})
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
      } catch (error : any) {
          throw new Error('Failed to make directory: ' + error.message);
      }
    }



    public static async getType(originPath : string, currentPath : string) : Promise<FileTypes> {
        let fileType :FileTypes = FileTypes.other;
         await fetch(originPath + '/api/fileType', {
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
              console.log("data " + data.fileType); // Handle the response data here
              fileType = data.fileType;
            })
            .catch(error => {
              console.log("REEEEEEEE");
              console.error('There has been a problem with your fetch operation:', error);
            });
        console.log("I fetched bitch" + fileType);
        return fileType;
    }

    public static async writeToJSONFile(originPath : string,data : Array<Object>, filePath : string) {
            await fetch(originPath + '/api/writeToFile', {
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
                  console.log("data " + data.fileType); // Handle the response data here
                })
                .catch(error => {
                  console.log("REEEEEEEE");
                  console.error('There has been a problem with your fetch operation:', error);
                });
    }

    public static async getJSONFile(originPath : string, filePath : string) : Promise<Array<Object>> {
        let jsonArray : Array<Object> = [];
        if(await this.getType(originPath, filePath) == FileTypes.JSON){
            await fetch(originPath + '/api/readFile', {
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
                  console.log("data " + data); // Handle the response data here
                  if (data.data == "") {
                    jsonArray = [];
                  }
                  else {
                    jsonArray = data.data;
                  }
                })
                .catch(error => {
                  console.log("REEEEEEEE");
                  console.error('There has been a problem with your fetch operation:', error);
                });
        }
        console.log("returning json array");
        console.dir(jsonArray);
        return jsonArray;
    }
}