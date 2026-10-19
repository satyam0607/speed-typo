import { SyntaxWord } from '../types';

export const SYNTAX_DICTIONARY: SyntaxWord[] = [
  // Kids Tier (6-10 years old) - Easy Words
  {
    id: 'kid-robot',
    term: 'robot',
    language: 'all',
    category: 'concept',
    difficulty: 'beginner',
    tier: 'kids',
    definition: 'A smart machine that follows your step-by-step code instructions to do tasks!',
    explanation: 'Robots obey the code you write. You can tell a robot to move forward, turn, play music, or draw a picture on screen.',
    exampleSnippet: 'robot.moveForward(10);\nrobot.say("Beep boop, I love code!");\nrobot.glow("cyan");',
    proTip: 'Computers do not guess — robots follow each step exactly in order!'
  },
  {
    id: 'kid-loop',
    term: 'loop',
    language: 'all',
    category: 'keyword',
    difficulty: 'beginner',
    tier: 'kids',
    definition: 'A magic repeat button that runs your code instructions over and over without rewriting them.',
    explanation: 'Instead of typing jump() five times, you put it in a loop: repeat 5 times { jump() }! It saves time and makes coding fun.',
    exampleSnippet: 'repeat 5 times:\n  jump(height=20)\n  play_sound("tada!")',
    proTip: 'Loops make animations and video game characters walk smoothly across the screen!'
  },
  {
    id: 'kid-pixel',
    term: 'pixel',
    language: 'html-css',
    category: 'concept',
    difficulty: 'beginner',
    tier: 'kids',
    definition: 'A tiny glowing dot of color on your screen. Millions of pixels make up your favorite games!',
    explanation: 'Every game character, button, and photo is made of tiny square pixels colored red, green, blue, and yellow.',
    exampleSnippet: 'draw_pixel(x=10, y=20, color="emerald");',
    proTip: 'Games like Minecraft use big pixel blocks for their cool blocky style!'
  },
  {
    id: 'kid-bug',
    term: 'bug & debug',
    language: 'all',
    category: 'concept',
    difficulty: 'beginner',
    tier: 'kids',
    definition: 'A bug is a tiny mistake in your code. Debugging means finding it like a detective and fixing it!',
    explanation: 'Every programmer creates bugs! When code does not work, you read the instructions carefully to find the puzzle piece that needs fixing.',
    exampleSnippet: '// Bug: hero speed was zero!\nhero.speed = 10; // Fixed! Now hero runs fast.',
    proTip: 'In 1947, engineers found a real moth trapped inside a giant computer — that is why we call mistakes bugs!'
  },

  // Professional Tier (18+ / Engineers) - Hard & Extreme Hard
  {
    id: 'pro-idempotence',
    term: 'idempotency',
    language: 'all',
    category: 'pattern',
    difficulty: 'advanced',
    tier: 'pro',
    definition: 'A mathematical and systems property where an operation yields identical state whether applied once or repeated N times.',
    explanation: 'Crucial for network distributed systems, billing operations, and message queues where network timeouts may cause duplicate request retries.',
    exampleSnippet: 'app.post("/payments/charge", withIdempotencyKey(req), async (req, res) => {\n  const receipt = await stripe.charges.create(req.payload);\n  return res.json(receipt);\n});',
    proTip: 'HTTP PUT and DELETE are idempotent by specification; POST requires idempotency keys in header.'
  },
  {
    id: 'pro-concurrency',
    term: 'concurrency & CAS',
    language: 'cpp',
    category: 'concept',
    difficulty: 'advanced',
    tier: 'pro',
    definition: 'Interleaved simultaneous task execution with lock-free atomic compare-and-swap (CAS) memory synchronization.',
    explanation: 'Prevents CPU cache thrashing and deadlocks in multi-core distributed architectures without blocking kernel threads.',
    exampleSnippet: 'std::atomic<uint64_t> sequence{0};\nuint64_t current = sequence.load(std::memory_order_relaxed);\nwhile (!sequence.compare_exchange_weak(current, current + 1)) {}',
    proTip: 'Prefer sequential consistency or explicit acquire-release semantics over raw volatile.'
  },

  // JavaScript & TypeScript
  {
    id: 'js-async-await',
    term: 'async / await',
    language: 'javascript',
    category: 'keyword',
    difficulty: 'beginner',
    definition: 'Syntactic sugar built on Promises to write asynchronous code sequentially.',
    explanation: 'The async keyword declares that a function returns a Promise, while await pauses execution until the Promise settles without blocking the event loop thread.',
    exampleSnippet: 'async function fetchUser(id: string) {\n  const res = await api.get(`/users/${id}`);\n  return res.data;\n}',
    proTip: 'Always wrap awaits in try/catch or chain a .catch() handler to prevent unhandled promise rejections.'
  },
  {
    id: 'js-destructuring',
    term: 'destructuring assignment',
    language: 'javascript',
    category: 'pattern',
    difficulty: 'beginner',
    definition: 'An expression unpacking values from arrays or properties from objects into distinct variables.',
    explanation: 'Destructuring reduces boilerplate accessors like obj.user.id and allows inline defaults, nested property extraction, and rest parameter gathering.',
    exampleSnippet: 'const { id, name, role = "guest", ...metadata } = userPayload;',
    proTip: 'You can rename keys inline during destructuring: const { id: userId } = props;'
  },
  {
    id: 'ts-generics',
    term: 'generics <T>',
    language: 'typescript',
    category: 'concept',
    difficulty: 'intermediate',
    definition: 'A mechanism to create reusable components that can work over a variety of types rather than a single one.',
    explanation: 'Generics capture the argument type provided by callers, preserving full static type safety across data containers, APIs, and transformation pipelines.',
    exampleSnippet: 'function wrapInArray<T>(item: T): T[] {\n  return [item];\n}',
    proTip: 'Constrain generics using the extends keyword: <T extends { id: string }> to enforce minimum shape.'
  },
  {
    id: 'js-optional-chaining',
    term: 'optional chaining (?.)',
    language: 'javascript',
    category: 'operator',
    difficulty: 'beginner',
    definition: 'Safe member access operator that returns undefined instead of throwing a TypeError if an operand is nullish.',
    explanation: 'Replaces nested truthiness checks like (user && user.profile && user.profile.avatar) with a concise, declarative syntax.',
    exampleSnippet: 'const avatarUrl = user?.profile?.avatar?.thumbnail ?? "/default.png";',
    proTip: 'Works on functions and dynamic indices too: obj.handler?.() or list?.[0]'
  },
  {
    id: 'js-nullish-coalescing',
    term: 'nullish coalescing (??)',
    language: 'javascript',
    category: 'operator',
    difficulty: 'beginner',
    definition: 'A logical operator returning its right-hand operand when its left is null or undefined, unlike || which checks all falsy values.',
    explanation: 'Prevents unintentional overrides when legitimate values are 0, false, or empty string "", which || mistakenly discards.',
    exampleSnippet: 'const timeoutMs = config.timeout ?? 3000;\nconst count = input.count ?? 0;',
    proTip: 'Cannot combine directly with && or || without explicit parentheses.'
  },
  {
    id: 'js-closure',
    term: 'closure',
    language: 'javascript',
    category: 'concept',
    difficulty: 'intermediate',
    definition: 'A function bundled together with references to its surrounding lexical state (lexical environment).',
    explanation: 'Closures give inner functions access to an outer function scope even after the outer function has finished executing, enabling data encapsulation.',
    exampleSnippet: 'function createCounter(step = 1) {\n  let count = 0;\n  return () => (count += step);\n}',
    proTip: 'Be mindful of memory: retaining closures with large parent scopes can prevent garbage collection.'
  },
  {
    id: 'ts-utility-partial-record',
    term: 'Record<K, V> & Partial<T>',
    language: 'typescript',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'TypeScript utility types for mapping key-value objects and making all properties optional.',
    explanation: 'Partial<T> is essential for patch/update payloads, while Record<K, V> strongly types lookup dictionaries and cache structures.',
    exampleSnippet: 'type UserUpdates = Partial<User>;\ntype CacheMap = Record<string, UserUpdates>;',
    proTip: 'Combine with Pick<T, K> or Omit<T, K> to tailor exact subsets of larger domain interfaces.'
  },

  // Python
  {
    id: 'py-list-comprehension',
    term: 'list comprehension',
    language: 'python',
    category: 'pattern',
    difficulty: 'beginner',
    definition: 'A concise, optimized way to construct new lists from existing iterables based on conditional logic.',
    explanation: 'Combines iteration, filtering, and mapping in a single C-optimized statement, executing faster than manual for-loops appending to lists.',
    exampleSnippet: 'squares = [x**2 for x in range(10) if x % 2 == 0]',
    proTip: 'Keep comprehensions to a single line or split across readable clauses; if nested more than 2 levels, prefer a standard loop.'
  },
  {
    id: 'py-context-manager',
    term: 'context manager (with)',
    language: 'python',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'A protocol (__enter__ and __exit__) for reliable resource allocation and automated teardown.',
    explanation: 'Guarantees file descriptors, database connections, and locks are safely released even if uncaught exceptions occur inside the block.',
    exampleSnippet: 'with open("metrics.log", mode="a", encoding="utf-8") as f:\n    f.write(f"timestamp: {now}\\n")',
    proTip: 'Use contextlib.contextmanager to convert simple generator functions with yield into context managers effortlessly.'
  },
  {
    id: 'py-decorator',
    term: 'decorator (@functools.wraps)',
    language: 'python',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'A higher-order function that takes another function and extends its behavior without explicitly modifying it.',
    explanation: 'Commonly applied for authentication guards, timing/metrics, caching (@cache/@lru_cache), and route handlers in frameworks.',
    exampleSnippet: 'import functools, time\n\ndef timed(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        res = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")\n        return res\n    return wrapper',
    proTip: 'Always use @functools.wraps(func) on wrapper to preserve docstrings and __name__.'
  },
  {
    id: 'py-generators-yield',
    term: 'generator & yield',
    language: 'python',
    category: 'concept',
    difficulty: 'intermediate',
    definition: 'A function that produces a sequence of values lazily on demand using the yield keyword.',
    explanation: 'Generators yield execution control back to callers without storing the entire collection in RAM, enabling processing of multi-gigabyte streams.',
    exampleSnippet: 'def read_chunks(file_obj, chunk_size=4096):\n    while chunk := file_obj.read(chunk_size):\n        yield chunk',
    proTip: 'Use generator expressions (x for x in stream) when feeding functions like sum() or any() for zero allocation.'
  },
  {
    id: 'py-walrus-operator',
    term: 'walrus operator (:=)',
    language: 'python',
    category: 'operator',
    difficulty: 'intermediate',
    definition: 'Assignment expression syntax allowing assignment of variables inside expressions.',
    explanation: 'Eliminates repetitive calls or awkward pre-assignments before while loops, if statements, and comprehensions.',
    exampleSnippet: 'if (n := len(items)) > 10:\n    print(f"Batch size {n} exceeds threshold")',
    proTip: 'Particularly clean in regex matching: if match := re.search(pattern, text): process(match.group(1))'
  },

  // Rust
  {
    id: 'rs-ownership-borrowing',
    term: 'ownership & borrowing (&mut)',
    language: 'rust',
    category: 'concept',
    difficulty: 'advanced',
    definition: 'Rust’s compile-time memory safety model governed by strict ownership rules without garbage collection.',
    explanation: 'Each value has an owner; you can have either any number of immutable references (&T) OR exactly one mutable reference (&mut T) at any time.',
    exampleSnippet: 'fn append_timestamp(log: &mut String) {\n    log.push_str(" [ok]");\n}',
    proTip: 'The borrow checker prevents data races and dangling pointers entirely at compile-time with zero runtime overhead.'
  },
  {
    id: 'rs-match-pattern',
    term: 'pattern matching (match)',
    language: 'rust',
    category: 'keyword',
    difficulty: 'intermediate',
    definition: 'An exhaustive control flow construct that matches expressions against rich patterns and destructures them.',
    explanation: 'The Rust compiler guarantees all possible states (e.g. Option, Result, enum variants) are handled, preventing unhandled edge cases.',
    exampleSnippet: 'match parse_version(raw) {\n    Ok(v) => println!("Version: {v}"),\n    Err(e) => eprintln!("Parse failed: {e}"),\n}',
    proTip: 'Use the ? operator for early propagation of Result::Err without manual match boilerplate.'
  },
  {
    id: 'rs-option-result',
    term: 'Option<T> & Result<T, E>',
    language: 'rust',
    category: 'data-structure',
    difficulty: 'beginner',
    definition: 'Standard algebraic data types for handling absence (None) and recoverable failures (Err).',
    explanation: 'Replaces dangerous null pointer exceptions with explicit enum types that must be consciously unpacked or propagated.',
    exampleSnippet: 'fn divide(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 { Err("Division by zero".into()) }\n    else { Ok(a / b) }\n}',
    proTip: 'Chain combinators like .map(), .and_then(), and .unwrap_or_else() for clean functional pipelines.'
  },

  // Go
  {
    id: 'go-goroutines',
    term: 'goroutine (go func)',
    language: 'go',
    category: 'concept',
    difficulty: 'intermediate',
    definition: 'An extremely lightweight thread of execution managed by the Go runtime scheduler.',
    explanation: 'Goroutines start with only a few kilobytes of stack space that grow dynamically, allowing single servers to handle hundreds of thousands of concurrent tasks.',
    exampleSnippet: 'go func(task Task) {\n    err := task.Execute()\n    results <- err\n}(currentTask)',
    proTip: 'Always pass loop variables explicitly as arguments to avoid race conditions capturing the outer pointer.'
  },
  {
    id: 'go-defer',
    term: 'defer cleanup',
    language: 'go',
    category: 'keyword',
    difficulty: 'beginner',
    definition: 'Schedules a function call to execute immediately before the surrounding function returns.',
    explanation: 'Ensures file closes, mutex unlocks, and connection pools cleanup right next to where they were acquired, preventing resource leaks.',
    exampleSnippet: 'resp, err := http.Get(url)\nif err != nil { return err }\ndefer resp.Body.Close()',
    proTip: 'Deferred calls are executed in Last-In-First-Out (LIFO) stack order.'
  },
  {
    id: 'go-channel',
    term: 'channel (chan <-)',
    language: 'go',
    category: 'data-structure',
    difficulty: 'intermediate',
    definition: 'Typed conduits through which concurrent goroutines communicate and synchronize without locks.',
    explanation: 'Follows Go’s philosophy: "Do not communicate by sharing memory; instead, share memory by communicating."',
    exampleSnippet: 'ch := make(chan int, 4)\nch <- 42\nval := <-ch',
    proTip: 'Closing a channel signals receivers: for msg := range ch drains the channel until closed.'
  },

  // SQL
  {
    id: 'sql-window-func',
    term: 'window function (OVER)',
    language: 'sql',
    category: 'concept',
    difficulty: 'advanced',
    definition: 'Calculations across a set of table rows that are related to the current row without collapsing rows like GROUP BY.',
    explanation: 'Crucial for running totals, moving averages, rankings (ROW_NUMBER, RANK, DENSE_RANK), and lead/lag trend comparisons.',
    exampleSnippet: 'SELECT id, department, salary,\n  ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) as rank\nFROM employees;',
    proTip: 'Use LAG() and LEAD() with window functions to compute period-over-period delta changes effortlessly.'
  },
  {
    id: 'sql-cte',
    term: 'CTE (WITH clause)',
    language: 'sql',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'Common Table Expressions define temporary named result sets within the execution scope of a single statement.',
    explanation: 'Transforms unreadable nested subqueries into clean modular pipelines, and supports recursive queries for hierarchical tree data.',
    exampleSnippet: 'WITH active_users AS (\n  SELECT id, email FROM users WHERE status = "active"\n)\nSELECT count(*) FROM active_users;',
    proTip: 'Recursive CTEs (WITH RECURSIVE) are the standard SQL pattern for org charts, file trees, and graph traversal.'
  },
  {
    id: 'sql-coalesce',
    term: 'COALESCE()',
    language: 'sql',
    category: 'method',
    difficulty: 'beginner',
    definition: 'Returns the first non-null argument from a list of expressions.',
    explanation: 'Essential for providing fallback values in database reporting when columns or left-joined records contain NULL.',
    exampleSnippet: 'SELECT name, COALESCE(phone, email, "No contact info") as contact\nFROM clients;',
    proTip: 'COALESCE evaluates arguments lazily, stopping at the first non-null expression.'
  },

  // C++
  {
    id: 'cpp-smart-pointers',
    term: 'std::unique_ptr & std::make_unique',
    language: 'cpp',
    category: 'concept',
    difficulty: 'intermediate',
    definition: 'Smart pointer owning and managing another object through a pointer and disposing of that object when out of scope.',
    explanation: 'Part of modern RAII (Resource Acquisition Is Initialization), eliminating manual delete calls and dangling memory leaks.',
    exampleSnippet: 'auto widget = std::make_unique<Widget>("primary");\nwidget->render();',
    proTip: 'std::unique_ptr cannot be copied, only moved via std::move(), guaranteeing single ownership.'
  },
  {
    id: 'cpp-constexpr',
    term: 'constexpr',
    language: 'cpp',
    category: 'keyword',
    difficulty: 'advanced',
    definition: 'Specifies that the value of an object or return value of a function can be computed at compile-time.',
    explanation: 'Shifts complex mathematical tables, string hashes, and lookups into compilation phase for blazing-fast zero-runtime execution.',
    exampleSnippet: 'constexpr int factorial(int n) {\n    return n <= 1 ? 1 : n * factorial(n - 1);\n}',
    proTip: 'In C++20, consteval enforces that a function must evaluate at compile-time without fallback to runtime.'
  },

  // HTML & CSS
  {
    id: 'css-grid-autofit',
    term: 'grid repeat(auto-fit, minmax())',
    language: 'html-css',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'A responsive CSS Grid pattern that creates dynamic multi-column layouts without requiring media queries.',
    explanation: 'Browser automatically calculates how many columns fit based on minimum card width, expanding them to fill remaining space.',
    exampleSnippet: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\ngap: 1.5rem;',
    proTip: 'Use auto-fill when you want empty column tracks preserved rather than stretching existing items.'
  },
  {
    id: 'css-clamp',
    term: 'clamp(min, preferred, max)',
    language: 'html-css',
    category: 'method',
    difficulty: 'beginner',
    definition: 'A CSS mathematical function that clamps a middle value between an allowed minimum and maximum boundary.',
    explanation: 'Enables fluid responsive typography and fluid spacing that scales naturally with viewport width without jumping at breakpoints.',
    exampleSnippet: 'font-size: clamp(1.25rem, 2.5vw + 0.5rem, 3rem);\npadding: clamp(1rem, 4vw, 3rem);',
    proTip: 'Always use rem units for the min and max to respect user accessibility font scaling preferences.'
  },

  // Git & Bash
  {
    id: 'git-interactive-rebase',
    term: 'git rebase -i',
    language: 'git-bash',
    category: 'keyword',
    difficulty: 'intermediate',
    definition: 'Interactive rebase tool for rewriting, combining, editing, and cleaning up commit history before merging.',
    explanation: 'Lets developers squash experimental "wip" commits, edit commit messages, or reorder changes into a clean atomic PR story.',
    exampleSnippet: 'git rebase -i HEAD~4\n# pick, squash, fixup, reword commits',
    proTip: 'Never rebase commits that have already been pushed to a shared production branch.'
  },
  {
    id: 'bash-pipe-grep',
    term: 'pipe & xargs ( | xargs )',
    language: 'git-bash',
    category: 'pattern',
    difficulty: 'intermediate',
    definition: 'Command-line piping mechanism to redirect stdout stream as command line arguments to subsequent utilities.',
    explanation: 'Empowers rapid shell automation to filter processes, search directories, and batch-rename thousands of files in one command.',
    exampleSnippet: 'find . -name "*.log" -type f | xargs rm -f',
    proTip: 'Use -print0 with find and xargs -0 to safely handle filenames with spaces and special symbols.'
  }
];

export const KEYWORD_SPEED_WORDS: Record<string, string[]> = {
  all: [
    'async', 'await', 'return', 'function', 'const', 'let', 'interface', 'export', 'import',
    'def', 'class', 'lambda', 'yield', 'decorator', 'enumerate', 'comprehension',
    'fn', 'mut', 'struct', 'impl', 'match', 'enum', 'pub', 'trait', 'unwrap',
    'chan', 'goroutine', 'defer', 'select', 'package', 'range', 'panic',
    'template', 'constexpr', 'nullptr', 'namespace', 'vector', 'unique_ptr',
    'SELECT', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LIMIT', 'COALESCE',
    'flex', 'grid', 'margin', 'padding', 'display', 'border-radius', 'z-index',
    'commit', 'checkout', 'rebase', 'merge', 'cherry-pick', 'status', 'stash'
  ],
  javascript: [
    'async', 'await', 'const', 'let', 'return', 'function', 'class', 'import', 'export',
    'default', 'promise', 'resolve', 'reject', 'typeof', 'instanceof', 'prototype',
    'filter', 'reduce', 'forEach', 'flatMap', 'setTimeout', 'clearInterval', 'JSON.parse'
  ],
  typescript: [
    'interface', 'type', 'readonly', 'unknown', 'never', 'any', 'extends', 'implements',
    'as const', 'keyof', 'infer', 'Partial', 'Record', 'Pick', 'Omit', 'Exclude'
  ],
  python: [
    'def', 'return', 'class', 'import', 'from', 'as', 'lambda', 'yield', 'with', 'open',
    'try', 'except', 'finally', 'raise', 'assert', 'pass', 'isinstance', 'enumerate'
  ],
  rust: [
    'fn', 'let mut', 'struct', 'enum', 'impl', 'trait', 'pub', 'match', 'use', 'mod',
    'Result', 'Option', 'Some', 'None', 'Ok', 'Err', 'unwrap', 'clone', 'to_string'
  ],
  go: [
    'package', 'import', 'func', 'var', 'type', 'struct', 'interface', 'chan', 'go',
    'defer', 'select', 'case', 'fallthrough', 'make', 'len', 'append', 'cap', 'nil'
  ],
  cpp: [
    'template', 'typename', 'constexpr', 'nullptr', 'auto', 'std::vector', 'std::string',
    'std::unique_ptr', 'std::shared_ptr', 'std::move', 'public', 'private', 'virtual'
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'GROUP BY', 'HAVING',
    'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'INSERT INTO', 'UPDATE', 'DELETE', 'COALESCE'
  ],
  'html-css': [
    'display', 'flex-direction', 'justify-content', 'align-items', 'grid-template-columns',
    'border-radius', 'box-shadow', 'overflow-hidden', 'position-relative', 'z-index'
  ],
  'git-bash': [
    'git status', 'git checkout -b', 'git commit -m', 'git push origin', 'git rebase -i',
    'git stash pop', 'git log --oneline', 'chmod +x', 'grep -rn', 'curl -sSL'
  ]
};

import { SegmentTier } from '../types';

export interface SegmentDetails {
  id: SegmentTier;
  title: string;
  ageRange: string;
  difficultyLabel: string;
  badge: string;
  description: string;
  sampleWords: string[];
  words: string[];
}

export const SEGMENT_CONFIG: Record<SegmentTier, SegmentDetails> = {
  kids: {
    id: 'kids',
    title: 'Kids Coding',
    ageRange: '6 – 10 Years Old',
    difficultyLabel: 'Easy Words',
    badge: 'Beginner Friendly',
    description: 'Fun, easy computing words and simple concepts to help young kids learn typing speed and building blocks.',
    sampleWords: ['code', 'loop', 'play', 'robot', 'game', 'step', 'draw'],
    words: [
      'code', 'loop', 'play', 'robot', 'game', 'step', 'draw', 'move', 'jump',
      'star', 'hero', 'click', 'color', 'start', 'stop', 'sound', 'score', 'block',
      'turtle', 'turn', 'grid', 'pixel', 'speed', 'right', 'left', 'glow', 'fire',
      'help', 'math', 'quiz', 'dance', 'ball', 'bounce', 'coin', 'level', 'bonus',
      'power', 'shape', 'card', 'team', 'mouse', 'press', 'show', 'hide', 'beep'
    ]
  },
  teens: {
    id: 'teens',
    title: 'Teens & Students',
    ageRange: '10 – 18 Years Old',
    difficultyLabel: 'Medium (Easy & Hard Mix)',
    badge: 'Intermediate Mix',
    description: 'A balanced blend of introductory coding keywords, variables, game logic, parameters, and web tags.',
    sampleWords: ['variable', 'function', 'python', 'boolean', 'array', 'animate'],
    words: [
      'variable', 'function', 'python', 'boolean', 'string', 'number', 'array',
      'canvas', 'random', 'animate', 'button', 'player', 'event', 'timer', 'sprite',
      'physics', 'import', 'return', 'console', 'syntax', 'modulo', 'object',
      'condition', 'parameter', 'argument', 'element', 'selector', 'listener',
      'handler', 'index', 'length', 'slice', 'concat', 'filter', 'integer', 'float',
      'render', 'update', 'package', 'command', 'terminal', 'constant', 'database'
    ]
  },
  pro: {
    id: 'pro',
    title: 'Professional Devs',
    ageRange: '18+ / Production Engineers',
    difficultyLabel: 'Hard & Extreme Hard',
    badge: 'Extreme Velocity',
    description: 'High-intensity production terminology, concurrency, distributed systems, memory models, and algorithmic vocabulary.',
    sampleWords: ['polymorphism', 'concurrency', 'idempotent', 'destructuring', 'serialization'],
    words: [
      'polymorphism', 'concurrency', 'asynchronous', 'microservices', 'idempotent',
      'destructuring', 'goroutine', 'immutability', 'memoization', 'serialization',
      'cryptography', 'eigenvalue', 'backpropagation', 'reconciliation', 'quicksort',
      'dijkstra', 'interoperability', 'dereference', 'multithreading', 'orchestration',
      'heterogeneous', 'determinism', 'virtualization', 'idempotency', 'distributed',
      'encapsulation', 'lexical_scope', 'tail_recursion', 'transpilation',
      'linearizability', 'zero_copy', 'atomic_compare_exchange', 'content_addressable',
      'type_inference', 'deadlock_detection', 'event_sourcing', 'actor_model', 'bidirectional'
    ]
  }
};
