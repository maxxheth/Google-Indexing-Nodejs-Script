import os from "os";
import { google } from "googleapis";
import fetch from "node-fetch";
import randomlyPluckCreds from "../utilities/randomlyPluckCreds";
import HttpsProxyAgent from "https-proxy-agent/dist/agent";
import { expose } from "threads";
import * as dotenv from "dotenv";
import type { ApiCreds, KeySet } from "../typedefs";
import type { Agent } from "https";
dotenv.config();

expose({
  IndexingApi({
    key,
    keys,
    url,
    urls,
    proxy,
    proxies,
    batchUrls = false,
    cb,
  }: ApiCreds) {
    const { selectedKey, selectedProxy, selectedUrl } = randomlyPluckCreds({
      key,
      keys,
      proxy,
      proxies,
      url,
      urls,
    });

    key = selectedKey as KeySet;
    proxy = selectedProxy as string;
    url = selectedUrl;

    let agent: Agent;

    if (proxy) {
      agent = new HttpsProxyAgent(proxy);
    }

    if (!key.client_email || !key.private_key) return;

    const jwtClient = new google.auth.JWT(
      key.client_email,
      undefined,
      key.private_key,
      ["https://www.googleapis.com/auth/indexing"],
      undefined
    );

    const boundary = `===============7330845974216740156==`;

    const eol = os.EOL;

    jwtClient.authorize(async (err, tokens) => {
      if (err) {
        console.log(err);
        return;
      }

      const newUrls = batchUrls && url ? [url] : urls;

      const items = newUrls
        .map((line = "") => {
          return {
            "Content-Type": "application/http",
            "Content-ID": "",
            body:
              "POST /v3/urlNotifications:publish HTTP/1.1\n" +
              "Content-Type: application/json\n\n" +
              JSON.stringify({
                url: line,
                type: "URL_UPDATED",
              }),
          };
        })
        .filter((item) => !!item)
        .map(
          (
            item = {
              "Content-Type": "",
              "Content-ID": "",
              body: "",
            },
            index,
            itemArray
          ) => {
            const ContentType = item["Content-Type"];
            const { body } = item;

            let request = `${eol}--${boundary}${eol}Content-Type: ${ContentType}${eol}${eol}${body}${eol}`;

            if (index === itemArray.length - 1) {
              request += request + `\n--${boundary}--`;
            }
            return request.trim();
          }
        );

      const { TESTING } = process.env;

      const endpoint = TESTING
        ? "https://indexing.googleapis.com/batch"
        : `${process.env.MOCK_API_URI}/indexing-api`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": `multipart/mixed; boundary="${boundary}"`,
          Authorization: `Bearer: ${tokens?.access_token}`,
        },
        body: new Blob(items),
        agent,
      };

      const response = await fetch(endpoint, options);

      if (!cb) return;

      cb(response);
    });
  },
});
