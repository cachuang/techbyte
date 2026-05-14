#!/usr/bin/env node
// One-shot script to remap releaseDay values for the Day 0 consolidation.
// Safe to delete after concepts.js is verified correct.

import fs from "node:fs";

const path = "data/concepts.js";
let content = fs.readFileSync(path, "utf8");

const mapping = {
  // L1 → Day 0
  "http-basics": 0,
  "network-layers": 0,
  "data-structures": 0,
  "big-o": 0,
  "memory-model": 0,
  "oop-basics": 0,
  "closure": 0,
  "embedding": 0,
  // L2/L3 compressed Day 1-27
  "rest-vs-graphql": 1,
  "webhook-vs-polling": 2,
  "long-polling": 3,
  "sse": 4,
  "websocket": 5,
  "jwt-vs-session": 6,
  "oauth2": 7,
  "rate-limiting": 8,
  "cdn": 9,
  "cache-strategies": 10,
  "load-balancer": 11,
  "tcp-vs-udp": 12,
  "grpc-vs-rest": 13,
  "docker": 14,
  "kubernetes": 15,
  "database-index": 16,
  "hashing-vs-encryption": 17,
  "vector-database": 18,
  "rag": 19,
  "mutability-vs-immutability": 20,
  "composition-vs-inheritance": 21,
  "static-vs-dynamic-typing": 22,
  "garbage-collection": 23,
  "mock-stub-spy": 24,
  "race-condition": 25,
  "idempotency": 26,
  "eventual-consistency": 27,
};

for (const [slug, newDay] of Object.entries(mapping)) {
  const re = new RegExp(
    `(slug:\\s*"${slug}",\\s*\\n\\s*releaseDay:\\s*)\\d+`,
    "g",
  );
  const before = content;
  content = content.replace(re, `$1${newDay}`);
  const matched = before.match(re);
  if (!matched) {
    console.error("NO MATCH for", slug);
    console.error("pattern:", re.source);
    process.exit(1);
  }
  console.log(slug, "→", newDay, matched.length, "occurrence(s)");
}

fs.writeFileSync(path, content);
console.log("done");
