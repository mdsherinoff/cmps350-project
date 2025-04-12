import fs from "fs-extra";
import path from "path";

class coursesRepo {
  constructor() {
    console.log("Current working directory:", process.cwd());
    this.dataFilePath = path.join(process.cwd(), "/app/data/courses.json");
  }
  async getCourses() {
    const coursesData = await fs.readJSON(this.dataFilePath);
    return coursesData;
  }
  async setCourses(courses) {
    const coursesData = await fs.writeJson(this.dataFilePath, courses);
    return "courses changed successfully";
  }
  async addCourse(course) {
    const courses = await this.getCourses();
    courses.push(course);
    await fs.writeJSON(this.dataFilePath, courses);
    return course;
  }
}
export default new coursesRepo();
