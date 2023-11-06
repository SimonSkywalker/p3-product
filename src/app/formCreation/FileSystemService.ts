import FileTypes from "./FileTypes";

class FileSystemService {
    public static async listFiles(directoryPath: string): Promise<string[]> {
        console.log("hello");
        try {
            console.log("Imma fetch bitch");
            const response = await fetch(`/api/files?path=${directoryPath}`);
            
            console.log("I fetched bitch");
            if (response.ok) {
                const files = await response.json();
                return files;
            } else {
                throw new Error('Failed to fetch files: ' + response.statusText);
            }
        } catch (error : any) {
            throw new Error('Failed to fetch files: ' + error.message);
        }
    }

    public static async getType(currentPath : string) : Promise<FileTypes> {
        const response = await fetch(`/api/fileType?path=${currentPath}`);
        if (await response.json() == ("JSON"))
            return FileTypes.JSON
        else if (await response.json() == "directory")
            return FileTypes.directory
        else
            return FileTypes.other
    }
}

export default FileSystemService;