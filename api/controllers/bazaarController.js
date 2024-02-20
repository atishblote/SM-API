const moment = require('moment');
const con = require("../../connection"); // Adjust the path as necessary

exports.getAllBazaar = async (req, res, next) => {
  try {
    // Assuming `con` is already defined and is a MySQL connection or pool
    con.query("SELECT * FROM bazaar ", function (error, result) {
      if (error) {
        return res.status(401).json({
          code: 0,
          message: "data not found",
          error: error,
        });
      }
      res.status(200).json({
        code: 1,
        message: "Bazaar fetched successfully",
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

// create a bazaar
exports.createBazaar = async (req, res, next) => {
  try {
    const bazaarData = req.body;
    const booleanValue = parseInt(bazaarData.is_highlighted);

    const openTime12Hour = moment(bazaarData.open_time, "HH:mm:ss.SSSSSS")
    const open_time = openTime12Hour.format("hh:mm A");

    const closeTime12Hour = moment(bazaarData.close_time, "HH:mm:ss.SSSSSS")
    const close_time = closeTime12Hour.format("hh:mm A");

    console.log(open_time +" "+ close_time)
    const sql = `
        INSERT INTO Bazaar (name, open_time, close_time, is_highlighted, day_of_week) 
        VALUES 
        (
        '${bazaarData.name}', 
        '${open_time}', 
        '${close_time}', 
        ${booleanValue}, 
        '${bazaarData.day_of_week.join(",")}'  
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
      console.log(error)
      console.log(result)
      res.status(200).json({
        code: 1,
        message: "Bazaar Created successfully",
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

exports.updateBazaar = async (req, res, next) => {
  try {
    const bazaarData = req.body;
    const booleanValue = parseInt(bazaarData.is_highlighted);
    // The SQL query with placeholders for parameters
    const sql = `
    UPDATE bazaar
    SET 
      name = '${bazaarData.name}', 
      open_time = '${bazaarData.open_time}', 
      close_time = '${bazaarData.close_time}', 
      is_highlighted = ${booleanValue}, 
      day_of_week = '${bazaarData.day_of_week.join(",")}',  
      is_active = '${bazaarData.is_active}'
    WHERE id = ${bazaarData.id}
  `;
    // const sql = ' UPDATE bazaar  SET name = ? , open_time = ? , close_time = ? , is_highlighted = ? , day_of_week = ?  WHERE id = ? ';
    console.log(sql)
    

    // Executing the parameterized query
    con.query(sql, function (error, result) {
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

// bazaar regular
exports.bazaarMultiData = async (req, res, next) => {
  try {

    const sql = `
      SELECT 
        b.id AS bazaar_id,
        b.name AS bazaar_name,
        b.open_time AS bazaar_open_time,
        b.close_time AS bazaar_close_time,
        b.is_highlighted AS bazaar_is_highlighted,
        b.day_of_week AS bazaar_day_of_week,
        b.is_active AS bazaar_is_active,
        b.create_at AS bazaar_create_at,
        p.id AS pannel_jodi_id,
        p.date_time AS jodi_date_time,
        p.open AS jodi_open,
        p.close AS jodi_close,
        p.jodi AS jodi,
        p.create_at AS jodi_create_at,
        p.is_active AS jodi_is_active
      FROM bazaar b
      LEFT JOIN pannel_jodi p ON b.id = p.bazaar_id
      ORDER BY b.id DESC;
    `;
    // const sql = `
    //   SELECT * FROM bazaar b
    //   JOIN pannel_jodi p ON b.id = p.bazaar_id
    //   ORDER BY b.id ASC;
    // `;
    // const sql = `SELECT * FROM bazaar`;
    con.query(sql, function (error, result) {
      if (error) {
        return res.status(401).json({
          code: 0,
          message: "data not available",
          error: error,
        });
      }
      res.status(200).json({
        code: 1,
        message: "Data fetched successfully",
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

exports.activeBazaar = async (req, res, next) => {
  try {
    // The SQL query with placeholders for parameters
    const sql = ` UPDATE bazaar  SET is_active = ? WHERE id = ? `;

    // Parameters to replace placeholders in the query
    const params = [
      req.body.is_active,
      req.body.id, // Assuming you're passing the user ID in the request body
    ];

    // Executing the parameterized query
    con.query(sql, params, function (error, result) {
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


//   delete Bazaar
exports.deleteBazaar = async (req, res, next) => {
  try {
    // Assuming the user's ID is passed as a URL parameter
    const userId = req.params.id;

    // SQL query with a placeholder for the user ID
    const sql = "DELETE FROM bazaar WHERE id = ?";

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
