import axios from 'axios';
import FileTypes from './FileTypes';
import { getServerSideProps } from 'next/dist/build/templates/pages';
import ServerSidePaths from './ServerSidePaths';

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

  public static async postIcon(formData: FormData): Promise<{ [key: string]: any }> {
    let result: { [key: string]: any } = {};

    try {
      const response = await axios.post('/api/uploadIcon', formData);

      if (response.data && response.status === 200) {
        result = response.data;
        console.log('filename:', result.filename);
        console.log('size:', result.size);
      } else {
        console.error('Server error:', response.data ? response.data.error : 'Unknown error');
      }
    } catch (error:any) {
      console.error('Fetch error:', error.message);
    }

    return result;
  }

  /* public static makeProjectFolder(user:string) {
    fs.mkdir(process.cwd() + ServerSidePaths.getProjectsPath(user));
  } */
  

}