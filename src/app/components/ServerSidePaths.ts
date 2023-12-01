
export default class ServerSidePaths {
    static iconsPath : string = "/public/icons";
    static URLIconsPath : string = "/icons";
    static URLFunctionIconsPath : string = "/functionIcons";
    static databasePath : string = "/src/app/(database)";
    static projectsFile : string = "projects.json";
    static formsFile : string = "forms.json";

    public static getFormsPath(user: string, project: string): string {
        return ServerSidePaths.databasePath + "/" + user + "/" + project + "/" + ServerSidePaths.formsFile;
    }

    public static getIconsPath(): string {
        return ServerSidePaths.iconsPath;
    }

    public static getURLIconsPath(): string {
        return ServerSidePaths.URLIconsPath;
    }

    public static getURLFunctionIconsPath(): string {
        return ServerSidePaths.URLFunctionIconsPath;
    }

    public static getProjectsPath(user: string): string {
        return ServerSidePaths.databasePath + "/" + user + "/" + ServerSidePaths.projectsFile;
    }

    public static getProjectPath(user: string): string {
        return ServerSidePaths.databasePath + "/" + user;
    }
}
