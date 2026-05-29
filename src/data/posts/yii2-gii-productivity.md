# Why I Still Reach for Yii2 GII for Internal Tools

Yii2 isn't trendy. The last major release was years ago. The internet has mostly moved on to Laravel, Symfony, or Node-flavoured frameworks.

But for one specific job — CRUD-heavy internal admin tools for clients who need a working backend yesterday — Yii2's GII generator is still the fastest tool I own.

## What GII actually does

You point GII at a database table. It generates:

- An ActiveRecord model with full validation rules pulled from column constraints.
- A controller with index / view / create / update / delete actions.
- View files with a working search form, sortable grid, and create/edit forms.
- Inline grid filters, pagination, sorting, CSV export-ready data provider.

No clicking through a UI builder. No dragging components. You get working PHP files you can read, modify, and commit. They're not pretty — but they're functional and editable.

## A typical session

Client needs a back-office for managing 20 lookup tables — countries, currencies, product categories, tax brackets, the lot.

```bash
# 1. design the schema in MySQL
# 2. fire up the Yii2 dev server
# 3. for each table:
./yii gii/model --tableName=countries --modelClass=Country
./yii gii/crud --modelClass=app\\models\\Country --controllerClass=app\\controllers\\CountryController
```

Or just use the GII web UI — same result. Twenty tables, ~30 minutes. Working admin with search, sort, pagination, and validation.

A Laravel + Filament setup gets you something prettier in the same time. A bespoke React admin takes a week. For an internal tool that 3 staff members will use, the Yii2 admin wins on cost-per-feature every time.

## What Yii2 still does better than its successors

- **GII is built into the framework**, not a third-party package you bolt on.
- **ActiveRecord with built-in validation rules** — type, length, fk, unique — generated from your schema. No FormRequest classes to write.
- **GridView is one line** and supports sort, filter, format, custom columns out of the box. Filament/Backpack require more configuration.
- **No frontend build step** required. Internal tool. Nobody cares about Lighthouse on an admin nobody outside the office will see.

## When I don't use it

- Customer-facing apps. Yii2's frontend story is dated; React/Vue with Laravel is a better fit.
- Anything that needs serious queueing, broadcasting, or modern auth flows. Laravel ecosystem is years ahead.
- Greenfield projects where the client cares about long-term ecosystem support.

## The point

Pick tools by job, not by trend. For 20-table internal admins on a fixed budget, GII still pays rent. Don't apologise for using the right tool just because the conference circuit moved on.
