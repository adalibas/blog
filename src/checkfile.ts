import {accessSync, constants, } from 'fs';
import {execSync} from 'child_process';

export function checkCreateDatabase() {
    try { 
        accessSync("./blog.db", constants.F_OK,)
    }
    catch(e){
        execSync("sqlite3 ./blog.db < create")
    }
}