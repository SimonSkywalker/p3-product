
const path = require('path');
const fs = require('fs');


class DatabaseAccess {
    private directoryPath : String;

    constructor(directoryPath : String) {
        this.directoryPath = directoryPath;
    }

    public static uploadToFile(database: Array<object>, filePath : String) : void {
        fs.writeFile(filePath, JSON.stringify(database))
    }

    //https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js

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

    public findJSONFile(desiredFilePath : Array<string>, fileName : string) : String {
        let filePath = this.findDirectory(desiredFilePath);
        fs.readdir(filePath, function (files: Array<File>) {

            files.forEach(function (file, index) {
                let currentPath = path.join(filePath, file);
                fs.stat(currentPath, function (error: Error, stat : any) {
                    if (error) {
                      throw NoFileNameException;
                    }
                    //If a directory of the desired name is found
                    if (stat.isDirectory() && stat.name.equals(fileName + ".json"))
                        filePath = currentPath;
                        return filePath;
                    });
              
            })
        })
        throw NoFileNameException;
    }
}

export default DatabaseAccess;