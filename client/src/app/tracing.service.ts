import {Injectable} from "@angular/core";

import { trace, Tracer, context } from '@opentelemetry/api'
import { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'

@Injectable()
export class TracingService {

	provider = new WebTracerProvider()
	tracer!: Tracer

	configure() {
		this.provider.register({
			contextManager: new ZoneContextManager()
		})
		this.provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()))
		trace.setGlobalTracerProvider(this.provider)

		registerInstrumentations({
			instrumentations: [
				new DocumentLoadInstrumentation(),
				//@ts-ignore
				new XMLHttpRequestInstrumentation({ })
			]
		})

		this.tracer = this.provider.getTracer('client-poetry')
	}

	createSpan(spanName: string) {
		// https://github.com/open-telemetry/opentelemetry-js/blob/main/examples/tracer-web/examples/xml-http-request/index.js
		const span = this.tracer.startSpan(spanName)
	}
}
