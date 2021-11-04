# TS Nanotest

[![npm version](https://badge.fury.io/js/ts-nanotest.svg)](https://www.npmjs.com/package/ts-nanotest)
![CI](https://github.com/omothm/ts-nanotest/actions/workflows/ci.yml/badge.svg)

Bare-bones Typescript test runner. No bells and whistles.

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

You can drop `**/*.test.ts` as it is assumed by default, or change it to what suits your project.

## Usage

Create a test class as follows:

```typescript
// cook.test.ts

import { TestSpecs, TestSuite } from 'ts-nanotest';
import assert from 'assert';

export default class CookTest extends TestSuite {
  override tests(): TestSpecs {
    return {
      'should cook lunch': () => {
        const lunch = cookLunch();
        assert.equal(lunch.calories, 'low');
      },
    };
  }
}
```

Nanotest does not use global definitions (such as `describe` and `it`). No assertion helpers either.
Plain-old `assert` is deemed sufficient.

Run the tests via NPM script:

    $ npm test

... or directly (needs global installation: `npm install --global ts-nanotest`):

    $ ts-nanotest <glob-pattern>

## Hooks

`TestSuite` contains the following overrideable hooks:

- `beforeAll`
- `afterAll`
- `beforeEach`
- `afterEach`

All hooks can be `async`.

### Example

```typescript
import { TestSpecs, TestSuite } from 'ts-nanotest';
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

  override tests(): TestSpecs {
    return {
      'should cook dinner': () => {
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
