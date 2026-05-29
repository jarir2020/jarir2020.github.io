# Stop Stuffing Controllers — Service Classes in Laravel

Almost every Laravel codebase I'm asked to clean up has the same shape: half the business logic lives in the controller, the other half lives in the model, and the rest is duplicated across an Artisan command, a queue job, and a webhook handler.

You don't need DDD, hexagonal architecture, or a "clean code" lecture to fix this. You need a folder called `Services/` and a class with one public method.

## The smell

```php
// app/Http/Controllers/OrderController.php
public function store(Request $request)
{
    $data = $request->validate([...]);

    $order = Order::create([
        'user_id' => auth()->id(),
        'total'   => collect($data['items'])->sum('price'),
        // ... 30 more lines
    ]);

    foreach ($data['items'] as $item) {
        $order->items()->create($item);
    }

    if ($order->total > 5000) {
        Mail::to(config('mail.admin'))->send(new HighValueOrder($order));
    }

    PaymentGateway::charge($order);
    event(new OrderPlaced($order));

    return response()->json($order);
}
```

Now you need to place orders from a queue job too. Copy-paste? Tests? Auth context? Cursing.

## The fix

```php
// app/Services/OrderService.php
class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
    ) {}

    public function place(User $user, array $items): Order
    {
        return DB::transaction(function () use ($user, $items) {
            $order = Order::create([
                'user_id' => $user->id,
                'total'   => collect($items)->sum('price'),
            ]);

            $order->items()->createMany($items);

            if ($order->total > 5000) {
                Mail::to(config('mail.admin'))->send(new HighValueOrder($order));
            }

            $this->payments->charge($order);
            event(new OrderPlaced($order));

            return $order;
        });
    }
}
```

Controller becomes:

```php
public function store(Request $request, OrderService $orders)
{
    $data = $request->validate([...]);
    $order = $orders->place($request->user(), $data['items']);
    return response()->json($order);
}
```

## What you get for free

- **Reuse** — the same `place()` is called from controller, queue job, Artisan, webhook.
- **Tests** — mock `PaymentGateway`, call `place()`, assert the rest. No HTTP layer involved.
- **Transactions** — one place to wrap, one place to debug.
- **Readability** — the controller now reads like a request router, which is its job.

## Rules I follow

1. One public method per service, named for the action (`place`, `cancel`, `refund`).
2. Inject collaborators, don't `new` them. Laravel's container does it for you.
3. Don't pass the `Request`. Pass the values the service actually needs.
4. Don't return Response objects. Return domain objects. The controller decides the HTTP shape.

It's not architecture. It's hygiene. And it pays back the first time you need to call the same logic from a second place.
