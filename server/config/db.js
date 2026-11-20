import dns from "node:dns";
import mongoose from "mongoose";

if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const resolveDnsOverHttps = async (name, type) => {
  const url = new URL("https://cloudflare-dns.com/dns-query");
  url.searchParams.set("name", name);
  url.searchParams.set("type", type);

  const response = await fetch(url, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`DNS-over-HTTPS request failed with status ${response.status}`);
  }

  const result = await response.json();
  if (result.Status !== 0 && result.Status !== 3) {
    throw new Error(`DNS-over-HTTPS lookup failed with status ${result.Status}`);
  }

  return result.Answer ?? [];
};

const resolveMongoSrvUri = async (uri) => {
  const parsedUri = new URL(uri);
  if (parsedUri.protocol !== "mongodb+srv:") return uri;

  const srvName = `_mongodb._tcp.${parsedUri.hostname}`;
  let lookupTimeout;
  try {
    await Promise.race([
      dns.promises.resolveSrv(srvName),
      new Promise((_, reject) => {
        lookupTimeout = setTimeout(() => reject(new Error("DNS lookup timed out")), 1500);
      }),
    ]);
    return uri;
  } catch (error) {
    console.warn(
      `MongoDB SRV DNS lookup failed (${error.code ?? error.message}); retrying over HTTPS.`,
    );
  } finally {
    clearTimeout(lookupTimeout);
  }

  const srvRecords = await resolveDnsOverHttps(srvName, "SRV");
  if (srvRecords.length === 0) {
    throw new Error("No MongoDB SRV records were returned.");
  }

  const hosts = srvRecords.map(({ data }) => {
    const [, , port, target] = data.trim().split(/\s+/);
    const host = target?.replace(/\.$/, "").toLowerCase();
    const clusterHost = parsedUri.hostname.toLowerCase();
    const parentDomain = clusterHost.split(".").slice(1).join(".");

    if (!host || !host.endsWith(`.${parentDomain}`)) {
      throw new Error("MongoDB SRV record returned an unexpected host.");
    }

    if (!Number.isInteger(Number(port)) || Number(port) < 1 || Number(port) > 65535) {
      throw new Error("MongoDB SRV record returned an invalid port.");
    }

    return `${host}:${port}`;
  });

  const txtRecords = await resolveDnsOverHttps(parsedUri.hostname, "TXT");
  if (txtRecords.length > 1) {
    throw new Error("Multiple MongoDB TXT records were returned.");
  }

  const txtOptions = new URLSearchParams(
    txtRecords[0]?.data.replace(/^"|"$/g, "") ?? "",
  );
  const allowedTxtOptions = new Set(["authSource", "replicaSet", "loadBalanced"]);
  for (const [key, value] of txtOptions) {
    if (!allowedTxtOptions.has(key) || !value) {
      throw new Error("MongoDB TXT record contains an unsupported option.");
    }
  }

  const uriOptions = new URLSearchParams(parsedUri.search);
  for (const key of new Set(uriOptions.keys())) {
    txtOptions.delete(key);
  }
  const combinedOptions = new URLSearchParams([...txtOptions, ...uriOptions]);
  if (!combinedOptions.has("tls")) combinedOptions.set("tls", "true");

  const credentials = parsedUri.username
    ? `${parsedUri.username}${parsedUri.password ? `:${parsedUri.password}` : ""}@`
    : "";
  const database = parsedUri.pathname || "/";

  return `mongodb://${credentials}${hosts.join(",")}${database}?${combinedOptions}`;
};

export const connectDB = async () => {
  try {
    // Automatically strips dangerous '$' query operators (NoSQL injection defense)
    mongoose.set("sanitizeFilter", true);

    const mongoUri = await resolveMongoSrvUri(process.env.MONGO_URI);
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
