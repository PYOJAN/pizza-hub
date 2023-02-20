import Noty from "noty";

function ShowNoty() {
  return {
    success(message) {
      new Noty({
        theme: "relax",
        timeout: 2000,
        type: "success",
        layout: "topRight",
        text: message,
      }).show();
    },

    error(message) {
      new Noty({
        theme: "relax",
        timeout: 2000,
        type: "error",
        layout: "topRight",
        text: message,
      }).show();
    },
  };
}

export default ShowNoty;

// class Show extends Noty {
//   constructor(options) {
//     super(options)
//   }

//   // Custom method to show the notification with a promise
//   withPromise(promise) {
//     // Show the notification
//     this.show()

//     // Set up an event listener for the notification's close event
//     this.on('onClose', () => {
//       // Handle the notification close event
//       console.log('Notification closed')
//     })

//     // Return a new promise that resolves when the original promise resolves
//     return new Promise((resolve, reject) => {
//       promise.then(response => {
//         // Replace the notification message with a success message
//         this.setText('Login successful')
//         // Resolve the new promise
//         resolve(response)
//       })
//       .catch(error => {
//         // Handle any errors
//         console.error(error)
//         // Reject the new promise
//         reject(error)
//       })
//     })
//   }
// }

// // Usage
// const notification = new Show({
//   text: 'Logging in...',
//   type: 'info',
//   timeout: false // set timeout to false to prevent the notification from automatically disappearing
// })

// const loginPromise = new Promise((resolve, reject) => {
//   // Make the server request here, e.g. using fetch
//   setTimeout(() => {
//     resolve('Login successful')
//   }, 5000)
// })

// notification.withPromise(loginPromise)
//   .then(response => {
//     // Handle the successful login response here
//     console.log(response)
//   })
//   .catch(error => {
//     // Handle the login error here
//   })

// // Hide the notification after a delay
// setTimeout(() => {
//   notification.close()
// }, 10000)

