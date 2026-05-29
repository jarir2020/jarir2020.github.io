# The Eloquent N+1 Trap That Killed My Page Load

A list page on one of our internal tools went from 200ms to 8 seconds overnight. No new features. No bigger dataset. Just a one-line template change.

The culprit was a classic N+1 query. Here's the story, the diagnosis, and what I do now to make sure it never silently slips back in.

## The setup

The page lists invoices. Simple table — invoice number, customer name, amount, status.

```blade
@foreach ($invoices as $invoice)
  <tr>
    <td>{{ $invoice->number }}</td>
    <td>{{ $invoice->customer->name }}</td>
    <td>{{ $invoice->total }}</td>
    <td>{{ $invoice->status }}</td>
  </tr>
@endforeach
```

The original controller:

```php
$invoices = Invoice::with('customer')->latest()->paginate(50);
```

200ms. Fine.

## The change that broke it

Someone added a column showing the customer's company name. The Customer model has a `belongsTo(Company::class)` relation.

```blade
<td>{{ $invoice->customer->company->name }}</td>
```

That's it. One chained relation in Blade. Page time: 8 seconds.

## What happened

`with('customer')` eager-loads customers in one query — fine. But `customer->company` was NOT in the eager-load chain. So Laravel quietly fired one query per customer to fetch its company. 50 invoices = 50 extra queries.

Multiply that by anywhere the page autoloads and you're in pain.

## The fix

Two characters added — `.company`:

```php
$invoices = Invoice::with('customer.company')->latest()->paginate(50);
```

Back to 200ms.

## How I find these now

**1. Laravel Debugbar in dev, with the query counter visible.** If a single page is firing more than ~10 queries, something is unloaded.

**2. `Model::preventLazyLoading()` in non-prod.** Add to `AppServiceProvider::boot()`:

```php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
```

Now any lazy load throws `LazyLoadingViolationException` in dev. Forces you to declare eager loads up front.

**3. Telescope in staging.** Queries tab, sort by count desc per request. N+1 stands out instantly.

## Defaults I now use

- `preventLazyLoading()` on day one of any new Laravel project.
- Eager-load chains live in the controller / repository / service — never improvised in Blade.
- For deep chains, scope them: `Invoice::with(['customer.company:id,name'])` to limit columns.

The cost of a missed `with()` scales with your traffic. Detect it locally or detect it via a paged engineer.
