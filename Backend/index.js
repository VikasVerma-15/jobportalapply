import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";
dotenv.config({});
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const parseAllowedOrigins = () => {
  const fromEnv = (process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const defaults = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://jobport-mern.vercel.app",
    "https://jobportalapply.vercel.app",
  ];
  return [...new Set([...defaults, ...fromEnv])];
};

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = parseAllowedOrigins();
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 
const PORT = process.env.PORT || 5001;

 
//api's

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

if(process.env.NODE_ENV==="production"){
  const dirpath=path.resolve();
  app.use(express.static('./Frontend/dist'));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(dirpath,'./Frontend/dist','index.html'))
  });
}


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
