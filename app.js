const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const user = require("./models/user");
const chat = require("./models/chat");
const Groups = require("./models/group");
const Usergroups = require("./models/usergroup");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    const decodedToken = jwt.verify(token, "Your-secret-key");
    const userId = decodedToken.userId;

    user
      .findByPk(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
});

app.use("/", userRoutes);
app.use("/", chatRoutes);
app.use("/", groupRoutes);

user.hasMany(chat);
chat.belongsTo(user);

user.hasMany(Groups);
Groups.belongsTo(user);

Groups.hasMany(chat);
chat.belongsTo(Groups);

user.hasMany(Usergroups);
Usergroups.belongsTo(user);

Groups.hasMany(Usergroups);
Usergroups.belongsTo(Groups);

sequelize
  .sync()
  .then(() => {
    return user.findByPk(1);
  })
  .then((user) => {
    console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
