# Alpine.js + Blade: The Boring Stack That Ships Fast

Every few months I get asked to help a client decide between React, Vue, Livewire, or Inertia for the frontend of a new Laravel app. The honest answer for maybe a third of these projects is: **none of them**. Use Blade. Sprinkle Alpine on top. Ship in a week.

This isn't a hot take — it's just what works for content-and-form CRUD apps where the page is mostly server-rendered and you need *some* interactivity, not a SPA.

## What Alpine actually is

Alpine.js is a 10KB script you drop into your layout. It adds attributes — `x-data`, `x-show`, `x-on`, `x-model`, `x-for` — that let you write small reactive widgets directly in HTML.

```blade
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle menu</button>
  <ul x-show="open" x-transition>
    <li>Dashboard</li>
    <li>Settings</li>
  </ul>
</div>
```

That's an entire collapsible menu. No build step. No component file. No reactive store. Just HTML.

## Where it earns its keep

Real things I've built with Alpine + Blade in the last year, that didn't need React:

- A multi-step form with conditional fields that show based on earlier answers.
- A search box that filters a server-rendered table live, then falls back to a fetch + replace at 500ms.
- Inline editing on a settings page — click a value, it becomes an input, blur to save via a tiny `fetch`.
- A dropdown nav with keyboard arrow-key navigation.
- A "copy to clipboard" button with a confirmation toast.

None of these need a SPA. None need component composition. Each one is between 5 and 30 lines of Alpine inside an existing Blade file.

## The Laravel pattern

The page is still Blade — server-rendered, SEO-ready, no hydration concerns. Alpine handles micro-interactions. Forms post to Laravel like 2014.

For things that need a roundtrip but not a page reload — say, deleting a row — I use Alpine's `fetch` plus Laravel's CSRF token:

```blade
<button x-data
        @click="
          if (!confirm('Delete?')) return
          fetch('/items/{{ $item->id }}', {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' }
          }).then(() => $el.closest('tr').remove())
        ">
  Delete
</button>
```

That's it. No JS file. No build step. It works.

## What about Livewire?

Livewire is genuinely good, but it has costs: every interaction hits your server, you ship a non-trivial JS runtime, and your team needs to learn its component model. For a small project, Alpine + a sprinkle of vanilla `fetch` is lighter on every axis: bytes, latency, learning curve.

I'd reach for Livewire when the *Alpine version* would be more complex than the *Livewire version* — usually when you have many interconnected fields, validation that needs server-side rules, or large reactive lists.

## When NOT to use this stack

- Stateful, navigation-heavy UIs (Trello, Notion). React/Vue earn their weight here.
- Real-time, presence, collaboration. WebSockets + a real client framework.
- Mobile-first PWA with offline. You need a SPA.

## The boring point

For roughly half of the Laravel apps I touch, the right answer is Blade + Alpine + a couple of small fetch calls. It's faster to write, faster to read, faster to deploy, and easier for the next developer to maintain. Boring stacks don't win conference talks but they ship products.
