# checkout-demo

A demo for [arnx](https://github.com/arnx-dev/arnx). Not a real shop.

The `main` branch is a tiny checkout: a cart, shipping and tax. The `discount-codes` branch adds discount
codes, with tests that pass and **a bug we planted on purpose**. Run arnx on it and see whether it finds the bug.

You need Docker running, [arnx](https://github.com/arnx-dev/arnx#try-it) installed, and an Anthropic API key.

    git clone https://github.com/arnx-dev/checkout-demo && cd checkout-demo
    git switch discount-codes
    export ANTHROPIC_API_KEY=...
    arnx init
    arnx review

`arnx review` works out how to run the tests, reads the branch's change, writes tests for what looks broken and
runs them in Docker. Your key pays for the models. The report is in `.arnx/reviews/`.

Results vary between runs, because a model writes the tests.

`npm test` runs the demo's own tests.
