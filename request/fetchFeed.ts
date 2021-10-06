import { request } from "../lib/request";
import { FetchFeedResponse } from "../services/api/FeedService";
import qs from "query-string";

export const fetchFeed = ({
  cursor,
}: {
  cursor?: number;
}): Promise<FetchFeedResponse> =>
  request(`/api/feed?${qs.stringify({ cursor })}`).then((res) => res.data);
