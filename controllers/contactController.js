const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModel");
//express-async-handler will handle the error in their own and will need not to use try catch

//@desc get all contacts
//route GET /api/contacts
//@access public

const getContacts =asyncHandler (async(req, res) => {
  const contact = await Contacts.find();
  res.status(200).json(contact);
});

//@desc create new contacts
//route POST /api/contacts
//@access private

const createContact =asyncHandler(async (req, res) => {
    console.log("This is the content: ",req.body);
    const {name ,email,phone} = req.body;
    if(!name || !email ||!phone){
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    const contact = await Contacts.create({
      name,
      email,
      phone,
      user_id:req.user.id,
    })
  res.status(201).json(contact);
});

//@desc get a contacts
//route GET /api/contacts/:id
//@access private

const getContact =asyncHandler(async (req, res) => {
  const contact =  await Contacts.find({user_id: req.params.id});
  if(!contact){
    res.status(404);
    throw new Error("Contact not found!")
  }
  res.status(200).json(contact);
});

//@desc updated a contacts
//route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async(req, res) => {
  const contact =  await Contacts.findById(req.params.id);
  if(!contact){
    res.status(404);
    throw new Error("Contact not found!")
  }
  if(contact.user_id.toString() !== req.user.id ){
    res.status(403);
    throw new Error("User don't have permission to update other contacts")
  }
  const updatedContact = await Contacts.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  )
  res.status(200).json(updatedContact);
});

//@desc deleted a contact
//route DELETE /api/contacts/:id
//@access private

const deleteContact =asyncHandler (async(req, res) => {
  const contact =  await Contacts.findById(req.params.id);
  if(!contact){
    res.status(404);
    throw new Error("Contact not found!")
  };
  if(contact.user_id.toString() !== req.user.id ){
    res.status(403);
    throw new Error("User don't have permission to delete other contacts")
  }
  // await Contacts.remove();
  await Contacts.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
