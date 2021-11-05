# TS Nanotest

[![npm version](https://badge.fury.io/js/ts-nanotest.svg)](https://www.npmjs.com/package/ts-nanotest)
![CI](https://github.com/omothm/ts-nanotest/actions/workflows/ci.yml/badge.svg)

Bare-bones Typescript test runner. No bells and whistles. Zero-config.

## Installation

Install via NPM:

    $ npm install --save-dev ts-nanotest

Use it in the test script:

```jsonc
// package.json

{
  // ...
  "scripts": {
    // ...
    "test": "ts-nanotest **/*.test.ts"
  }
}
```

You can drop `**/*.test.ts` as it is assumed by default.

## Usage

Create a test class as follows:

```typescript
// cook.test.ts

import { TestCases, TestSuite } from 'ts-nanotest';
import assert from 'assert';

export default class CookTest extends TestSuite {
  override tests(): TestCases {
    return {
      'should cook lunch with low calories': () => {
        const lunch = cookLunch();
        assert.equal(lunch.calories, 'low');
      },
    };
  }
}
```

Nanotest does not use global definitions (such as `describe` and `it`). No assertion helpers either.
`assert` almost always suffices. You can still use assertion libraries with Nanotest.

Run the tests via NPM script:

    $ npm test

... or directly (needs global installation: `npm install --global ts-nanotest`):

    $ ts-nanotest <glob-pattern>...

## Hooks

`TestSuite` contains the following overrideable hooks:

- `beforeAll`
- `afterAll`
- `beforeEach`
- `afterEach`

All hooks can be `async`. The after-hooks are **always called**, even if the test failed.

### Example

```typescript
import { TestCases, TestSuite } from 'ts-nanotest';
import assert from 'assert';

export default class AdvancedCookTest extends TestSuite {
  override async beforeAll() {
    await turnOnTheStove();
  }

  override afterAll() {
    turnOffTheStove();
  }

  override async beforeEach() {
    await buyComponents();
  }

  override afterEach() {
    washTheDishes();
  }

  override tests(): TestCases {
    return {
      'should cook a delicious dinner': () => {
        const dinner = cookDinner();
        assert.equals(dinner.salt, 'perfect');
      },

      'should reject bad taste': async () => {
        const badDish = cookSomethingBad();
        await assert.rejects(async () => {
          await judge.taste(badDish);
        }, BadTasteError);
      },
    };
  }
}
```

## Why

Testing should be fast, easy, light, and manageable. These characteristics are especially important
if you are practising test-driven development (TDD).

**Fast.** Most projects should have all their tests run in a few _seconds_.

**Easy.** Writing tests should be as easy as writing production code. No learning curve.

**Light.** Test packages (not the tests themselves) should have almost no effect on the size of a
project.

**Manageable.** Test packages should interface with but be isolated from the production environment.

To achieve this, Nanotest includes only the bare minimum.
