import db from "../db";
const mdbpool = require("../mdb");

class Domain {

  async getDomains() {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      return await mdbconn.query("SELECT * FROM mailman_domains_view");
    }
    catch (err) {
      console.log("not connected due to error: " + err);
    } finally {
      if (mdbconn) mdbconn.release();
    }
  }

  async getDomainsForEmail(email) {
    const [, domain] = email.split("@");
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      return await mdbconn.query("SELECT * FROM mailman_domains_view WHERE domain = ?", [domain]);
    }
    catch (err) {
      console.log("SQL errror: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    // return await db
    //   .select()
    //   .from("mailman_domains_view")
    //   .where({ domain });
  }

  async getDomain(id) {
    return await db
      .select()
      .from("mailman_domains_view")
      .where({ id })
      .limit(1);
  }

  async createDomain(domain) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      const res = await mdbconn.query("call mailman_create_domain_sp(?)", [domain]);
      // console.log(res[0]);
      return res;
    }
    catch (err) {
      console.log("SQL errror: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    //.then(res => db.select(db.raw('@outmsg')));
    //console.log("Got output: ", res);
  }

  async updateDomain(fields, id) {
    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      // console.log(id);
      const res = await mdbconn.query("CALL mailman_update_domain_sp(?,?);", [id, fields.domain]);
      console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
    // return await db("domains")
    //   .update(fields, ["id", "domain"])
    //   .where({ id });
  }

  async deleteDomain(id) {
    const domain = await this.getDomain(id);

    let mdbconn;
    try {
      mdbconn = await mdbpool.getConnection();
      const res = await mdbconn.query("call mailman_delete_domain_sp(?)", [id]);
      // console.log(res);
      return res;
    }
    catch (err) {
      console.log("SQL error: " + err);
    }
    finally {
      if (mdbconn) mdbconn.release();
    }
  }
}

export default new Domain();
