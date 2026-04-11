const router = require("express").Router();
const Customer = require("../models/Customer");
const auth = require("../middleware/auth");

// CREATE
router.post("/", auth, async (req, res) => {
  console.log(req.body); 
  
  const customer = new Customer(req.body);
  await customer.save();
  res.json(customer);
});

// READ
router.get("/", auth, async (req, res) => {
  const data = await Customer.find();
  res.json(data);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;