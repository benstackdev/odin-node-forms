export type UserType = {
  id?: string,
  firstName: string,
  lastName: string,
  age: number,
  email: string,
  bio: string;
};

class UserStorage {
  userData: Map<string, UserType>;

  constructor() {
    this.userData = new Map();
  }

  addUser(newUser: UserType) {
    const newId = crypto.randomUUID();
    this.userData.set(newId, { id: newId, ...newUser });
  }

  getAllUsers() {
    return this.userData;
  }

  getUser(id: string) {
    if (this.userData.has(id)) return this.userData.get(id)!;
    throw new Error(`User with ${id} does not exist`);
  }

  updateUser(id: string, newData: Partial<UserType>) {
    const currentUser = this.getUser(id);
    this.userData.set(id, { ...currentUser, ...newData });
  }

  deleteUser(id: string) {
    this.userData.delete(id);
  }
}

const usersData = new UserStorage();
export default usersData;