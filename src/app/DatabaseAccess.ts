const fs = require('fs');

interface DatabaseAccess {
    getFromDatabase : (database : object) => any;
    addToDatabase : (database : object, fileName : string) => void;
    removeFromDatabase : (database : object, object : object, fileName : string) => void;

}