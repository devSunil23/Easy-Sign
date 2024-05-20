// Function to update the status based on the provided name and email
const updateStatus = (email, status, signingOrder) => {
  // Find the object in the array based on name and email
  let foundObject = signingOrder.find((person) => person.email === email);
  // If the object is found, update the status
  if (foundObject) {
    foundObject.status = status;
    foundObject.actionDate = new Date();
    if (status === "sent") {
      foundObject.sentDate = new Date();
    }
    return signingOrder;
  } else {
    return signingOrder;
  }
};
module.exports = { updateStatus };
