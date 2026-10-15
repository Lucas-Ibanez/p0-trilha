# 08 — Fatos do produto (fonte única)

> Fonte: *Hive (código: VeriCode): estado do MVP em 2026-10-07*, até o commit `faad06c` (`docs: record D11-D12 interface`), branch `main`. **Nada aqui é projeção.** Os mesmos valores, em formato de máquina e com as assinaturas completas, estão em `data/evidence.json`: **importe de lá; não digite hashes nem assinaturas.**
>
> ⚠ O relatório é de **2026-10-07**. Antes de publicar, confirme no repositório (`git log`, `README.md`, `docs/d11-ui-results.md`) se algo mudou. Se mudou, atualize **`evidence.json` primeiro**, depois este arquivo.

## 1. Nome

O produto se chama **Hive**. O código, os programas, a CLI e o repositório mantêm o nome legado **VeriCode** (`vericode_escrow`, `vericode`, `vericode-prover`, `X-VeriCode-Token`) e isso **não vai mudar**. Na página: marca **Hive**; os identificadores técnicos aparecem como são, e o rodapé explica o nome legado.

## 2. O que é, em fatos

- Um **escrow em Solana devnet** para uma tarefa de desenvolvimento entre duas partes, com pagamento condicionado a uma **prova RISC Zero**.
- Fluxo: o comprador deposita **Test USDC** num vault controlado pelo programa → o executor entrega um artefato restrito e gera, **na própria máquina**, uma prova de que um avaliador fixo rodou sobre ele → na **mesma transação**, o programa confere o vínculo entre prova, job e entrega, **verifica a prova Groth16 por CPI** e libera ao executor (`PASS`) ou devolve ao comprador (`FAIL`) → se ninguém liquidar até o prazo, qualquer um pode pedir o reembolso.
- **Claim congelado (frase 1):** ver `02-…` §3, com link de uma liquidação real ao lado.

## 3. Endereços e hashes (devnet)

| Item | Valor | Observação |
|---|---|---|
| Programa de escrow `vericode_escrow` | `GZqbL2TbeDVHcNRosngaRfCwzV9YJT6iEbckYr8uwkCH` | 395.064 bytes; **upgrade authority `none`**; finalização em `evidence.programs.escrow.finalizationTx` |
| Verificador Groth16 | `THq1qFYQoh7zgcjXoMXduDBqiZRCPeg3PvvMbrVQUge` | risc0-solana **v3.0.0** (commit `ee415935`); upgrade authority `None` |
| Mint Test USDC | `9TE2VPFmgrNxT22yS3sEZyRcMxLgJkwzgAoquWRXwV2F` | 6 decimais; sem freeze authority |
| ImageID admitido | `4da06f90da75ec8980c943ce017d69c48370fddbf3aa27689d375d78fac0fb1a` | Guest de 180.300 bytes |
| `JournalV1` | 165 bytes, v1 congelado | Offsets: 0 `schema_version`, 4 `job_id`, 36 `spec_hash`, 68 `harness_hash`, 100 `artifact_hash`, 132 `image_id`, 164 `verdict` |
| Termos v1 | spec `af642b56…b778`, harness `01124025…6b50` | Fixos no programa |
| Repositório | `https://github.com/Lucas-Ibanez/colosseum-hackathon-sparta` | Licença Apache-2.0 |

## 4. O que foi provado em devnet (rodada final, pela interface Hive, 2026-10-07)

Ciclo completo (U1–U10) em **11 min 16 s**; **10 transações novas** (5 do comprador, 5 do executor). Cada liquidação por prova invocou o verificador, que consumiu **99.541 CU**.

| # | Ação | Resultado | Em `evidence.json` |
|---|---|---|---|
| U1 | Novo job (T₃ `2c38ca66…`, prazo 1.560 slots) | `Funded` | `fundingTxs.U1` |
| U2 | Refund antes do prazo | **rejeitado**, `DeadlineNotReached` (6021, escrow) | `rejections[refundTooEarly]` |
| U3 | Novo job (P₃ `26df9ef4…`, prazo 9.000 slots) | `Funded` | `fundingTxs.U3` |
| — | Prova `(21, 42)` | `Composite` 7,2 s; `Groth16` 177,9 s; `PASS` | local, fora da cadeia |
| U4 | Receipt de outro job | **rejeitado**, `JournalJobIdMismatch` (6014, escrow) | `rejections[otherJobReceipt]` |
| U5 | Prova adulterada | **rejeitado**, `PairingError` (6003, verificador) | `rejections[tamperedProof]` |
| **U6** | Entrega e prova | **`Released`**: 1 Test USDC ao executor; 122.156 CU no total | `outcomes[released]` |
| U7 | Liquidar de novo | **rejeitado**, `AlreadyReleased` (6007, escrow) | `rejections[secondSettlement]` |
| U8 | Novo job (F₃ `7395a76d…`, prazo 9.000) | `Funded` | `fundingTxs.U8` |
| — | Prova `(7, 15)` | `Composite` 8,6 s; `Groth16` 91,4 s; `FAIL` | local, fora da cadeia |
| **U9** | Entrega e prova | **`RefundedOnFail`**: prova do `FAIL` verificada; 1 Test USDC ao comprador | `outcomes[refundedOnFail]` |
| **U10** | Refund com prazo vencido | **`RefundedOnTimeout`**: devolução ao comprador, **sem verificador** | `outcomes[refundedOnTimeout]` |

Saldos: o executor ganhou +1.000.000 unidades (1 Test USDC); o comprador perdeu líquido 1 Test USDC (três depósitos, dois reembolsos); o comprador pagou 3 × 3.581.400 lamports de rent mais taxas.

### 4.1 Os números que a página pode usar

| Número | Valor | Significado exato (usar estas palavras) |
|---|---|---|
| Desfechos liquidados | **3** | Released, RefundedOnFail, RefundedOnTimeout |
| Tentativas rejeitadas | **4** | Prova adulterada, journal de outro job, refund antes do prazo, segunda liquidação; todas **sem mover fundos** |
| Compute units do verificador | **99.541** | Consumidos pelo verificador Groth16 na transação de liquidação |
| Compute units totais (PASS) | 122.156 | Total da transação U6 |
| Journal | **165 bytes** | Tamanho do journal público de cada receipt |
| Tempo da prova `Composite` | **7–9 s** | Medido em WSL com 7,6 GiB de RAM |
| Compressão `Groth16` | **90–180 s** (≈ 1,5–3 min) | Idem |
| Ciclo completo U1–U10 | 11 min 16 s | Pela interface, em Chromium dirigido por script |
| Transações novas na rodada | 10 | 5 comprador, 5 executor, 0 do deployer |

## 5. Rodadas anteriores (mesmo programa, mesmos termos)

D4b (primeiro deploy e liquidações) · D7 (CLI e prover) · D9 (ambiente limpo: clone e targets novos, toolchains isoladas copiadas) · D10 (worker local). Detalhe no `README.md` e em `docs/d4b-…`, `d7-…`, `d9-…`, `d10-…`, `d11-ui-results.md`.

**Reprodutibilidade (dizer assim):** *reproduzido a partir de um clone, em ambiente limpo*. **Não** dizer "máquina nova".

## 6. Testes (se a página citar qualidade de engenharia, usar estes números e nada além)

`vericode-core` 42/42 · programa 61/61 · CLI 30/30 · prover 5/5 + 2/2 · worker + interface 53/53 · lint do `DESIGN.md` 0 erros. Revisões adversariais internas, separadas e somente leitura (R-D2, R-D2e, R-D4a, R-D7, R-D10a); **R-UI em andamento** na data do relatório.

## 7. Limitações conhecidas (a página precisa ser coerente com todas)

- **Rede:** só devnet e Test USDC; sem mainnet nem dinheiro real.
- **Sem Verifier Router:** o Router upstream em devnet nunca foi inicializado; a verificação é por **CPI direta** ao verificador.
- **Sem e-stop:** um bug só se corrige com um novo program ID.
- **Regra v1 trivial** (`saída = 2 × entrada`), escolhida pelo executor; qualquer `(n, 2n)` passa.
- **Rent:** ~0,0036 SOL por job fica preso (não há `close`).
- **Test USDC:** a mint authority é a chave de deployer do projeto.
- **Um operador só:** o mesmo operador local opera comprador e executor pelo worker; **não há carteira no navegador**.
- **Prover:** exige Docker x86 e bastante memória.
- **RD7-08 (aberto):** um negativo `escrow:6021` enviado perto do prazo pode virar reembolso real.
- **Pendências visuais da marca:** favicon não existe (`TODO(brand)`); SVGs de marca provisórios; dark mode preparado por tokens, não é o acabamento canônico.

## 8. Roadmap que a página pode citar (e só como **Planejado**)

1. Substituir a regra v1 trivial por **avaliadores determinísticos para tarefas reais e delimitadas**, ainda sobre artefatos restritos.
2. **Pilotos** que comparam evidência zkVM com mecanismos mais simples (CI assinado, revisão humana).

Qualquer outra coisa (marketplace, reputação, score, outros meios de pagamento, multiagente, governança ampla) é **Visão** ou **decisão em aberto** (D14), e **não** deve ser apresentada como plano firme.

## 9. Lista "Não dizer" (README, congelada)

"o código está correto" · "trustless" · "qualquer repositório" · "Verifier Router" como caminho atual · "mainnet" · "ZK on-chain" sem a frase 1 · "auditado" · "privado" · "máquina nova". A lista expandida (com alternativas) está em `02-claims-and-voice.md` §4.

## 10. Equipe (se a decisão D7 aprovar o bloco)

Lucas Ibanez, CEO & CTO (arquitetura técnica, verificação e liquidação on-chain) · Henrique Martins, Strategy Lead (posicionamento, pesquisa de mercado, estratégia de pilotos) · Leonardo Papandrea, COO & CPO (fluxo de aceite, prioridades de produto, operações). Fonte: site atual.
