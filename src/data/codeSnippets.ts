import { CodeSnippet } from '../types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  // TypeScript / JavaScript
  {
    id: 'ts-debounce-hook',
    title: 'Debounce Utility Function',
    language: 'typescript',
    difficulty: 'intermediate',
    description: 'Classic debounce higher-order function with typed generic callback.',
    code: `export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}`
  },
  {
    id: 'ts-event-emitter',
    title: 'Typed Event Emitter',
    language: 'typescript',
    difficulty: 'advanced',
    description: 'Strict event bus map with listener unsubscribe tokens.',
    code: `type Handler<T = any> = (payload: T) => void;

class TypedEmitter<Events extends Record<string, any>> {
  private handlers = new Map<keyof Events, Set<Handler>>();

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as Handler);
    return () => this.handlers.get(event)?.delete(handler as Handler);
  }
}`
  },
  {
    id: 'js-array-pipeline',
    title: 'Functional Array Pipeline',
    language: 'javascript',
    difficulty: 'beginner',
    description: 'Chaining map, filter, and reduce with destructuring and arrows.',
    code: `const activeAdminEmails = users
  .filter(({ role, status }) => role === 'admin' && status === 'active')
  .map(({ email }) => email.trim().toLowerCase())
  .sort((a, b) => a.localeCompare(b));`
  },
  {
    id: 'ts-fetch-retry',
    title: 'Fetch with Exponential Backoff',
    language: 'typescript',
    difficulty: 'intermediate',
    description: 'Resilient network fetch with retry loop and async delay.',
    code: `async function fetchWithRetry<T>(url: string, retries = 3, delay = 1000): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry<T>(url, retries - 1, delay * 2);
  }
}`
  },

  // Python
  {
    id: 'py-binary-search',
    title: 'Iterative Binary Search',
    language: 'python',
    difficulty: 'beginner',
    description: 'Standard fast logarithmic binary search on sorted array.',
    code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  },
  {
    id: 'py-memoize-cache',
    title: 'Memoization Decorator',
    language: 'python',
    difficulty: 'intermediate',
    description: 'Clean cache wrapper using dict and functools.',
    code: `from functools import wraps

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper`
  },
  {
    id: 'py-async-gather',
    title: 'Asyncio Concurrent Task Gather',
    language: 'python',
    difficulty: 'intermediate',
    description: 'Dispatching concurrent IO tasks with asyncio.gather.',
    code: `import asyncio

async def fetch_endpoint(session, url: str) -> dict:
    async with session.get(url) as response:
        return await response.json()

async def main(urls: list[str]):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_endpoint(session, u) for u in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)`
  },

  // Rust
  {
    id: 'rs-custom-result',
    title: 'Custom Error & Result Matching',
    language: 'rust',
    difficulty: 'intermediate',
    description: 'Enum definition, error handling, and match pattern syntax.',
    code: `#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    PermissionDenied,
}

pub fn load_config(path: &str) -> Result<String, AppError> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(_) => Err(AppError::NotFound(path.to_string())),
    }
}`
  },
  {
    id: 'rs-struct-impl',
    title: 'Struct with Impl & Constructor',
    language: 'rust',
    difficulty: 'beginner',
    description: 'Rust struct definition and associated method pattern.',
    code: `pub struct BoundedQueue<T> {
    items: Vec<T>,
    capacity: usize,
}

impl<T> BoundedQueue<T> {
    pub fn new(capacity: usize) -> Self {
        Self { items: Vec::with_capacity(capacity), capacity }
    }

    pub fn push(&mut self, item: T) -> bool {
        if self.items.len() >= self.capacity { return false; }
        self.items.push(item);
        true
    }
}`
  },

  // Go
  {
    id: 'go-worker-pool',
    title: 'Worker Pool with Channels',
    language: 'go',
    difficulty: 'intermediate',
    description: 'Concurrent worker pool processing jobs through channels.',
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        // simulate unit of work
        results <- j * 2
    }
}

func runPool(workers int, jobCount int) {
    jobs := make(chan int, jobCount)
    results := make(chan int, jobCount)
    for w := 1; w <= workers; w++ {
        go worker(w, jobs, results)
    }
}`
  },
  {
    id: 'go-http-handler',
    title: 'HTTP JSON Endpoint Handler',
    language: 'go',
    difficulty: 'beginner',
    description: 'Standard net/http JSON response writer with error check.',
    code: `func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    resp := map[string]string{"status": "healthy", "service": "api"}
    if err := json.NewEncoder(w).Encode(resp); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}`
  },

  // SQL
  {
    id: 'sql-window-ranking',
    title: 'Window Function Dense Rank',
    language: 'sql',
    difficulty: 'intermediate',
    description: 'Complex analytic window ranking across partitions.',
    code: `WITH ranked_orders AS (
  SELECT
    customer_id,
    order_id,
    amount,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) as seq
  FROM orders
  WHERE status = 'completed'
)
SELECT customer_id, order_id, amount
FROM ranked_orders
WHERE seq = 1;`
  },
  {
    id: 'sql-aggregate-stats',
    title: 'Aggregate Stats with Filters',
    language: 'sql',
    difficulty: 'beginner',
    description: 'GROUP BY query with HAVING clause and conditional aggregates.',
    code: `SELECT
  department_id,
  COUNT(*) AS total_employees,
  ROUND(AVG(salary), 2) AS avg_salary,
  MAX(salary) - MIN(salary) AS salary_spread
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 5
ORDER BY avg_salary DESC;`
  },

  // HTML / CSS
  {
    id: 'css-glass-card',
    title: 'Modern CSS Glassmorphism Card',
    language: 'html-css',
    difficulty: 'beginner',
    description: 'CSS backdrop filter and border highlight styling.',
    code: `.surface-glass {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`
  },

  // Git / Shell
  {
    id: 'git-rebase-pipeline',
    title: 'Git Branch Cleanup Workflow',
    language: 'git-bash',
    difficulty: 'beginner',
    description: 'Shell commands for syncing feature branch with upstream main.',
    code: `git fetch origin main
git checkout feature/auth-refactor
git rebase origin/main
git push origin feature/auth-refactor --force-with-lease`
  }
];
