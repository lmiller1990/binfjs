import fs from "node:fs";

class Sequence {
  name: string;
  chars: string;

  constructor(name: string, chars: string) {
    this.name = name;
    this.chars = chars;
  }

  get alphabet() {
    // TODO - make more robust
    return new Set(this.chars);
  }
}

function readFastaFile() {
  const data = fs.readFileSync("../data/chipseq_tiny.fa", "utf8");

  const chunks = data.split("\n").filter((x) => Boolean(x));

  const seqs: Sequence[] = [];

  for (let i = 0; i < chunks.length; i += 2) {
    let name = chunks[i];
    let chars = chunks[i + 1];
    seqs.push(new Sequence(name, chars));
  }
  return seqs;
}

class Distrib {
  alphabet: Set<string>;
  count: Record<string, number> = {};
  total: number = 0;

  constructor(alphabet: Set<string>, pseudo: number = 0) {
    this.alphabet = alphabet;
    for (const char of alphabet) {
      if (!(char in this.count)) {
        this.count[char] = 0;
      }
      this.total += 1;
      this.count[char] += 1;
    }
  }

  prettyPrint() {
    let s = `< `;
    s += [...this.alphabet.keys()]
      .map((c) => `${c}=${this.count[c] / this.total} `)
      .join("");
    s += `>`;
    return s;
  }
}

function rand(high: number) {
  return Math.ceil(Math.random() * high);
}

class GibbsMotif {
  seqs: Sequence[];
  motifLength: number;
  alignment: number[];
  alphabet: Set<string>;

  constructor(seqs: Sequence[], motifLength: number) {
    this.seqs = seqs;
    this.motifLength = motifLength;
    this.alphabet = seqs[0].alphabet;
    this.alignment = Array(seqs.length)
      .fill(null)
      .map((_) => rand(14 - motifLength));
  }

  discover(iter: number) {
    const pseudocount = new Distrib(this.alphabet, 1);
    const W = this.motifLength;
    const N = this.seqs.length;

    // assume fg is uniform
    const q = Array(W)
      .fill(null)
      .map((_) => new Distrib(this.alphabet));

    // pick a random sequence to withhold
    const newZ = rand(N - 1);

    // TODO:
    // Sample fg and bg inital data
    // then...
    // Loop for iter times
    // Get prob for fg/bg (bg for all, fg only within sliding window)
    // sliding window start is randomly assigned, that's this.alignment
    // normalize qx/px
    // save aligment
    // finish iters and return!
  }
}

function gibbsMotif() {
  const seqs = readFastaFile();
  const gibbs = new GibbsMotif(seqs, 4);
  gibbs.discover(1000);
}

gibbsMotif();
