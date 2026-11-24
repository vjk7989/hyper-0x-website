---
title: 'How Do You Prove an LLM Got Worse With No Baseline?'
description: 'Without a baseline you usually cannot prove an LLM got worse. Learn what evidence you can still find, how to find the cause and what to record today.'
author: 'Buckleson Engineering'
authorImage: '@/images/brand/buckleson.png'
authorImageAlt: 'Buckleson logo'
pubDate: 2026-11-24
readTime: 6
tags: ['AI agents', 'Observability', 'LLM quality']
faqs:
  - question: 'Can you prove an LLM got worse if you never saved a baseline?'
    answer: 'Usually not in full. Saying a model got worse compares two states, and you hold only one. You can still build partial evidence from old outputs, logs and user reports, and you can record a baseline from today.'
  - question: 'How do you tell a model change from a change you made?'
    answer: 'Replay the same saved inputs with your old prompt and settings, then with the current ones. If the old setup gives the old results, your own change caused it. If not, look at the model or its service.'
  - question: 'What is the smallest baseline worth keeping?'
    answer: 'A fixed set of real inputs, the outputs you accepted, the exact model name, the prompt and the settings. Rerun the set on a schedule and keep every result with its date.'
---

You usually cannot prove an LLM got worse if you never recorded a baseline. A claim of decline compares two states, and you hold only one. You can still gather partial evidence, and you can make the next decline provable.

## Why can you not prove it after the fact?

You cannot prove it because a decline is a comparison, and a comparison needs two terms. Today's outputs describe the current model. They do not show that anything changed. Without saved earlier outputs, a feeling of "worse" stays a feeling.

The best published method has the same limit. Kübler and colleagues at Amazon describe a statistical test for model degradation, presented at ICLR 2026 (arXiv:2602.10144). It compares paired results from a reference model and the suspect model on the same inputs. You need both sides, so it helps only if you prepared.

## What evidence can you still find?

You can still find saved model outputs, logs, support tickets, cached responses and the history of your prompts. Each is a partial record of how the system behaved earlier. None is a full baseline, and you should say so when you report findings.

- **Logged outputs.** If you stored past responses, rerun the same inputs now and compare. Check that the stored responses came from a known model name.
- **Support tickets and user reports.** They show when people began to complain. They show timing, not cause, and they can reflect a change in who uses the product.
- **Cached responses.** Any response cache holds real earlier answers to real inputs. Treat it as a sample, because the cache keeps only what was asked.
- **Prompt and config history.** Your version control shows when each prompt and setting changed. Line these dates up against the date the decline began.
- **Provider notices.** Read the changelog and status pages of your provider for the period. Quote only what they actually state.

Be honest about what the pieces add up to. Old outputs that you replay on today's model give a real comparison for those inputs only. They do not describe all your traffic.

## How do you tell a model change from your own change?

Replay the same saved inputs twice: once with your old prompt and settings, and once with the current ones. Change one thing at a time. If the old setup still gives the old results, your own change caused the decline.

Check your own side first. Edits to prompts, changes to retrieval, new tools and a different mix of inputs are all common causes. A model that behaves differently is only one possibility on the list.

If the old setup no longer reproduces the old results, look at the model next. Confirm that you called the same model name, with the same settings. A provider can serve different behaviour under one name, so record what you observe and avoid guessing at the reason.

## What should you record today?

Record a fixed set of real inputs, the outputs you accepted, the exact model name, the prompt and the settings. Rerun that set on a schedule and store each result with its date. From then on, you hold a baseline.

1. **Capture reference pairs.** Pick inputs that represent your real use, including hard ones. Save the output a person judged good.
2. **Pin versions.** Where your provider offers a fixed model version, call it by that exact name. Write the name beside every result.
3. **Sample continuously.** Keep a small, steady sample of live inputs and outputs, with redaction of personal data where it applies.
4. **Keep an evaluation set.** Score the reference pairs by a rule you wrote down before you looked at the results.
5. **Log every change.** Record each edit to a prompt, a tool, a retrieval setting or a model, with its date.

With paired results from the same inputs, a paired statistical test such as the one in the paper above becomes possible. That is the point at which you can say a decline is real, and how large it is.

## Where does observability fit?

Observability fits as the place where these records live without extra effort. H0x-ADE records traces, logs and evaluations of each agent task, so past inputs, outputs and changes sit together with their dates.

That record does not decide whether quality fell. A person or a rule you set reads it. Our guide to [AI agent observability](../ai-agent-observability/) explains the three kinds of record in detail.

The record also feeds improvement. [Self-improving AI agents](../self-improving-ai-agents/) shows how teams use it to change the harness, the prompts, tools and rules around the model. It also covers training your own model.
