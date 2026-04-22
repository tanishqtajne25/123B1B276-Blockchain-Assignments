# Assignment 5: DAO Smart Contract

## 📌 Objective
To implement a DAO (Decentralized Autonomous Organization) smart contract with member management, proposal creation, voting mechanism, and execution logic.

---

## 📂 Files Included
- DAO.sol → Smart contract
- README.md → Documentation
- Screenshots → Proof of execution

---

## ⚙️ DAO Workflow

1. Contract is deployed by owner
2. Owner adds members
3. Members create proposals
4. Members vote within deadline
5. Proposal is executed after voting ends

---

## 🗳️ Voting Mechanism
- Only registered members can vote
- Each member can vote only once per proposal
- Voting allowed only before deadline
- Votes are counted using voteCount

---

## 📝 Proposal Creation
- Created using createProposal()
- Contains:
  - Description
  - Deadline
  - Vote count
  - Execution status

---

## 🚀 Execution
- Proposal can be executed after deadline
- Requires at least one vote
- Marks proposal as executed

---

## 📸 Screenshots Included
- Member addition
- Proposal creation
- Voting process
- Execution result

---

## ✅ Result
The DAO smart contract successfully implements decentralized governance with voting and proposal execution.

---

## 💡 Conclusion
This DAO demonstrates decentralized decision-making without a central authority, where members collaboratively govern the system using blockchain.