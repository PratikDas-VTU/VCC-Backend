import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Team = require("./models/Team.js");

import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const teams = [];

fs.createReadStream("teams.csv")
  .pipe(csv())
  .on("data", (row) => teams.push(row))
  .on("end", async () => {
    for (const t of teams) {
      const passwordHash = await bcrypt.hash(t.phone, 10);

      await Team.create({
        teamId: t.teamId,
        email: t.email,
        leaderName: t.leaderName,
        phone: t.phone,
        college: t.college || "",
        detailsFinalized: false,
        passwordHash,
        members: [
          {
            name: t.leaderName,
            email: t.email
          }
        ],
        hackathonStart: null,
        sessionEnded: false,
        problemId: "",
        githubUrl: "",
        deploymentUrl: "",
        lastActiveAt: null
      });

      console.log(`✅ Created ${t.teamId}`);
    }

    console.log("🎉 All teams imported");
    process.exit(0);
  });
