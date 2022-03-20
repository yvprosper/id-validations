import DummyRepository from "infra/repositories/DummyRepository";
import opentracing from "opentracing";

/**
 * Send Payload to dummy repository
 * @exports GetAllTodo instance
 */
class GetAllTodo {
  dummyRepository: DummyRepository;

  constructor({ dummyRepository }: { dummyRepository: DummyRepository }) {
    this.dummyRepository = dummyRepository;
  }

  execute(span: opentracing.Span | opentracing.SpanContext) {
    return this.dummyRepository.getAll(span);
  }
}

export default GetAllTodo;
