import { CreateDummyDto } from "infra/dto/create.dummy.dto";
import DummyRepository from "infra/repositories/DummyRepository";
import opentracing from "opentracing";

/**
 * Send Payload to dummy repository
 * @exports CreateTodo instance
 */
class CreateTodo {
  dummyRepository: DummyRepository;

  constructor({ dummyRepository }: { dummyRepository: DummyRepository }) {
    this.dummyRepository = dummyRepository;
  }

  execute(payload: CreateDummyDto, span: opentracing.Span | opentracing.SpanContext) {
    return this.dummyRepository.create(payload, span);
  }
}

export default CreateTodo;
