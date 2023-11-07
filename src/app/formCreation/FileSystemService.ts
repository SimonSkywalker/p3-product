import FileTypes from "./FileTypes";

class FileSystemService {
    public static async listFiles(directoryPath: string): Promise<string[]> {
        console.log("hello");
        try {
            let data : string[] = [];
            console.log("Imma fetch bitch");
            await fetch('../api/files', {
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

    public static async getType(currentPath : string) : Promise<FileTypes> {

        const response : FileTypes = await fetch('../api/fileType', {
            method: 'POST',
            body: JSON.stringify({path: currentPath})
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return await response.json();
            })
            .then(data => {
              console.log(data); // Handle the response data here
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
        console.log("I fetched bitch");
        if (response == ("JSON"))
            return FileTypes.JSON
        else if (await response.json() == "directory")
            return FileTypes.directory
        else
            return FileTypes.other
    }
}

export default FileSystemService;