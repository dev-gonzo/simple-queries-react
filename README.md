<p align="center">
 <picture>
    <source width="400px" media="(prefers-color-scheme: dark)" srcset="logo-white.png">
    <source width="400px" media="(prefers-color-scheme: light)" srcset="logo.png">
    <img width="400px" src="logo.png" />
  </picture>

</p>

[![Version](https://img.shields.io/npm/v/simple-queries-react?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/simple-queries-react)
[![Downloads](https://img.shields.io/npm/dt/simple-queries-react.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/simple-queries-react)

**Streamlined Requests, Powerful Results**

With just a few lines of code, "simple-queries-react" transforms your API calls into something simple, fast, and scalable. Built on hooks and with a non-opinionated structure.

After spending considerable time reimplementing the same code and observing various derivatives gaining popularity, we realized the necessity of creating a small, robust, simple, and versatile abstraction layer.

Features We've Simplified Already:

- [x] GET Requests
- [x] POST Requests
- [x] PUT Requests
- [x] Patch Requests
- [x] Delete Requests
- [ ] Upload Requests
- [ ] Download Requests

## Installation

### Package Manager

Using npm:

```bash
$ npm install simple-queries-react
```

Using yarn:

```bash
$ yarn add simple-queries-react
```

## Create Your First GET Request

Your GET request is a hook. You can use it in any React component or hook. This example is really simple to implement.

With the following code, clicking the "Action Button" will trigger a GET request. Test it yourself:

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send } = useGet("http://example.com");

  return (
    <>
      <button onClick={() => send()}>Action Button</button>
    </>
  );
}
```

## Receive API Responses

You need to receive responses from your API; after all, that's why we make our beloved GET requests. See how simple it is:

Here, we simulate receiving a JSON response and simply display it on the screen.

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse } = useGet("http://example.com");

  return (
    <>
      <button onClick={() => send()}>Action Button</button>
      <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
    </>
  );
}
```

## Handling API Errors

Similarly, we can handle errors from our API. It would be nice if we only had good news for our users, but unfortunately, not everything is perfect.

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getErrors } = useGet("http://example.com");

  return (
    <>
      <button onClick={() => send()}>Action Button</button>
      <pre>{JSON.stringify(getErrors(), null, 2)}</pre>
    </>
  );
}
```

## Clearing Errors

Want to clear the errors? See how simple it is:

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getErrors, clearErrors } = useGet("http://example.com");

  return (
    <>
      <button onClick={() => send()}>Action Button</button>
      <button onClick={() => clearErrors()}>Clear Errors</button>
      <pre>{JSON.stringify(getErrors(), null, 2)}</pre>
    </>
  );
}
```

## Don't Forget About Loading

Loading indicators are indeed important, but do it your way; here we just provide an example:

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = useGet("http://example.com");

  if (isLoading()) {
    return <LoadingComponent />;
  }

  return (
    <>
      <button onClick={() => send()}>Action Button</button>
      <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
    </>
  );
}
```

## Here's Some Great News!

All the knowledge you've acquired up to this point is applicable across all our other hooks (usePost, usePut, usePatch, and useDelete).

It's entirely up to you how you leverage them to suit your application's specific requirements.

## Let's Dive into an Example of POST Request

Here's an example of sending a POST request with a body:

```jsx
import { usePost } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = usePost("http://example.com");

  return (
    <>
      <button
        onClick={() =>
          send({
            library: "simple",
            queries: "react",
          })
        }
      >
        Action Button
      </button>
      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

## Fantastic Resources for Your RESTful APIs

We've prepared fantastic resources to simplify your RESTful API usage. We construct your URL as shown in the example below. See how simple it is?

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = useGet("http://example.com");

  return (
    <>
      <button
        onClick={() =>
          send({
            // simples/123/queries
            pathRest: {
              simples: 123,
              queries: null,
            },
          })
        }
      >
        Action Button
      </button>
      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

## `pathRest`: the cherry on top.

When employing the pathRest property, you unlock the capability to tailor your requests with remarkable flexibility. This feature streamlines the construction of intricate URLs to cater to your application's precise requirements, seamlessly appending path segments as needed. Such a practice fosters superior organization and clarity within your API invocations, thereby easing code maintenance endeavors. In essence, leveraging the pathRest property presents an elegant and potent solution for managing the intricacies of HTTP requests, bolstering development efficiency and productivity. Don't forget to use null or undefined for resources lacking values.

```html
http://exemplo.com/simples/123/querires
```

## `params`: Simple, Practical, and Elegant

When you need to send parameters in your API requests, it couldn't be simpler:
​

```jsx
import { useGet } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = useGet("http://example.com");

  return (
    <>
      <button
        onClick={() =>
          send({
            // ?simples=123&queries=the%20best
            params: {
              simples: 123,
              queries: "the best",
            },
          })
        }
      >
        Action Button
      </button>

      <button
        onClick={() =>
          send({
            // ?simples=123
            params: {
              simples: 123,
              queries: null,
            },
          })
        }
      >
        Action Button (with null or undefined value)
      </button>

      <button
        onClick={() =>
          send({
            // ?simpleQueriesId=123&simpleQueriesText=the%20best
            params: {
              simpleQueries: {
                id: 123,
                text: "the best",
              },
            },
          })
        }
      >
        Action Button (Object with nested levels)
      </button>

      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

## `body`: Okay, I think we've made it clear that it's simple

Sending data in the body of your request? No problem, it's as easy as pie:

```jsx
import { usePost } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = usePost("http://example.com");

  return (
    <>
      <button
        onClick={() =>
          send({
            body: {
              simples: 123,
              queries: "the best",
            },
          })
        }
      >
        Action Button
      </button>

      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

## `Secret`: Combining Them All!

But we still haven't figured out why you would do that:

```jsx
import { usePost } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = usePost("http://example.com");

  return (
    <>
      <button
        onClick={() =>
          send({
            pathRest: {
              simples: 123,
              queries: null,
            },
            params: {
              simples: 123,
              queries: "the best",
            },
            body: {
              simples: 123,
              queries: "the best",
            },
          })
        }
      >
        Action Button
      </button>

      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

## `headers`: Changing Configuration

You might need to alter header configurations, and as usual, it's simple and practical. By default, we set the `Content-Type` header to `application/json`, but you can change this if needed.

```jsx
import { usePost } from "simple-queries-react";

function MyComponent() {
  const { send, getResponse, isLoading } = usePost({
    url: "http://example.com",
    headers: {
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },

    // This part is new
    errorFn: (data) => console.log("error", data),
  });

  
  return (
    <>
      <button
        onClick={() =>
          send()
        }
      >
        Action Button
      </button>

      {isLoading() ? (
        <LoadingComponent />
      ) : (
        <pre>{JSON.stringify(getResponse(), null, 2)}</pre>
      )}
    </>
  );
}
```

> **errorFn:** If you think it won't be noticed, fear not. If you need to handle errors within a function, such as saving logs or addressing any other requirements, simply pass your function here.

