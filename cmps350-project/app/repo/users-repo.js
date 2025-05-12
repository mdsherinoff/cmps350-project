import fs from "fs-extra";
import path from "path";

class usersRepo {
  constructor() {
    this.dataFilePath = path.join(process.cwd(), "/app/data/users.json");
  }
  async getUsers() {
    const usersData = await fs.readJSON(this.dataFilePath);
    return usersData;
  }
  async setUsers(users) {
    await fs.writeJson(this.dataFilePath, users);
    return "instructors changed successfully";
  }
}
export default new usersRepo();
