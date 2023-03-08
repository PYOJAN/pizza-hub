import { addError } from "./utils";

/**
 * Registers a new user with the provided form data.
 *
 * @param {HTMLFormElement} form - The HTML form element containing the user data.
 * @param {Array<Object>} fields - An array of field objects, each with a `name`, `validate` function, and `error` message.
 * @param {function} onSuccess - A function to call with the validated form data.
 * @throws {TypeError} Will throw an error if `form` is not an instance of HTMLFormElement.
 * @throws {TypeError} Will throw an error if `fields` is not an array or an empty array.
 * @throws {TypeError} Will throw an error if any object in `fields` does not contain `name`, `validate` function, and `error` message properties.
 * @throws {TypeError} Will throw an error if `onSuccess` is not a function.
 */
export const formValidate = (form, fields = [], onSuccess) => {
  // Validate form parameter
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError("Invalid form parameter. Expected an HTMLFormElement.");
  }

  // Validate fields parameter
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new TypeError(
      "Invalid fields parameter. Expected a non-empty array."
    );
  }

  // Validate each object in the fields parameter
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];

    if (!field.name || typeof field.name !== "string") {
      throw new TypeError(
        `Invalid fields parameter. Object at index ${i} does not contain a valid 'name' property.`
      );
    }

    if (typeof field.validate !== "function") {
      throw new TypeError(
        `Invalid fields parameter. Object at index ${i} does not contain a valid 'validate' function.`
      );
    }

    if (!field.error || typeof field.error !== "string") {
      throw new TypeError(
        `Invalid fields parameter. Object at index ${i} does not contain a valid 'error' message.`
      );
    }
  }

  // Validate onSuccess parameter
  if (typeof onSuccess !== "function") {
    throw new TypeError("Invalid onSuccess parameter. Expected a function.");
  }

  const errorDiv = document.querySelector(".errorDiv");
  const formObject = {};
  let isValid = true;
  errorDiv.innerHTML = "";

  fields.forEach((field) => {
    const value = form[field.name].value;
    if (!field.validate(value)) {
      addError(errorDiv, field.error);
      isValid = false;
    }
    formObject[field.name] = value;
  });

  if (isValid) {
    errorDiv.classList.add("hidden");
    onSuccess(formObject, errorDiv);
  }
};
