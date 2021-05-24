import axios from "axios";

export const fetchMe = () =>
  axios(`${process.env.BASE_URL}/api/me`).then((res) => res.data);
