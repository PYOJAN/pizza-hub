export const error404Handle = (req, res, next) => {
  res.status(404).render("pages/404/404", {
    title: "ERROR",
    layout: "./layouts/full-screen-layout",
  });
}