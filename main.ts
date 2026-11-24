// One Word From Your Ex — make.fun entry
// The word an ex would use to describe the entrant: "unread".
// It lands two ways at once: the messages left unread, and a person
// nobody ever really read. Painfully honest, instantly relatable,
// and it could not be swapped for a near synonym without losing the sting.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "unread";

// Gate: entry must be UTF-8 text of 1 to 24 characters, exactly one word,
// not only white space — enforced here before anything is written.
function checkGate(word: string): void {
  const points = [...word];
  if (points.length < 1 || points.length > 24) {
    throw new Error(`gate failed: ${points.length} code points, need 1-24`);
  }
  if (word.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (/\s/.test(word)) {
    throw new Error("gate failed: entry must be exactly one word");
  }
}

checkGate(WORD);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD + "\n", "utf8");

// Read back and verify: the file holds exactly the word, plus a newline.
const back = readFileSync(outPath, "utf8");
const body = back.replace(/\n$/, "");
if (body !== WORD) {
  throw new Error(`read-back mismatch: wrote ${JSON.stringify(WORD)}, read ${JSON.stringify(body)}`);
}
const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`wrote ${outPath} (${[...WORD].length} code points, sha256 ${sha256}), verified: ${JSON.stringify(WORD)}`);
