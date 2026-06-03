import { body, matchedData, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import usersData, { type UserType } from "../storages/userStorage.js";

// Basic routes to view all users and create new users

const usersListGet = (req: Request, res: Response) => {
  res.render("index", {
    title: "User list",
    users: usersData.getAllUsers()
  });
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
    .optional()
    .isInt({ min: 18, max: 120 }).withMessage(ageError),
  body("email")
    .isEmail(),
  body("bio")
    .isAlphanumeric().withMessage(`Bio ${alphaNumError}`)
    .isLength({ max: 200 }).withMessage(bioLengthError)
];

// Create new user
const usersCreatePost = (req: Request, res: Response) => {
  const errors = validationResult(req);
  // If there are errors in the form, print them
  if (!errors.isEmpty()) {
    return res.status(400).render("createUser", {
      title: "Create user",
      errors: errors.array()
    });
  }

  // Otherwise, create user and redirect
  usersData.addUser(req.body.firstName, req.body.lastName, req.body.age, req.body.email, req.body.bio);
  res.redirect("/");
};

// Update existing user
const usersUpdateGet = (req: Request, res: Response) => {
  const user = usersData.getUser(req.params.id as string);
  res.render("updateUser", {
    title: "Update user",
    user: user
  });
};

const usersUpdatePost = (req: Request, res: Response) => {
  const user = usersData.getUser(req.params.id as string);
  const errors = validationResult(req);
  // If there are errors in the form, print them
  if (!errors.isEmpty()) {
    res.status(400).render("createUser", {
      title: "Create user",
      user: user,
      errors: errors.array()
    });
    return;
  }

  // Otherwise, create user and redirect
  const { firstName, lastName, age, email, bio } = matchedData(req);
  usersData.updateUser(req.params.id as string, firstName, lastName, age, email, bio);
  res.redirect("/");
  return;
};

// Delete user by ID
const usersDeletePost = (req: Request, res: Response) => {
  usersData.deleteUser(req.params.id as string);
  res.redirect("/");
};

export {
  validateUser,
  usersListGet,
  usersCreateGet,
  usersCreatePost,
  usersUpdateGet,
  usersUpdatePost,
  usersDeletePost
};