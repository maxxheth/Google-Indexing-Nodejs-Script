import randomlyPluckCreds from "../utilities/randomlyPluckCreds";
import fetchAgent from "../utilities/fetchAgent";
import fetch from "node-fetch";
import { expose } from "threads";
import type { ApiCreds } from "../typedefs";

expose({
  MobileFriendly({ key, keys, url, urls, proxy, proxies, cb }: ApiCreds) {
    const { selectedKey, selectedProxy, selectedUrl } = randomlyPluckCreds({
      url,
      urls,
      key,
      keys,
      proxy,
      proxies,
    });

    const agent = fetchAgent(selectedProxy);

    if (!selectedKey && selectedUrl === "") return;

    const endpoint = process.env.TESTING
      ? `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key=${selectedKey}`
      : `${process.env.MOCK_API_URI}/mobile-friendly`;

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: selectedUrl,
      }),
      agent,
    };

    (async () => {
      const response = await fetch(endpoint, options);

      if (!cb) return;

      cb(response);
    })();
  },
});
