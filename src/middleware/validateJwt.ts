import { Response, NextFunction, RequestHandler } from "express";
import moment from "moment";
import jwt from "jsonwebtoken";

import { ProtectedRequest } from "../types";
import { UnauthorizedError } from "../exceptions";
import { ACCESS_TOKEN_SECRET } from "../config";
import { UserService, PharmacyService } from "../services";

const user = new UserService();
const pharmacy = new PharmacyService();

export default function (): RequestHandler {
  return async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization)
        throw new UnauthorizedError(`No authorization headers passed`);

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (!bearer || !token)
        throw new UnauthorizedError(
          `Token not passed in authorization headers`
        );

      if (bearer !== "Bearer")
        throw new UnauthorizedError(
          `Bearer not passed in authorization headers`
        );

      const decoded: any = jwt.verify(token, String(ACCESS_TOKEN_SECRET));

      let resource;

      if (decoded.resourceType === "user") {
        resource = await user.getUserById(decoded.id);
        req.user = resource;
      } else if (decoded.resourceType === "pharmacy") {
        resource = await pharmacy.getPharmacyById(decoded.id);
        req.pharmacy = resource;
      }

      if (!resource) throw new UnauthorizedError(`Resource recently deleted!`);

      if (
        resource.lastSensitiveInfoUpdateTime &&
        moment(decoded.iat).isBefore(resource.lastSensitiveInfoUpdateTime)
      )
        throw new UnauthorizedError(
          `Sensitive information changed recently, please log in again!`
        );

      // console.log("RESOURCE", resource)

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
