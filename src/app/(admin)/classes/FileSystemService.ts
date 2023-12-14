import axios from 'axios';
import FileTypes from './FileTypes';
import { getServerSideProps } from 'next/dist/build/templates/pages';
import ServerSidePaths from '../components/ServerSidePaths';

export default class FileSystemService {
  public static async listFiles(directoryPath: string): Promise<string[]> {
    try {
      const response = await axios.post('/api/files', { path: directoryPath });

      if (!response.data) {
        throw new Error('Network response was not ok');
      }

      // Optionally log or process the data here

      return response.data;
    } catch (error:any) {
      throw new Error('Failed to fetch files: ' + error.message);
    }
  }

  public static async getType(currentPath: string): Promise<FileTypes> {
    try {
      const response = await axios.post('/api/fileType', { path: currentPath });

      if (!response.data) {
        throw new Error('Network response was not ok');
      }

      // Optionally log or process the fileType here

      return response.data.fileType;
    } catch (error:any) {
      throw new Error('Failed to get file type: ' + error.message);
    }
  }

  public static async writeToJSONFile(data: Array<Object>, filePath: string) {
    try {
      const response = await axios.post('/api/writeToFile', { data, path: filePath });

      if (!response.data) {
        throw new Error('Network response was not ok');
      }

      // Optionally handle the response data here

    } catch (error:any) {
      console.error('There has been a problem with your fetch operation:', error);
      throw new Error('Failed to write to JSON file: ' + error.message);
    }
  }

  public static async getJSONFile(filePath: string): Promise<Array<Object>> {
    let jsonArray: Array<Object> = [];

    try {
      const fileType = await this.getType(filePath);

      if (fileType === FileTypes.JSON) {
        const response = await axios.post('/api/readFile', { path: filePath });

        if (!response.data) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;

        // Optionally handle the response data here
        jsonArray = data.data === '' ? [] : data.data;
      }
    } catch (error:any) {
      console.error('There has been a problem with your fetch operation:', error);
      throw new Error('Failed to get JSON file: ' + error.message);
    }

    // console.dir(jsonArray);
    return jsonArray;
  }

  /**
   * POST request to the /api/uploadIcon endpoint with formData
   * @param formData a form with the field 'file' containing the image file to upload
   * @returns A promise containing an object with 
   */
  public static async postIcon(formData: FormData): Promise<{ [key: string]: any }> {
    let result: { [key: string]: any } = {};

    try {
      const response = await axios.post('/api/uploadIcon', formData);

      if (response.data && response.status === 200) {
        result = response.data;
      } else {
        console.error('Server error:', response.data ? response.data.error : 'Unknown error');
      }
    } catch (error:any) {
      console.error('Fetch error:', error.message);
    }

    return result;
  }

  /**
   * Creates a new empty directory at the path
   * @param directoryPath The path of the desired directory, including the directory name at the end
   */
  public static async makeDirectory(directoryPath : string) : Promise<void> {
    try {
      await fetch('/api/createDirectory', {
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

  public static async delete(directoryPath : string) : Promise<void> {
    try {
      await fetch('/api/delete', {
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
   * Changes the name of a file or directory, while keeping the contents the same
   * @param path The path of the file or directory to be renamed, from the source folder
   * @param newName The new name of the path
   */
  public static async rename(path : string, newName: string) : Promise<void> {

    let splitPath : Array<string> = path.split("/");
    splitPath[splitPath.length-1] = newName;
    let newPath = splitPath.join("/");
    try {
      await fetch('/api/rename', {
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
  
  /**
   * Makes a fetch operation that looks at the browser's current cookie and, if it exists, returns the current user
   * @returns A promise that, when fulfilled, contains a JSON object with one field called "Id" being the current user
   *          or nothing if there is no user
   */
  public static async APIRequestUser() : Promise<any> {
    let data;
    try{
    const res = await fetch("/api/getCurrentUser") 
      if(res.ok){
      
        data = await res.json();  
        return data;
      }
    
    }catch(Error){
        console.error(Error)
    }
  }
  

}