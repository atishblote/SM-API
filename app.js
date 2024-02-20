const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// routes define
const adminRouter = require("./api/routes/adminRoutes");
const bazaarRouter = require("./api/routes/bazaarRoutes");
const jodiPanelRoutes = require("./api/routes/jodiPanelRoutes");

// morgan middleware
app.use(morgan("dev"));
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Corrected header name
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// handle reqest
// app.use("/blog", blogsRouter);
// app.use("/author", authorRouter);
// app.use("/comment", commentRouter);
// app.use("/category", categoryRouter);
// app.use("/media", mediaRoutes);
// app.use("/tag", tagRouters);
// app.use("/all-blogs", viewBlogsRouters);
app.use('/user', adminRouter)
app.use('/bazaar', bazaarRouter)
app.use('/jodi-panel', jodiPanelRoutes)
// app.use("/upload", uploadRoutes);
// app.use("/user", userRoutes);
// app.use("/pages", pageRoutes);

// error handling

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
