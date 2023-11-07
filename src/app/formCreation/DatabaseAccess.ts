
import NoFileNameException from "../exceptions/NoFileNameException"
import FileSystemService from "./FileSystemService";
import FileTypes from "./FileTypes";

class DatabaseAccess {
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

    public async findDirectory(desiredFilePath: Array<string>): Promise<string> {
        try {
            let newDirectoryPath : string = this.directoryPath
            for(let i in desiredFilePath){
                if(await FileSystemService.getType(desiredFilePath[i])  == FileTypes.directory){
                    newDirectoryPath += desiredFilePath[i];
                }
            }
            return newDirectoryPath
        } catch (error : any) {
            throw new Error('Failed to find directory: ' + error.message);
        }
    }

    /*
    public static uploadToFile(database: Array<object>, filePath : String) : void {
        fs.writeFile(filePath, JSON.stringify(database))
    }*/

    //https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js

    /*
    public findDirectory(desiredFilePath : Array<String>) : String {
        let directoryPath : String = this.directoryPath;
        for (let i : number = 0; i < desiredFilePath.length; i++) {
            fs.readdir(directoryPath, function (files: Array<File>) {

                 if (!files.some(function (file, index) {
                    let currentPath = path.join(directoryPath, file);
                    fs.stat(currentPath, function (error: Error, stat : any) {
                        if (error) {
                          throw NoFileNameException;
                        }
                        //If a directory of the desired name is found
                        if (stat.isDirectory() && stat.name.equals(desiredFilePath[i])) {
                            directoryPath = currentPath;
                            return true;
                        }
                        });
                  
                })) {
                    throw NoFileNameException;
                }
            })
        }
        return directoryPath;

    }
    */


    public async findJSONFile(desiredFilePath : Array<string>, fileName : string) : Promise<string> {
        let filePath : Promise<string> = this.findDirectory(desiredFilePath);
        let files : Promise<string[]> = FileSystemService.listFiles(await filePath);
        for (let i in await files){
            let currentPath : string = (filePath + "/" + (await files)[i]);
            let fileType : FileTypes = await FileSystemService.getType(currentPath);
            if (fileType == FileTypes.JSON && (await files)[i] == fileName){
                return currentPath;
            }
        }
        throw NoFileNameException;
    }
}

export default DatabaseAccess;