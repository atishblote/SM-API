const con = require("../../connection"); // Adjust the path as necessary

exports.getAllJodiPanel = async (req, res, next) => {
  try {
    // Assuming `con` is already defined and is a MySQL connection or pool
    con.query("SELECT * FROM pannel_jodi", function (error, result) {
      if (error) {
        return res.status(401).json({
          code: 0,
          message: "data not found",
          error: error,
        });
      }
      console.log(error);
      console.log(result);
      res.status(200).json({
        code: 1,
        message: "Data fetched successfully",
        data: result,
      });
    });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};

// create a bazaar
exports.createJodiPanel = async (req, res, next) => {
  try {
    const bazaarData = req.body;
    const booleanValue = parseInt(bazaarData.is_highlighted);
    const sql = `
        INSERT INTO pannel_jodi (bazaar_id, date_time, open, close , jodi , is_active) 
        VALUES 
        (
        '${bazaarData.bazaar_id}', 
        '${bazaarData.date_time}', 
        '${bazaarData.open}', 
        '${bazaarData.close}', 
        '${bazaarData.jodi}', 
        '${bazaarData.is_active}'  
        )
    `;
    con.query(sql, function (error, result) {
      if (error) {
        return res.status(401).json({
          code: 0,
          message: "Dublicate Entry or Error",
          error: error,
        });
      }
      res.status(200).json({
        code: 1,
        message: "Data Created successfully",
        data: result,
      });
    });
  } catch (error) {
    // console.log(error)

    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};


// update userdata
exports.getUpdateJodiPanel = async (req, res, next) => {
  try {
    // The SQL query with placeholders for parameters
    const sql = ` UPDATE pannel_jodi  SET open = ?, close = ?, jodi = ? WHERE id = ? `;

    // Parameters to replace placeholders in the query
    const params = [
      req.body.open,
      req.body.close,
      req.body.jodi,
      req.body.id, // Assuming you're passing the user ID in the request body
    ];

    // Executing the parameterized query
    con.query(sql, params, function (error, result) {
      // console.log(error)
      // console.log(result)
      if (error) {
        return res.status(500).json({
          code: 0,
          message: "Error updating Panel",
          error: error.sqlMessage,
        });
      }
      if (result.affectedRows === 0) {
        // No rows were updated, which means the user ID was not found
        return res.status(404).json({
          code: 0,
          message: "Data not found",
        });
      }
      res.status(200).json({
        code: 1,
        message: "Data updated successfully",
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};

//get single jodi
exports.getSingleJodiPanel = async (req, res, next) => {
  // Assuming you're using `id` as a URL parameter to identify the user
  const userId = req.params.id; // or req.body.id, depending on how the ID is being sent

  const sql = "SELECT * FROM pannel_jodi WHERE id = ?";

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
        message: "Data not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Data fetched successfully",
      data: result[0], // Send the first user in the result set
    });
  });
};

//get panel Data jodi
exports.getPanelByDate = async (req, res, next) => {
  try {
    // Assuming you're using `id` as a URL parameter to identify the user
    const userId = req.params.id; // or req.body.id, depending on how the ID is being sent
    const byDate = req.query.date; // or req.body.id, depending on how the ID is being sent
    console.log(byDate);
    const sql =
      "SELECT * FROM pannel_jodi WHERE bazaar_id = ? AND date_time = ?";

    con.query(sql, [userId, byDate], function (error, result) {
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
          message: "Data not found",
        });
      }

      res.status(200).json({
        code: 1,
        message: "Data fetched successfully",
        data: result[0], // Send the first user in the result set
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};

// delete  single
//   delete user
exports.deleteodiPanel = async (req, res, next) => {
  try {
    // Assuming the user's ID is passed as a URL parameter
    const userId = req.params.id;

    // SQL query with a placeholder for the user ID
    const sql = "DELETE FROM pannel_jodi WHERE id = ?";

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
          message: "Data not found",
        });
      }

      // Successfully deleted the user
      res.status(200).json({
        code: 1,
        message: "Data deleted successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};

// delete multiple ids
exports.deleteMultipleJodiPanel = async (req, res, next) => {
  try {
    // Assuming you receive user IDs as an array in the request body
    const userIds = req.body.panelIds;

    // Check if userIds is not empty and is an array
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        code: 0,
        message: "Invalid input: Provide an array of Panel IDs.",
      });
    }

    // Generate placeholders for the query based on the number of userIds
    const placeholders = userIds.map(() => "?").join(",");

    // SQL query using the IN clause with placeholders
    const sql = `DELETE FROM pannel_jodi WHERE id IN (${placeholders})`;

    con.query(sql, userIds, function (error, result) {
      console.log(error)
      console.log(result)
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
          message: "Data not found",
        });
      }

      // Successfully deleted the users
      res.status(200).json({
        code: 1,
        message: "Multiple Data deleted successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};



