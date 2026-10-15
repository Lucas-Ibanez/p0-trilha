import assert from "node:assert/strict";
import { test } from "node:test";
import { USE_CASE_MAX, validateWaitlist, type WaitlistInput } from "./waitlist.ts";

const valid: WaitlistInput = {
  email: "  Ana@Empresa.COM ",
  company: " Acme ",
  segment: "software_house",
  useCase: " revisar PRs ",
  consent: true,
};

test("normaliza e-mail (trim e minúsculas) e campos opcionais", () => {
  const result = validateWaitlist(valid);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, {
    email: "ana@empresa.com",
    company: "Acme",
    segment: "software_house",
    useCase: "revisar PRs",
  });
});

test("campos opcionais vazios viram null", () => {
  const result = validateWaitlist({ ...valid, company: "  ", useCase: "" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.company, null);
    assert.equal(result.value.useCase, null);
  }
});

test("rejeita e-mails inválidos", () => {
  for (const email of [
    "",
    "   ",
    "foo",
    "foo@bar",
    "a b@c.com",
    "@x.com",
    `${"a".repeat(250)}@x.com`,
  ]) {
    const result = validateWaitlist({ ...valid, email });
    assert.equal(result.ok, false, `"${email}" deveria falhar`);
    if (!result.ok) assert.equal(result.errors.email, true);
  }
});

test("exige perfil válido e consentimento", () => {
  const noSegment = validateWaitlist({ ...valid, segment: "" });
  assert.equal(noSegment.ok, false);
  if (!noSegment.ok) assert.deepEqual(Object.keys(noSegment.errors), ["segment"]);

  const unknownSegment = validateWaitlist({ ...valid, segment: "hacker" });
  assert.equal(unknownSegment.ok, false);

  const noConsent = validateWaitlist({ ...valid, consent: false });
  assert.equal(noConsent.ok, false);
  if (!noConsent.ok) assert.deepEqual(Object.keys(noConsent.errors), ["consent"]);
});

test("reúne todos os erros de uma vez", () => {
  const result = validateWaitlist({
    email: "x",
    company: "",
    segment: "",
    useCase: "",
    consent: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok)
    assert.deepEqual(Object.keys(result.errors).sort(), ["consent", "email", "segment"]);
});

test("limita o texto livre a USE_CASE_MAX", () => {
  const result = validateWaitlist({ ...valid, useCase: "x".repeat(USE_CASE_MAX + 50) });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.useCase?.length, USE_CASE_MAX);
});
