import db from "../db";
const mdbpool = require("../mdb");

class Alias {
  async getAliases() {
    return await db
      .select()
      .from("mailman_aliases_view")
      .orderBy("source_domain", "asc")
      .orderBy("source_username", "asc");
  }

  async getAliasesForEmail(email) {
    const [source_username, source_domain] = email.split("@");
    return await db
      .select()
      .from("mailman_aliases_view")
      .where({ source_username, source_domain })
      .orderBy("source_domain", "asc")
      .orderBy("source_username", "asc");
  }

  async getAlias(id) {
    return await db
      .select()
      .from("mailman_aliases_view")
      .where({ id })
      .limit(1);
  }

  async createAlias(fields) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      // mailman_create_alias_sp('source_username', 'source_domain', 'destination_username', 'destination_domain', enabled);
      const res = await mdbconn.query("CALL mailman_create_alias_sp(?,?,?,?,?);", [fields.source_username, fields.source_domain, fields.destination_username,fields.destination_domain, fields.enabled]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }

    // return await db("aliases").insert(fields);
  }

  async updateAlias(fields, id) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      // console.log(id);
      const res = await mdbconn.query("CALL mailman_update_alias_sp(?,?,?,?,?,?);", [id, fields.source_username, fields.source_domain, fields.destination_username, fields.destination_domain, fields.enabled]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }

    // return await db("aliases")
    //   .update(fields)
    //   .where({ id });
  }

  async deleteAlias(id) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      const res = await mdbconn.query("CALL mailman_delete_alias_sp(?)", [id]);
      console.log(res);
      return res;
    }
    catch (err) {
        console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    // return await db("aliases")
    //   .delete()
    //   .where({ id });
  }
}

export default new Alias();
