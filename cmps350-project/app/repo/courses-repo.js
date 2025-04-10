import fs from 'fs-extra'
import path from 'path'

class coursesRepo{
    constructor(){
        console.log('Current working directory:', process.cwd());
        this.dataFilePath = path.join(process.cwd(), '/app/data/courses.json');
    }
    async getCourses(){
        const coursesData = await fs.readJSON(this.dataFilePath)
        return coursesData
    }
    async setCourses(courses){
        await fs.writeJson(this.dataFilePath, courses)
        return "courses changed successfully"
    }
}
export default new coursesRepo();
