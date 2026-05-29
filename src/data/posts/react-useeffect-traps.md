# Three useEffect Traps That Bit Me in Production

`useEffect` is the React hook I've watched the most engineers get wrong, including myself. The footguns are subtle — code passes review, runs in dev, ships, and then breaks in a way that looks like an unrelated bug.

Here are three traps I've actually hit, and what I do now to avoid them.

## 1. The stale closure

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const sub = subscribe(roomId, (msg) => {
      setMessages([...messages, msg])
    })
    return () => sub.unsubscribe()
  }, [roomId])

  return <MessageList items={messages} />
}
```

Looks fine. **It loses messages.**

The callback inside `subscribe` captures `messages` from the render where the effect ran. New messages arrive — but `messages` inside the closure is still the empty array from mount. Each `setMessages` overwrites with `[...emptyArray, msg]` = a one-item array.

The fix: use the updater form of `setState`. State setters always see the latest state.

```jsx
const sub = subscribe(roomId, (msg) => {
  setMessages((prev) => [...prev, msg])
})
```

Now there's no stale closure. The deps array becomes honest too — `[roomId]` is genuinely the only thing the effect depends on.

## 2. The missing cleanup race

```jsx
function User({ id }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then(setUser)
  }, [id])

  return user && <Profile user={user} />
}
```

User navigates `id=1` → `id=2` → `id=1` quickly. Two fetches are in-flight at the same time. The slower one wins, even if it's stale. You can see user 2's profile under id 1 in the URL.

Fix with a cancellation flag:

```jsx
useEffect(() => {
  let cancelled = false
  fetch(`/api/users/${id}`)
    .then((r) => r.json())
    .then((data) => {
      if (!cancelled) setUser(data)
    })
  return () => { cancelled = true }
}, [id])
```

Or use `AbortController` if your fetch supports it (most do). Either way: every async effect needs a cancel path. There are no exceptions to this rule.

## 3. The dep-array lie

```jsx
const config = { url: '/api', interval: 5000 }

useEffect(() => {
  const t = setInterval(() => poll(config), config.interval)
  return () => clearInterval(t)
}, [config])
```

`config` is a new object literal every render. The effect re-runs every render. The interval gets cleared and re-created on every keystroke elsewhere.

Three fixes, ranked:

1. **Inline the primitives.** `}, [config.url, config.interval])` — depends only on the values you care about.
2. **Move the object outside the component** if it's a constant.
3. **`useMemo`** if it has to be computed.

Don't memoise reflexively, but recognise when you've created a reference that lies about being stable.

## What I do now

- ESLint with `react-hooks/exhaustive-deps` set to `error`, not `warn`. The CI catches the deps lies for me.
- Every effect that does I/O has a cleanup. No exceptions.
- I read each effect aloud: "when X changes, do Y, and undo it like Z." If the third part is missing, I haven't finished.

Hooks aren't hard. The mental model just demands you respect closures and lifetimes. Skip that and they will bite you in prod.
