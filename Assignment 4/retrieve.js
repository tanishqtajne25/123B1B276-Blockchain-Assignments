require("dotenv").config();

const inputCid = process.argv[2] || process.env.PINATA_CID;

if (!inputCid || inputCid === "YOUR_GENERATED_CID_HERE") {
  console.error(
    "Missing CID. Run: node retrieve.js <CID> OR set PINATA_CID in .env",
  );
  process.exit(1);
}

const cid = inputCid.trim();

const gateways = [
  "https://dweb.link/ipfs",
  "https://w3s.link/ipfs",
  "https://ipfs.io/ipfs",
  "https://gateway.pinata.cloud/ipfs",
];

async function getFile() {
  for (const baseUrl of gateways) {
    const url = `${baseUrl}/${cid}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`status ${res.status}`);
      }

      const content = await res.text();

      console.log("✅ File retrieved successfully!");
      console.log("Gateway:", baseUrl);
      console.log("Content:", content);
      return;
    } catch (err) {
      const detail = err.message || "unknown error";
      console.log(`Gateway failed (${baseUrl}): ${detail}`);
    }
  }

  console.error("Error retrieving file: all configured gateways failed.");
}

getFile();