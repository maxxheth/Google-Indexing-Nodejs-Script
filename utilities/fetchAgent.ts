import HttpsProxyAgent from "https-proxy-agent/dist/agent";
import type { Agent } from "https";

export default function fetchAgent(proxy: string = ""): Agent | undefined {
  if (!proxy) return;
  return !!proxy ? new HttpsProxyAgent(proxy) : undefined;
}
