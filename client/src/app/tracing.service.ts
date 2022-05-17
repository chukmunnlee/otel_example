import {Injectable} from "@angular/core";

import { trace, Tracer, context, SpanKind, Attributes, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import { catchError, finalize, map, Observable, of, Subject} from "rxjs";
import {B3Propagator} from '@opentelemetry/propagator-b3';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http'

@Injectable()
export class TracingService implements HttpInterceptor {

	provider = new WebTracerProvider()
	tracer!: Tracer

	configure() {
		this.provider.addSpanProcessor(
			new BatchSpanProcessor(new ConsoleSpanExporter()))
		//this.provider.addSpanProcessor(
		//	new BatchSpanProcessor(new OTLPTraceExporter({ url: 'http://localhost:14268' })))

		this.provider.register({
			contextManager: new ZoneContextManager(),
			propagator: new B3Propagator()
		})

		registerInstrumentations({
			instrumentations: [
				new DocumentLoadInstrumentation(),
				//@ts-ignore
				new XMLHttpRequestInstrumentation({ }),
			]
		})

		this.tracer = this.provider.getTracer('client-poetry')
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// or use this.tracer.startActiveSpan
		const span = this.tracer.startSpan('poetrySvc',  {
			attributes: {
				[SemanticAttributes.HTTP_ROUTE]: req.url,
				[SemanticAttributes.HTTP_METHOD]: req.method
			},
			kind: SpanKind.PRODUCER
		})
		return context.with(trace.setSpan(context.active(), span), 
			() => next.handle(req)
				.pipe(
					map(event => {
						if (event instanceof HttpResponse)
							span.setStatus({
								code: SpanStatusCode.OK
							})
						return event
					}),
					catchError(event => {
						if (event instanceof HttpErrorResponse) {
							const err = event as HttpErrorResponse
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: `http status code: ${err.status}, message: ${err.message}`
							})
						}
						return of(event)
					}),
					finalize(() => span.end())
				)
		)
	}
}
