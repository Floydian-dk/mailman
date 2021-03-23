import db from "../db";
import crypto from "crypto";
import { sha512crypt } from "sha512crypt-node";
import { bcrypt } from "bcrypt";

class Account {
  async getAccounts() {
    return await db
      .select("id", "username", "domain", "quota", "enabled", "sendonly")
      .from("accounts")
      .orderBy("domain", "asc")
      .orderBy("username", "asc");
  }

  async getAccountsForEmail(email) {
    const [username, domain] = email.split("@");
    return await db
      .select("id", "username", "domain", "quota", "enabled", "sendonly")
      .from("accounts")
      .where({ username, domain })
      .orderBy("domain", "asc")
      .orderBy("username", "asc");
  }

  async getAccount(fields) {
    return await db
      .select()
      .from("accounts")
      .where(fields)
      .limit(1);
  }

  async createAccount(fields) {
    if (fields.password) {
      fields.password = this.hashPassword(fields.password);
    }
    return await db("accounts").insert(fields);
  }

  async updateAccount(fields, id) {
    if (fields.password) {
      fields.password = this.hashPassword(fields.password);
    }
    return await db("accounts")
      .update(fields)
      .where({ id });
  }

  async deleteAccount(id) {
    return await db("accounts")
      .delete()
      .where({ id });
  }

  randomSalt() {
    return crypto.randomBytes(64).toString("hex");
  }

  getSaltFromHash(hash) {
    // $6$24923bb9fc4a008d$D.aFhvUgjHL9RtXgTH8bDf9MS6MVVTBMMSLPON9OBzeMtVVUKnnrLBInjXNKCvGg5xZGDKFOX2Zhb/3mM7HYF0
    const [, , salt] = hash.split("$");
    return salt;
  }

  hashPassword(password, salt = this.randomSalt()) {
    //const md5 = require("md5");
    const bcrypt = require("bcrypt");
    //return `{SHA512-CRYPT}${sha512crypt(password, salt)}`;
    //console.log(md5(password));
    //return `{MD5-CRYPT}${md5(password)}`;
    //console.log(bcrypt.hashSync(password, 5));
    return `{BLF-CRYPT}${bcrypt.hashSync(password, 5)}`;
  }

  comparePasswords(plainPassword, hashPassword) {
    const bcrypt = require("bcrypt");
    //const salt = this.getSaltFromHash(hashPassword);
    //const plainPasswordHash = this.hashPassword(plainPassword, salt);
    //console.log('Plain password: ',plainPassword);
    //console.log('Hash password: ',hashPassword);
    //console.log(bcrypt.compareSync(plainPassword, hashPassword))
    const plainPasswordHash = bcrypt.compareSync(plainPassword, hashPassword);
    return plainPasswordHash;
  }
}

export default new Account();
