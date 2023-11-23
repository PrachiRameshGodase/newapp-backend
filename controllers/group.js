const Groups = require("../models/group");

const User = require("../models/user");
const Usergroups = require("../models/usergroup");

const createGroup = async (req, res) => {
  console.log("createGroupsssssssss created");
  console.log(req.body);
  try {
    const { groupname } = req.body;
    const userId = req.user.dataValues.id;
    const phonenumber = req.user.dataValues.phonenumber;

    const group = await Groups.create({
      groupname: groupname,
      phonenumber: phonenumber,
    });

    //associate the user with the created group
    await group.setUser(userId);
    console.log(group);
    res.status(201).json({ data: group });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

const getgroup = async (req, res) => {
  console.log("getgroup calledddddddddd");
  try {
    if (!req.user) {
      return res.status(401).json({ err: "Invalid User" });
    }

    const userId = req.user.id;

    //retrieve group names where userid matches

    const groups = await Groups.findAll({
      attributes: ["groupname", "id"],
      where: {
        userId: userId,
      },
    });
    // console.log(groups)
    res.status(200).json({ data: groups });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

const addmember = async (req, res) => {
  console.log(req.user);
  console.log("Request Body:", req.body);

  try {
    const { phonenumber, groupId } = req.body;

    
    // Find the group based on the groupId
    const group = await Groups.findByPk(groupId);

    // console.log("User:", user);
    console.log("Group:", group);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Associate the user with the group in the usergroups table
    const usergroup = await Usergroups.create({
      userId: req.user.id,
      groupId: groupId,
    });

    res.status(200).json({
      message: `${phonenumber} added to the group ${group.groupname}`,
      data: usergroup,
    });
  } catch (err) {
    res.status(500).json({ err: "error is during addmember" });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const userGroups = await Usergroups.findAll({
      include: [
        
        { model: Groups, attributes: ["groupname"] },
        { model: User, attributes: ["name"] },
      ],
    });

    console.log("userGroups from the getAllgroup", userGroups);

    const groupData = userGroups.map((usergroup) => {
      return {
        userId: usergroup.userId,
        groupId: usergroup.groupId,
        userName: usergroup.dataValues.user.name,
        groupName: usergroup.dataValues.group.groupname,
      };
    });

    res.status(200).json({ data: groupData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGroup, addmember, getgroup, getAllGroups };
