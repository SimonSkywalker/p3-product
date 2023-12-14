import Link from "next/link";
import ServerSidePaths from "./ServerSidePaths";
import internal from "stream";
import { ProjectObject } from "../classes/projectClass";

interface InactiveProjectProps {
    project: ProjectObject;
    user: string;
    onDelete: (title: string, index: number) => void;
    URLIconsPath: string;
    index: number;
  }

export const InactiveProjects: React.FC<InactiveProjectProps> = ({ project, user, onDelete, URLIconsPath, index }) => {
    if (!project.getIsActive()) {
      return (
        <div className="hover:scale-105 shadow-xl h-30 w-60 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400">
          
          <div className="flex justify-between items-center">
            <Link href={"/" + user + "/" + project.getTitle().replace(/ /g, '-') + "/chart"}>
              <img
                title={"Charts"}
                className="w-6 h-6 hover:cursor-pointer hover:scale-125"
                src={ServerSidePaths.URLFunctionIconsPath + "/chart.png"}
              />
            </Link>
          </div>
  
          <p className="text-center">{project.getTitle()}</p><br/>
  
          <Link 
            href={"/" + user + "/" + project.getTitle().replace(/ /g, '-')}> 
              <img
                title={project.getTitle()}
                src={`${URLIconsPath}/${project.getIcon()}`}
                width={50} 
                height={50}
                className="mt-4 mx-auto block rounded"
              /><br/>     
          </Link>
  
          <div className="flex justify-between items-center ">
            <img
              title={"Delete"}
              className="w-4 h-6 float-left hover:scale-125"
              src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
              onClick={() => onDelete(project.getTitle(), index)}
            />
          </div>
        </div>
      );
    }
  
    return null;
  };