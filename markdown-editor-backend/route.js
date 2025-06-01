import * as express from 'express';
import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import FileRoute from "./routes/files.route.js";

const router = express.Router();

router.use("/user", UserRoute);
router.use("/auth", AuthRoute);
router.use("/file", FileRoute); 

export { router };