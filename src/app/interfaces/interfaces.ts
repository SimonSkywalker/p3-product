
//For classes that can add, remove and get information from JSON files.
interface DatabaseAccess {
    getFromDatabase : (database : object, name : Nameable) => any;
    addToDatabase : (database : object, fileName : string) => void;
    removeFromDatabase : (database : object, object : object, fileName : string) => void;

}


//For classes that have names and can therefore be found by names.
interface Nameable {
    _name : String;
}

export interface ProjectInterface {
    title: string;
    isActive: boolean;
    icon: string;
}

export interface projectObject extends ProjectInterface {
    beingEdited: boolean;
  }
