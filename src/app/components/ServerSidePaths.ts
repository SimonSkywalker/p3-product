
export default class ServerSidePaths {
    static iconsPath : string = "/public/icons";
    static URLIconsPath : string = "/icons";
    static databasePath : string = "/src/app/database";
    static projectsFile : string = "projects.json";

    public static getIconsPath(): string {
        return ServerSidePaths.iconsPath;
    }

    public static getURLIconsPath(): string {
        return ServerSidePaths.URLIconsPath;
    }

    public static getProjectsPath(user: string): string {
        return ServerSidePaths.databasePath + "/" + user + "/" + ServerSidePaths.projectsFile;
    }

    public static getProjectPath(user: string): string {
        return ServerSidePaths.databasePath + "/" + user;
    }
}
