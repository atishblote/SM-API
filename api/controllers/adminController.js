const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const con = require("../../connection"); // Adjust the path as necessary

exports.getAllUsers = async (req, res, next) => {
  // Assuming `con` is already defined and is a MySQL connection or pool
  con.query("SELECT * FROM users", function (error, result) {
    if (error) {
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        error: error,
      });
    }
    res.status(200).json({
      code: 1,
      message: "Users fetched successfully",
      data: result,
    });
  });
};

// Signup user
exports.postSingleUsers = async (req, res, next) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const checkUserQuery =
      "SELECT COUNT(*) AS count from users WHERE email = ?";
    con.query(checkUserQuery, [req.body.email], (error, result) => {
      console.log(error);
      console.log(result);
      if (error) {
        res.status(401).json({
          code: 0,
          message: "Someting error with database",
          error: error,
        });
      }

      if (result[0].count > 0) {
        res.status(401).json({
          code: 0,
          message: "User already exits",
          error: error,
        });
      } else {
        const sql = `INSERT INTO users (id, full_name, email, password, phone, is_active) 
        VALUES (
          null, '${req.body.full_name}', '${req.body.email}', '${hashedPassword}', '${req.body.phone}', '${req.body.is_active}'
          )`;
        con.query(sql, function (error, result) {
          if (error) {
            return res.status(500).json({
              code: 0,
              message: "User not created",
              error: error.sqlMessage,
            });
          }
          res.status(200).json({
            code: 1,
            message: "User added successfully",
            data: result,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Server error to exacute",
    });
  }
};

// update userdata
exports.getUpdateUsers = async (req, res, next) => {
  // The SQL query with placeholders for parameters
  const sql = `
        UPDATE users 
        SET full_name = ?, email = ?, password = ?, phone = ?, is_active = ? 
        WHERE id = ?
    `;

  // Parameters to replace placeholders in the query
  const params = [
    req.body.full_name,
    req.body.email,
    req.body.password, // Consider hashing this password before updating
    req.body.phone,
    req.body.is_active,
    req.body.id, // Assuming you're passing the user ID in the request body
  ];

  // Executing the parameterized query
  con.query(sql, params, function (error, result) {
    if (error) {
      return res.status(500).json({
        code: 0,
        message: "Error updating user",
        error: error.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      // No rows were updated, which means the user ID was not found
      return res.status(404).json({
        code: 0,
        message: "User not found",
      });
    }
    res.status(200).json({
      code: 1,
      message: "User updated successfully",
      data: result,
    });
  });
};

exports.getSingleUsers = async (req, res, next) => {
  // Assuming you're using `id` as a URL parameter to identify the user
  const userId = req.params.id; // or req.body.id, depending on how the ID is being sent

  const sql = "SELECT * FROM users WHERE id = ?";

  con.query(sql, [userId], function (error, result) {
    if (error) {
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        error: error,
      });
    }

    // Check if a user was found
    if (result.length === 0) {
      return res.status(404).json({
        code: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "User fetched successfully",
      data: result[0], // Send the first user in the result set
    });
  });
};

//   delete user
exports.deleteUser = async (req, res, next) => {
  // Assuming the user's ID is passed as a URL parameter
  const userId = req.params.id;

  // SQL query with a placeholder for the user ID
  const sql = "DELETE FROM users WHERE id = ?";

  con.query(sql, [userId], function (error, result) {
    if (error) {
      // If there's an error executing the query, return a 500 Internal Server Error
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        error: error,
      });
    }

    // If no rows are affected, it means the user was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 0,
        message: "User not found",
      });
    }

    // Successfully deleted the user
    res.status(200).json({
      code: 1,
      message: "User deleted successfully",
    });
  });
};

// delete multiple ids
exports.deleteMultipleUsers = async (req, res, next) => {
  // Assuming you receive user IDs as an array in the request body
  const userIds = req.body.userIds;

  // Check if userIds is not empty and is an array
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      code: 0,
      message: "Invalid input: Provide an array of user IDs.",
    });
  }

  // Generate placeholders for the query based on the number of userIds
  const placeholders = userIds.map(() => "?").join(",");

  // SQL query using the IN clause with placeholders
  const sql = `DELETE FROM users WHERE id IN (${placeholders})`;

  con.query(sql, userIds, function (error, result) {
    if (error) {
      // If there's an error executing the query, return a 500 Internal Server Error
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        error: error,
      });
    }

    // If no rows are affected, it means none of the users were found
    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 0,
        message: "Users not found",
      });
    }

    // Successfully deleted the users
    res.status(200).json({
      code: 1,
      message: "Users deleted successfully",
    });
  });
};

exports.loginuser = async (req, res, next) => {
  try {
    // const { email, password } = req.body;

    // Retrieve the user from the database
    const sql = `SELECT * FROM users WHERE email = ?`;
    con.query(sql, [req.body.email], function (error, result) {
      if (result != "") {
        if (result[0].count > 0) {
          res.status(404).json({
            code: 0,
            message: "User not found",
            error: error,
          });
        } else {
          // Compare the provided password with the hashed password in the database
          const match = bcrypt.compare(req.body.password,result[0].password,
            function (err, action) {
              if (action) {
                const userData = {
                  name: result[0].full_name,
                  email: result[0].email,
                  phone: result[0].phone,
                  password: result[0].password,
                  is_active: 1,
                  role: "admin",
                };
                // Passwords match
                const token = jsonwebtoken.sign(
                  {
                    email: result[0].email,
                    phone: result[0].phone,
                  },
                  "9R#7m3PqKz",
                  {
                    expiresIn: "12h",
                  }
                );
                // Proceed to create a session or generate a token here (e.g., using JWT)
                res.status(200).json({
                  code: 1,
                  message: "User authenticated successfully",
                  token: token,
                  data: userData,
                });
              } else {
                res.status(401).json({
                  code: 0,
                  message: "Authentication failed",
                });
              }
            }
          );
        }
      } else {
        res.status(404).json({
          code: 0,
          message: "User not registered",
          error: error,
        });
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      code: 0,
      message: "Server error occurred",
      error: error,
    });
  }
};
