# Node.js Basics

## The event loop
Node.js runs JavaScript on a single thread using an event loop. When a request needs slow I/O —
a database query, an API call, reading a file — Node does not wait. It offloads the I/O and moves
on to serve other requests, then runs a callback when the I/O finishes. This non-blocking model is
why a single thread can handle thousands of concurrent connections.

## CPU-bound vs I/O-bound
I/O-bound work (waiting on external systems) suits Node well because the thread stays free while
waiting. CPU-bound work (heavy computation) is different: it blocks the single thread and freezes
all other requests. Heavy computation should be moved off the main thread using worker threads or
a background job queue.

## Middleware in Express
Middleware are functions that run in order during the request-response cycle. They can read or
modify the request and response, or end the cycle. Common uses include parsing JSON bodies,
authentication, validation, logging, and error handling.

## Promises and async/await
A Promise represents a value that will be available later. async/await is syntax that lets you
write asynchronous code that reads like synchronous code, using try/catch for error handling.
Promise.all runs tasks in parallel and fails fast; Promise.allSettled waits for all and never
rejects; Promise.race resolves with the first to settle.
