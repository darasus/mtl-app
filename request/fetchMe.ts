import axios from "axios";

export const fetchMe = () => axios("/api/me").then((res) => res.data);
