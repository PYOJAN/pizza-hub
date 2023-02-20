export const catchAsync = (asyncFunction) => {
  return (req, res, next) => {
    asyncFunction(req, res, next).catch(next);
  };
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}