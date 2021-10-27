import { Session } from "next-auth";
import { User } from "./User";

export type MeSession = User & Session;
