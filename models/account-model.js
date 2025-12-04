const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

//Update account info
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

//Update password account
async function updatePassword(account_password, account_id){
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount

  } catch (error) {
    return error.message
  }
}

async function checkExistingDiffEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rows[0].account_id
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(user_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [user_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching user found")
  }
}

async function addCart(id, inv_id) {
  try {
    const result = await pool.query(
      'INSERT INTO account_inventory (account_id, inv_id) VALUES ($1, $2);',
      [id, inv_id])
    return result.rowCount

  } catch (error) {
    return new Error("No matching user found")
  }
}

async function getCart(id) {
  try {
    const result = await pool.query(
      'SELECT * FROM inventory i JOIN account_inventory ai ON i.inv_id = ai.inv_id WHERE ai.account_id = $1;',
      [id])
      return result.rows
  } catch (error) {
    return new Error("No macthing user found")
  }
}

async function deleteCart(id, inv_id) {
  try {
    const result = await pool.query(
      'DELETE FROM account_inventory WHERE account_id = $1 AND inv_id = $2',
      [id, inv_id])
      return result.rowCount
  } catch (error) {
    return new Error("No macthing vehicle found")
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, checkExistingDiffEmail, addCart, getCart, deleteCart};