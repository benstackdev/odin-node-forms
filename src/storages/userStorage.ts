export type UserType = {
  id: string;
  firstName: string,
  lastName: string,
  age: number,
  email: string,
  bio: string;
};

class UserStorage {
  userData: UserType[];

  constructor() {
    this.userData = [];
  }

  addUser(firstName: string, lastName: string, age: number, email: string, bio: string, id?: string) {
    this.userData.push({
      id: id ?? crypto.randomUUID(),
      firstName: firstName,
      lastName: lastName,
      age: age,
      email: email,
      bio: bio
    });
  }

  getAllUsers() {
    return this.userData;
  }

  getUser(id: string) {
    return this.userData.find((user) => user.id === id);
  }

  updateUser(id: string, firstName?: string, lastName?: string, age?: number, email?: string, bio?: string) {
    const currentUser = this.getUser(id);
    this.deleteUser(id);

    if (currentUser) {
      this.addUser(firstName ?? currentUser.firstName, lastName ?? currentUser.lastName, age ?? currentUser.age, email ?? currentUser.email, bio ?? currentUser.bio, currentUser.id);

      return true;
    }

    return false;
  }

  deleteUser(id: string) {
    this.userData.filter((user) => user.id !== id);
  }
}

const usersData = new UserStorage();
export default usersData;