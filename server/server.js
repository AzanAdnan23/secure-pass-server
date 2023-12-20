const express = require("express");
const ethers = require("ethers");
const SecurePass = require("../artifacts/contracts/SecurePass.sol/SecurePass.json");

const app = express();
const port = 8080;

// Set up Ethereum provider (use the provider you used in the frontend)
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc-evm-sidechain.xrpl.org"
);

const securePass = new ethers.Contract(
  "0xA4223a37a33BF51A2368A9621aD5d3ADa7A9365D",
  SecurePass.abi,
  provider
);

// Define a route for handling requests
app.get("/checkTicket", async (req, res) => {
  try {
    // Get event_id and ticket_id from the query parameters
    const { event_id, user_address } = req.query;

    // Call the smart contract function
    const isTicketValid = await securePass.isTicketValid(
      event_id,
      user_address
    );

    // Send the result back to the client
    res.json({ isTicketValid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
