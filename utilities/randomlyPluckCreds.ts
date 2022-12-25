import randomize from "./randomize";

import type { ApiCreds } from "../typedefs";

export default function randomlyPluckCreds({
  key,
  keys,
  url,
  urls,
  proxy,
  proxies,
}: ApiCreds) {
  let selectedKey,
    selectedProxy,
    selectedUrl = "";

  if (keys) {
    selectedKey = key ?? keys[randomize(keys)]; // Choose a random key if one wasn't chosen.
  }

  if (urls) {
    selectedUrl = url ?? urls[randomize(urls)];
  }

  if (!proxy && proxies) {
    selectedProxy = proxies[randomize(proxies)];
  }

  return {
    selectedKey,
    selectedProxy,
    selectedUrl,
  };
}
