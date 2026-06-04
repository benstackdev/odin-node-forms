import { body, matchedData, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import usersData, { type UserType } from "../storages/userStorage.js";
import { isArgumentsObject } from "node:util/types";

// Basic routes to view all users and create new users

const usersListGet = (req: Request, res: Response) => {
  try {
    res.render("index", {
      title: "User list",
      users: usersData.getAllUsers()
    });
  } catch (err) {
    throw err;
  }
};

const usersCreateGet = (req: Request, res: Response) => {
  res.render("createUser", {
    title: "Create new user"
  });
};

// New user validation

const alphaError = "must only contain letters";
const alphaNumError = "must only contain numbers and letters";
const nameLengthError = "must be between 1 and 10 characters";
const bioLengthError = "Bio must be less than or equal to 200 characters";
const ageError = "Age must be between 18 and 120";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha().withMessage(`First name ${alphaError}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${nameLengthError}`),
  body("lastName")
    .trim()
    .isAlpha().withMessage(`Last name ${alphaError}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${nameLengthError}`),
  body("age")
    // asssumes any falsy value is optional when submitted
    .optional({ values: "falsy" })
    .isInt({ min: 18, max: 120 }).withMessage(ageError),
  body("email")
    .isEmail().withMessage("Email format is invalid"),
  body("bio")
    .optional()
    .isLength({ max: 200 }).withMessage(bioLengthError)
];

const validateSearch = [
  body("searchTerm")
    .trim()
    .isLength({ min: 3, max: 200 })
    .toLowerCase()
];

// Create new user
const usersCreatePost = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    // If there are errors in the form, print them
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array()
      });
    }

    // Otherwise, create user and redirect
    const newUser: UserType = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      bio: req.body.bio
    };
    usersData.addUser(newUser);
    res.redirect("/");
  } catch (err) {
    throw err;
  }
};

// Update existing user
const usersUpdateGet = (req: Request, res: Response) => {
  try {
    const user = usersData.getUser(req.params.id as string);
    res.render("updateUser", {
      title: "Update user",
      user: user
    });
  } catch (err) {
    throw err;
  }
};

const usersUpdatePost = (req: Request, res: Response) => {
  try {
    const user = usersData.getUser(req.params.id as string);
    const errors = validationResult(req);
    // If there are errors in the form, print them
    if (!errors.isEmpty()) {
      res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array()
      });
      return;
    }

    // Otherwise, create user and redirect
    const { firstName, lastName, age, email, bio } = matchedData(req);

    usersData.updateUser(req.params.id as string, {
      firstName: firstName,
      lastName: lastName,
      age: age,
      email: email,
      bio: bio
    });

    res.redirect("/");
  } catch (err) {
    throw err;
  }
};

// Delete user by ID
const usersDeletePost = (req: Request, res: Response) => {
  try {
    usersData.deleteUser(req.params.id as string);
    res.redirect("/");
  } catch (err) {
    throw err;
  }
};

// Search for user by either first name, last name, and/or email
const usersSearchGet = (req: Request, res: Response) => {
  try {
    res.render("search", {
      title: "Search for a user"
    });
  } catch (err) {
    throw err;
  }
};

const usersSearchPost = (req: Request, res: Response) => {
  try {
    const usersIds = usersData.getAllUsers().keys();
    const searchResults: UserType[] = usersIds.reduce((acc: UserType[], userId) => {
      const user = usersData.getUser(userId);
      if (user.firstName.includes(req.body.searchTerms) ||
        user.lastName.includes(req.body.searchTerms) ||
        user.email.includes(req.body.searchTerms)) {
        console.log(req.body.searchTerms);
        acc.push(user);
      }
      return acc;
    }, []);

    res.render("search", {
      title: "Search for user",
      searchResults: searchResults
    });

  } catch (err) {
    throw err;
  }
};

export {
  validateUser,
  validateSearch,
  usersListGet,
  usersCreateGet,
  usersCreatePost,
  usersUpdateGet,
  usersUpdatePost,
  usersDeletePost,
  usersSearchGet,
  usersSearchPost
};