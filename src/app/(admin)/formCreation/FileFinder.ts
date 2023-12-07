
import NoFileNameException from "@/app/(admin)/exceptions/NoFileNameException"
import FileSystemService from "@/app/(admin)/components/FileSystemService";
import FileTypes from "./FileTypes";

/**
 * This class is used to find files of different types, using string arrays as file paths
 */
class FileFinder {
    private _directoryPath: string;

    public get directoryPath(): string {
        return this._directoryPath;
    }
    public set directoryPath(value: string) {
        this._directoryPath = value;
    }

    constructor(directoryPath : string) {
        this._directoryPath = directoryPath;
    }

    /**
     * Checks if there is a directory at the inputted path and returns the path to the directory, or throws an error if it does not exist
     * @param desiredFilePath An array containing the desired path, from the fileFinder's directory path
     * @returns A promise, which when fulfilled, contains a string with the full path to the directory
     */
    public async getDirectory(desiredFilePath: Array<string>): Promise<string> {
        try {
            let newDirectoryPath : string = "src/app/(admin)"
            for(let i in desiredFilePath){
                newDirectoryPath += '/' + desiredFilePath[i];
            }   
            if (await FileSystemService.getType(newDirectoryPath) == FileTypes.directory.valueOf()) {
                console.log("Directory found");
                return newDirectoryPath;
            }
            else throw new NoFileNameException;
        } catch (error : any) {
            throw new Error('Failed to find directory: ' + error.message);
        }
    }


    /**
     * Checks if there is a JSON file at the inputted path and returns the path to the file, or throws an error if it does not exist
     * @param desiredFilePath An array containing the desired path, from the fileFinder's directory path
     * @returns A promise, which when fulfilled, contains a string with the full path to the file
     */
    public async findJSONFile(desiredFilePath : Array<string>, fileName : string) : Promise<string> {
        try{
            let path : string = await this.getDirectory(desiredFilePath);
            let filePath : string = path + "/" + fileName + ".json";
            if(await FileSystemService.getType(filePath) == FileTypes.JSON){
                return filePath;
            }
        }
        catch (e: any){
            throw NoFileNameException;
        }
        throw NoFileNameException;
    }

}

export default FileFinder;