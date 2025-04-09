import fs from 'fs-extra'
import path from 'path'

class instructorsRepo{
    constructor(){
        console.log('Current working directory:', process.cwd());
        this.dataFilePath = path.join(process.cwd(), '/app/data/instructors.json');
    }
    async getInstructors(){
        const instructorsData = await fs.readJSON(this.dataFilePath)
        return instructorsData;
    }

}
export default new instructorsRepo();
