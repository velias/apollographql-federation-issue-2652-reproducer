# apollographql-federation-issue-2652-reproducer

Reproducer for [apollographql/federation/issues/2652](https://github.com/apollographql/federation/issues/2652)

## Requires
* yarn
* Node.js 18+

## How to run the reproducer
1. start subgraph in terminal 1 (runs on localhost port 4001)
```
cd subgraph
yarn install
yarn run
```
2. start gateway in terminal 2 (runs on localhost port 4000)
```
cd gateway
yarn install
yarn run
```
3. execute query against gateway, eg. open Explorer at http://localhost:4000 and run
```graphql
query Me {
  me
}
```
4. check console in gateway terminal 2, should be something like:
```
yarn run v1.22.19
$ node index.js
info: Open-telemetry initialized.
🚀  Server ready at http://localhost:4000/
warn: Can not execute the operation on ended Span {traceId: 42e7b305118918368657f9aa05679125, spanId: afec30473be46589} {"span_id":"afec30473be46589","trace_flags":"01","trace_id":"42e7b305118918368657f9aa05679125"}
```