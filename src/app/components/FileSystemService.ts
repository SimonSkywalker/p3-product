import FileTypes from "./FileTypes";

export default class FileSystemService {
  public static async listFiles(directoryPath: string): Promise<string[]> {
    try {
        const response = await fetch('/api/files', {
            method: 'POST',
            body: JSON.stringify({ path: directoryPath }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data: string[] = await response.json();

        // Optionally log or process the data here

        return data;
    } catch (error:any) {
        throw new Error('Failed to fetch files: ' + error.message);
    }
}

public static async getType(currentPath: string): Promise<FileTypes> {
  try {
      const response = await fetch('/api/fileType', {
          method: 'POST',
          body: JSON.stringify({ path: currentPath }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const fileType: FileTypes = data.fileType;

      // Optionally log or process the fileType here

      return fileType;
  } catch (error:any) {
      throw new Error('Failed to get file type: ' + error.message);
  }
}

public static async writeToJSONFile(data: Array<Object>, filePath: string) {
  try {
      const response = await fetch('/api/writeToFile', {
          method: 'POST',
          body: JSON.stringify({ data: data, path: filePath }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Optionally handle the response data here

  } catch (error:any) {
      console.error('There has been a problem with your fetch operation:', error);
      throw new Error('Failed to write to JSON file: ' + error.message);
  }
}

  public static async getJSONFile(filePath: string): Promise<Array<Object>> {
    let jsonArray: Array<Object> = [];

    try {
        if (await this.getType(filePath) === FileTypes.JSON) {
            const response = await fetch('/api/readFile', {
                method: 'POST',
                body: JSON.stringify({ path: filePath }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Optionally handle the response data here
            if (data.data === "") {
                jsonArray = [];
            } else {
                jsonArray = data.data;
            }
        }
        // console.dir(jsonArray);
        return jsonArray;
    }

    public static async postIcon(formData : FormData) : Promise<Array<Object>> {
      
      let jsonArray : Array<Object> = [];
          await fetch('/api/uploadIcon', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            // console.log("data:", data);
            //let alertString = "Image uploaded successfully.\nfilename: " + data["filename"] + "\nsize: " + data["size"] + " bytes.";
            //alert(alertString);
            jsonArray = data.data;
          })
          .catch(error => console.error("error:", error));
      
      // console.dir(jsonArray);
      return jsonArray;
    }  
}
