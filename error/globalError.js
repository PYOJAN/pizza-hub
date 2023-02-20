export const globalError = (err, req, res, next) => {
  console.log("ERROR:::::=====", err)

  let messageData = {
    status: 404,
    message: ""
  }

  messageData.message = err.message

  const generateMessage = () => {

    let keys = [];

    Object.keys(err.keyValue).forEach((key, i) => {
      keys.push(key);
    })

    messageData.message = `[${keys.toString()}] is already register`
  }


  console.log("err.code::::-------------", err.code)
  if (err.code === 11000) generateMessage();




  res.status(500).json({
    ...messageData
  });
};
