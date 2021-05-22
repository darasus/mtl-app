import { User } from ".prisma/client";
import React from "react";

export const Me = React.createContext<User | null>(null);
