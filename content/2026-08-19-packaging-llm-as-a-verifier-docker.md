+++
title = "Running LLM-as-a-Verifier Locally on a Low-Cost Setup"
date = 2026-08-18T21:37:36Z

[taxonomies]
tags = ["Docker", "LLM", "Verification", "Open Source"]
+++
Running an LLM verifier does not have to start with an expensive hosted API or a dedicated inference cluster. I am working on a low-cost local implementation of [LLM-as-a-Verifier](https://github.com/llm-as-a-verifier/llm-as-a-verifier), using a local model backend and Docker only to package the verifier service.

The goal is practical: make the paper's verification idea runnable on hardware that is already available, keep the model outside the container, and make the setup easy to test before spending more compute.

Large language models are often used to generate several candidate answers and then choose one with another model acting as a judge. That pattern is useful, but a single discrete judgment throws away much of the verifier model's uncertainty.

[LLM-as-a-Verifier](https://github.com/llm-as-a-verifier/llm-as-a-verifier) takes a different approach. It reads token-level log probabilities for ordered score tokens and turns that distribution into a continuous reward. The reward can then drive best-of-N selection, progress tracking, or preference comparison.

I am packaging the project as a small Docker deployment in [docker-llm-as-a-verifier](https://github.com/cawa0505/docker-llm-as-a-verifier). The repository is a deployment wrapper, not a reimplementation of the research method. The upstream paper and source repository remain the authority for the algorithm, experiments, and reported results.

## The deployment boundary

The container does not serve a model. It installs the `llm-verifier` package and exposes a thin HTTP service around it. The actual model runs behind an external OpenAI-compatible endpoint that must return token-level logprobs.

That boundary keeps the image small and makes the deployment useful with a low-cost local backend, including llama.cpp, vLLM, or SGLang. A compatible hosted API can work too, but it is not the point of this example: the intended path is local inference without a large cloud bill.

```text
client
  |
  v
Docker container :8010
  |  /health
  |  /v1/compare
  |  /v1/select
  v
OpenAI-compatible backend :/v1
  |
  v
verifier model with token logprobs
```

The main configuration is deliberately small:

```dotenv
OPENAI_BASE_URL=http://host.docker.internal:8080/v1
MODEL_ALIAS=qwen3.5-9b
OPENAI_API_KEY=EMPTY
VERIFIER_PORT=8010
VERIFIER_MIN_SCORE=0.8
```

`OPENAI_BASE_URL` is the important setting. The backend must support the logprob information that the verifier needs; an API that only returns final text is not enough for this deployment.

## Running the service

After cloning the repository, copy the example environment file and set the backend URL:

```bash
git clone https://github.com/cawa0505/docker-llm-as-a-verifier.git
cd docker-llm-as-a-verifier
cp .env.example .env
# Edit .env for your backend
docker compose build
docker compose up -d
```

The default service port is `8010`. The first check is intentionally boring:

```bash
curl http://localhost:8010/health
```

The response reports the service status, configured model alias, and backend URL. This catches a container or configuration problem before sending a verification request.

## What the wrapper exposes

The service currently wraps two core operations:

- `/v1/compare` compares two candidates and returns their verifier rewards.
- `/v1/select` evaluates a candidate set and returns the selected candidate and ranking information.

The underlying Python library provides more capabilities, but those are not exposed by this Docker API yet. The current wrapper starts with the smallest useful surface for smoke tests and integration. The remaining endpoints are being implemented as the local deployment grows.

A deployment wrapper should make the upstream contract visible instead of hiding it. In this case, that means documenting the logprob requirement, the external model boundary, and the fact that the container is not the inference server.

## API roadmap

The next work is to expose more of the upstream library through the same HTTP service. These are planned or in-progress endpoint implementations, not features that are already available today.

### P1: track agent progress

`track(problem, steps, checkpoint_steps, n_evaluations, ...)` will score an agent trajectory at each checkpoint. This is the most relevant next endpoint for a local agent workflow: it can show whether a long-running patch is moving toward a verified result, instead of waiting until the entire trajectory ends.

One concrete target is StateMachineMcp. A state machine can submit its observed steps and receive a progress signal while a patch is being developed. The roadmap describes this as an O(K) checkpoint-oriented cost, where K is the number of checkpoints.

### P2: batch directed scoring

The batch scoring API will handle many directed `(A, B)` comparisons, with disk-cache merging and configurable parallel evaluation. This is useful when a local experiment needs to compare more than one candidate pair without rebuilding the orchestration around each request.

### P3: finer-grained scoring controls

The lower-level scoring APIs will expose a single criterion comparison and the pure computation that derives directed rewards from scored data. These endpoints give callers more control than the higher-level `compare` and `select` operations, but they also expose more of the verifier's internal contract, so they come after trajectory tracking and batch scoring.

### P4: supporting utilities

The roadmap also includes small utilities for loading prompt criteria, formatting token-usage reports, and creating an OpenAI client from environment variables. They are not headline endpoints, but they reduce repeated setup code for local deployments.

The roadmap is intentionally incremental. First make a low-cost local `compare` and `select` service work, then add the API needed by real agent workflows, and only afterward expose lower-level controls that need stronger compatibility guarantees.

## Smoke tests are part of the image

The repository includes two one-off checks that run through Docker Compose:

```bash
# Backend connectivity and logprob support
docker compose run --rm verifier python scripts/smoke_test.py

# Core compare() and select() behavior
docker compose run --rm verifier python scripts/verifier_smoke_test.py
```

The first test checks the dependency that is easiest to overlook: whether the configured backend actually returns usable logprobs. The second test checks the wrapper's core verifier operations with assertions.

This split is useful during setup. If the connectivity test fails, changing selection logic will not help. If connectivity works but the verifier smoke test fails, the problem is closer to the package or wrapper contract.

## Why use Docker for a local setup?

The research code is Python, but the deployment problem includes more than installing a package. A repeatable service needs a known entrypoint, a stable port, configuration through environment variables, persistent locations for cache and results, and a command that can run tests without entering the container manually.

Docker Compose provides those pieces with a small amount of configuration. More importantly, it leaves the model backend outside the image. The model can stay on the local machine, while the verifier service remains isolated and reproducible. This avoids baking a large model or a machine-specific serving stack into the example.

The current layout is intentionally plain:

```text
.
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── scripts/
    ├── entrypoint.sh
    ├── server.py
    ├── smoke_test.py
    └── verifier_smoke_test.py
```

The cache and result directories are mounted at `/app/cache` and `/app/results` for commands that use them. They are operational state, not source code, so they remain outside the image lifecycle.

## What this example does not claim

This repository does not reproduce the upstream benchmarks, provide a new verifier algorithm, or include a model server. It packages the upstream library for a reproducible Docker-based service.

For the method and evaluation details, read the original project:

- [LLM-as-a-Verifier source repository](https://github.com/llm-as-a-verifier/llm-as-a-verifier)
- [LLM-as-a-Verifier paper](https://arxiv.org/abs/2607.05391)
- [Upstream documentation](https://llm-as-a-verifier.com/docs/)

The useful engineering lesson is narrower: when an AI research package has a clear backend contract, a small deployment wrapper can make a low-cost local experiment testable and repeatable without pretending to own the research implementation.

## Next steps

The next practical step is to connect the container to a local backend that exposes logprobs and run the two smoke tests before trying larger candidate pools. After that, the service can be integrated into an agent workflow that generates multiple trajectories and asks the verifier to compare or select among them.

That keeps the first deployment honest: verify the transport and model contract first, then measure selection behavior under the workload that matters.

## Citation

If you use the underlying research, please cite the upstream authors:

```bibtex
@misc{kwok2026llmasaverifiergeneralpurposeverificationframework,
  title={LLM-as-a-Verifier: A General-Purpose Verification Framework},
  author={Jacky Kwok and Shulu Li and Pranav Atreya and Yuejiang Liu and Yixing Jiang and Chelsea Finn and Marco Pavone and Ion Stoica and Azalia Mirhoseini},
  year={2026},
  eprint={2607.05391},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2607.05391}
}
```
