import fs from 'fs-extra'
import path from 'path'

class studentsRepo{
    constructor(){
        console.log('Current working directory:', process.cwd());
        this.dataFilePath = path.join(process.cwd(), '/app/data/students.json');
    }
    async getStudents(){
        const studentsData = await fs.readJSON(this.dataFilePath)
        return studentsData
    }
    async setStudents(students){
        const studentsData = await fs.readJSON(this.dataFilePath)
        return studentsData;
    }
}
export default new studentsRepo();
