import { CreateDummyDto } from "infra/dto/create.dummy.dto";
import publishToRabitmq, { PublishData } from "infra/libs/publishToRabitmq";
import BaseRepository from "infra/repositories/BaseRepository";
// import mongoose from "mongoose";
import mongoose from "mongoose";
import { IDummyDocument } from "infra/database/models/mongoose/Dummy";
import opentracing from "opentracing";
import { Client } from "@elastic/elasticsearch";
import { RedisClientType } from "redis/dist/lib/client";
import { RedisModules } from "redis/dist/lib/commands";
import { RedisLuaScripts } from "redis/dist/lib/lua-script";
import BaseError from "interfaces/http/errors/base";

class DummyRepository extends BaseRepository {
  Todo: mongoose.Model<IDummyDocument>;

  tracer: opentracing.Tracer;

  logSpanError: (arg0: opentracing.Span | opentracing.SpanContext, arg1: BaseError) => void;

  traceMongoQuery: (
    arg0: opentracing.Span | opentracing.SpanContext,
    arg1: string,
    arg2: unknown
  ) => void;

  cache: RedisClientType<RedisModules, RedisLuaScripts>;

  publishToRabitmq: (data: Array<PublishData>) => Promise<unknown>;

  elasticClient: Client;

  constructor({
    cache,
    elasticClient,
    models: { Dummy },
    tracing: { tracer, logSpanError, traceMongoQuery },
  }: {
    cache: RedisClientType<RedisModules, RedisLuaScripts>;
    elasticClient: Client;
    models: { Dummy: mongoose.Model<IDummyDocument> };
    tracing: {
      tracer: opentracing.Tracer;
      logSpanError: (span: opentracing.Span, error: BaseError) => void;
      traceMongoQuery: (
        parentSpan: opentracing.Span | opentracing.SpanContext,
        traceName: string,
        documentQuery: unknown
      ) => void;
    };
  }) {
    super({ Model: Dummy });
    this.Todo = Dummy;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.traceMongoQuery = traceMongoQuery;
    this.cache = cache;
    this.publishToRabitmq = publishToRabitmq;
    this.elasticClient = elasticClient;
  }

  /**
   * Create a todo
   * @param { CreateDummyDto } payload
   * @param {*} span
   * @returns {Promise}
   * @memberof DummyRepository
   */
  async create(
    payload: CreateDummyDto,
    span: opentracing.Span | opentracing.SpanContext
  ): Promise<unknown> {
    const { firstName, lastName, email } = payload;
    const parentSpan = this.tracer.startSpan("DummyRepository.create", {
      childOf: span,
    });

    try {
      return this.runInTransaction(async (session: mongoose.ClientSession) => {
        const dummy = new this.Todo({ firstName, lastName, email });
        await dummy.save({ session });

        return dummy;
      });
    } catch (error) {
      this.logSpanError(parentSpan, error);
      throw error;
    } finally {
      parentSpan.finish();
    }
  }

  /**
   * Get all todos
   * @returns {Promise}
   * @memberof DummyRepository
   */
  async getAll(span: opentracing.Span | opentracing.SpanContext): Promise<unknown> {
    const parentSpan = this.tracer.startSpan("DummyRepository.getAll", {
      childOf: span,
    });

    try {
      const dummies = await this.Todo.find({});
      return dummies;
    } catch (error) {
      this.logSpanError(parentSpan, error);
      throw error;
    } finally {
      parentSpan.finish();
    }
  }
}

export default DummyRepository;
