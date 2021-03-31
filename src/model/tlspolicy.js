import db from "../db";
const mdbpool = require("../mdb");

class TlsPolicy {
  async getTlsPolicies() {
    return await db
      .select()
      .from("mailman_tlspolicies_view")
      .orderBy("domain", "asc");
  }

  async getTlsPolicy(id) {
    return await db
      .select()
      .from("mailman_tlspolicies_view")
      .where({ id })
      .limit(1);
  }

  async createTlsPolicy(fields) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();

      const res = await mdbconn.query("CALL mailman_create_tlspolicy_sp(?,?,?);", [fields.domain, fields.policy, fields.params]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    // return await db("tlspolicies").insert(fields);
  }

  async updateTlsPolicy(fields, id) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      const res = await mdbconn.query("CALL mailman_update_tlspolicy_sp(?,?,?,?);", [id[0], fields.domain, fields.policy, fields.params]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    // return await db("tlspolicies")
    //   .update(fields)
    //   .where({ id });
  }

  async deleteTlsPolicy(id) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      const res = await mdbconn.query("CALL mailman_delete_tlspolicy_sp(?);", [id[0]]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();

    }
    // return await db("tlspolicies")
    //   .delete()
    //   .where({ id });
  }
}

export default new TlsPolicy();
