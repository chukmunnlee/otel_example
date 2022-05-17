# Run
```
ng serve --proxy-config ./proxy-config.js
```

# Open Telemetry Dependencies

```
npm install \
	@opentelemetry/api \
	@opentelemetry/sdk-trace-web \
	@opentelemetry/context-zone \
	@opentelemetry/instrumentation-document-load \
	@opentelemetry/instrumentation-xml-http-request \
	@opentelemetry/propagator-b3 \
	@opentelemetry/exporter-trace-otlp-http
```

# References
- [ Getting Started ](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/)
- [ JavaScript Example ](https://github.com/open-telemetry/opentelemetry-js/blob/main/examples/tracer-web/examples/xml-http-request/index.js)
- [ Getting a Tracer ](https://opentelemetry.io/docs/instrumentation/js/api/tracing)
