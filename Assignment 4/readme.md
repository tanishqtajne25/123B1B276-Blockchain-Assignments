# Assignment 4: Uploading and Retrieving Files from IPFS (Pinata)

## Objective

Upload a local file to IPFS using Pinata and retrieve the same content using public IPFS gateways.

## Files in This Assignment

- `upload.js` - uploads `sample.txt` to Pinata and prints the generated CID
- `retrieve.js` - retrieves content by CID using gateway fallback
- `sample.txt` - sample file used for upload
- `.env` - API credentials and optional CID
- `screenshots/` - execution proof
- `readme.md` - setup and usage instructions

## Tools Used

- Node.js
- Pinata API
- IPFS public gateways
- npm packages: `dotenv`, `axios`, `form-data`

## Prerequisites

1. Node.js installed (Node 18+ recommended).
2. Pinata API credentials.

## Environment Variables

Create or update `.env` in this folder:

```env
PINATA_API_KEY=YOUR_PINATA_API_KEY
PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET_API_KEY
PINATA_CID=OPTIONAL_CID_FOR_RETRIEVAL
```

`PINATA_CID` is optional because `retrieve.js` also accepts CID from command line.

## Install Dependencies

Run in `Assignment 4`:

```bash
npm install
```

If you are setting up from scratch, install required packages explicitly:

```bash
npm install dotenv axios form-data
```

## Upload Procedure

1. Place your file content in `sample.txt`.
2. Run:

```bash
node upload.js
```

3. Copy the CID shown in output.

## Retrieve Procedure

### Option A: Use CID from `.env`

1. Set `PINATA_CID=<YOUR_CID>` in `.env`.
2. Run:

```bash
node retrieve.js
```

### Option B: Pass CID directly

```bash
node retrieve.js <YOUR_CID>
```

## Script Behavior Notes

- `retrieve.js` checks gateways in this order:
  1. `https://dweb.link/ipfs`
  2. `https://w3s.link/ipfs`
  3. `https://ipfs.io/ipfs`
  4. `https://gateway.pinata.cloud/ipfs`
- If one gateway fails, it automatically tries the next.

## Troubleshooting

- `Cannot find module 'dotenv'`:
  Run `npm install` in `Assignment 4`.
- `Missing CID. Run: node retrieve.js <CID> OR set PINATA_CID in .env`:
  Provide a valid CID via CLI or `.env`.
- `Error retrieving file: all configured gateways failed.`:
  Check internet access, verify CID correctness, and retry after a short delay.

## Security Note

Do not expose real API keys in public repositories. Keep `.env` private.