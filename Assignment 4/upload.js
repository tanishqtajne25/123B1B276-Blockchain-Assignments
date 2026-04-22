require('dotenv').config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function uploadFile() {
  const data = new FormData();
  data.append("file", fs.createReadStream("sample.txt"));

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    console.log("✅ File uploaded successfully!");
    console.log("CID:", res.data.IpfsHash);
  } catch (err) {
    console.error("Error uploading file:", err.response ? err.response.data : err.message);
  }
}

uploadFile();