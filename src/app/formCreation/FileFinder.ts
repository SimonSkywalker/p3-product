
import NoFileNameException from "../exceptions/NoFileNameException"
import FileSystemService from "./FileSystemService";
import FileTypes from "./FileTypes";

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

    public async getDirectory(desiredFilePath: Array<string>): Promise<string> {
        try {
            let newDirectoryPath : string = this.directoryPath
            for(let i in desiredFilePath){
                newDirectoryPath += '/' + desiredFilePath[i];
            }
            console.log("HEJ?" + FileTypes.directory.valueOf());
            console.log(await FileSystemService.getType(newDirectoryPath))
            if (await FileSystemService.getType(newDirectoryPath) == FileTypes.directory.valueOf()) {
                console.log("Directory found");
                return newDirectoryPath;
            }
            else throw new NoFileNameException;
        } catch (error : any) {
            throw new Error('Failed to find directory: ' + error.message);
        }
    }

    public async findJSONFile(desiredFilePath : Array<string>, fileName : string) : Promise<string> {
        try{
            let path : string = await this.getDirectory(desiredFilePath);
            let filePath : string = path + "/" + fileName + ".json";
            if(await FileSystemService.getType(filePath) == FileTypes.JSON){
                return filePath;
            }
        }
        catch (e: any){
            console.log("e");
            throw NoFileNameException;
        }
        console.log("e2");
        throw NoFileNameException;
    }

}

export default FileFinder;